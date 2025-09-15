from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime
from services.llm_service import LLMService
from services.database_service import DatabaseService
from services.text_processor import TextProcessor

app = FastAPI(title="LLM Knowledge Extractor", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],  # Frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
llm_service = LLMService()
db_service = DatabaseService()
text_processor = TextProcessor()

class TextAnalysisRequest(BaseModel):
    text: str

class TextAnalysisResponse(BaseModel):
    id: str
    summary: str
    title: Optional[str]
    topics: List[str]
    sentiment: str
    keywords: List[str]
    confidence_score: float
    created_at: str
    # Enhanced insights from spaCy
    entities: Optional[dict] = None
    phrases: Optional[List[str]] = None
    readability_score: Optional[float] = None
    word_count: Optional[int] = None
    sentence_count: Optional[int] = None

class SearchRequest(BaseModel):
    topic: Optional[str] = None
    keyword: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "LLM Knowledge Extractor API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running"""
    return {
        "status": "healthy",
        "database": "connected" if db_service.supabase else "disconnected",
        "llm": "available" if llm_service.client else "unavailable"
    }

@app.post("/analyze", response_model=TextAnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    try:
        print(f"🔍 API: Starting analysis for text length: {len(request.text)}")
        
        # Validate input
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty")
        
        # Get enhanced insights using spaCy
        print("🔍 API: Getting advanced insights...")
        advanced_insights = text_processor.get_advanced_insights(request.text)
        
        # Get LLM analysis
        print("🔍 API: Getting LLM analysis...")
        llm_analysis = await llm_service.analyze_text(request.text)
        
        # Combine results
        analysis_data = {
            "text": request.text,
            "summary": llm_analysis["summary"],
            "title": llm_analysis.get("title"),
            "topics": llm_analysis["topics"],
            "sentiment": llm_analysis["sentiment"],
            "keywords": advanced_insights["keywords"],
            "confidence_score": llm_analysis.get("confidence_score", 0.8),
            "entities": advanced_insights.get("entities"),
            "phrases": advanced_insights.get("phrases"),
            "readability_score": advanced_insights.get("readability_score"),
            "word_count": advanced_insights.get("word_count"),
            "sentence_count": advanced_insights.get("sentence_count")
        }
        
        # Save to database
        print("💾 API: Saving analysis to database...")
        analysis_id = await db_service.save_analysis(analysis_data)
        
        print(f"✅ API: Analysis completed successfully: {analysis_id}")
        
        # Return response
        return TextAnalysisResponse(
            id=analysis_id,
            summary=analysis_data["summary"],
            title=analysis_data["title"],
            topics=analysis_data["topics"],
            sentiment=analysis_data["sentiment"],
            keywords=analysis_data["keywords"],
            confidence_score=analysis_data["confidence_score"],
            created_at=datetime.utcnow().isoformat(),  # Use proper timestamp
            entities=analysis_data.get("entities"),
            phrases=analysis_data.get("phrases"),
            readability_score=analysis_data.get("readability_score"),
            word_count=analysis_data.get("word_count"),
            sentence_count=analysis_data.get("sentence_count")
        )
        
    except Exception as e:
        print(f"❌ API: Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/search")
async def search_analyses(topic: Optional[str] = None, keyword: Optional[str] = None):
    try:
        if not topic and not keyword:
            raise HTTPException(status_code=400, detail="Either topic or keyword parameter is required")
        
        results = await db_service.search_analyses(topic, keyword)
        return {"analyses": results}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/analyses")
async def get_all_analyses():
    try:
        print("📊 API: Fetching all analyses...")
        results = await db_service.get_all_analyses()
        print(f"📊 API: Returning {len(results)} analyses")
        return {"analyses": results}
    except Exception as e:
        print(f"❌ API: Error fetching analyses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch analyses: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,  # Enable auto-reload for development
        reload_dirs=["."],  # Watch current directory for changes
        log_level="info"
    )
