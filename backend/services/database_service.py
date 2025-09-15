from supabase import create_client, Client
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
from config import config

class DatabaseService:
    def __init__(self):
        self.supabase: Optional[Client] = None
        self.table_name = "text_analyses"
        
        if config.is_supabase_available():
            try:
                supabase_config = config.get_supabase_config()
                self.supabase = create_client(
                    supabase_config["url"], 
                    supabase_config["api_key"]
                )
                # Test the connection
                result = self.supabase.table(self.table_name).select("*").limit(1).execute()
                print("✅ Supabase connected successfully")
            except Exception as e:
                print(f"⚠️  Supabase connection failed: {e}")
                print("Running in demo mode without database persistence")
                self.supabase = None
        else:
            print("⚠️  Supabase not configured, running in demo mode")
    
    async def save_analysis(self, analysis_data: Dict[str, Any]) -> str:
        """
        Save analysis data to Supabase
        """
        analysis_id = str(uuid.uuid4())
        
        if not self.supabase:
            print("⚠️  Database not available, returning mock ID for demo")
            return analysis_id
            
        try:
            # Prepare data for Supabase
            data = {
                "id": analysis_id,
                "text": analysis_data["text"],
                "summary": analysis_data["summary"],
                "title": analysis_data.get("title"),
                "topics": analysis_data["topics"],  # Supabase handles JSON automatically
                "sentiment": analysis_data["sentiment"],
                "keywords": analysis_data["keywords"],  # Supabase handles JSON automatically
                "confidence_score": float(analysis_data["confidence_score"]),
                "entities": analysis_data.get("entities", {}),
                "phrases": analysis_data.get("phrases", []),
                "readability_score": float(analysis_data.get("readability_score", 0)) if analysis_data.get("readability_score") else None,
                "word_count": analysis_data.get("word_count"),
                "sentence_count": analysis_data.get("sentence_count"),
                "created_at": datetime.utcnow().isoformat()
            }
            
            print(f"💾 Saving analysis to database: {analysis_id}")
            result = self.supabase.table(self.table_name).insert(data).execute()
            
            if result.data and len(result.data) > 0:
                print(f"✅ Analysis saved successfully: {analysis_id}")
                return analysis_id
            else:
                print(f"❌ Failed to save analysis - no data returned")
                raise Exception("Failed to save analysis to database")
                
        except Exception as e:
            print(f"❌ Database save error: {str(e)}")
            print("⚠️  Returning mock ID for demo")
            return analysis_id
    
    async def search_analyses(self, topic: Optional[str] = None, keyword: Optional[str] = None, sentiment: Optional[str] = None, sortBy: Optional[str] = "newest") -> List[Dict[str, Any]]:
        """
        Search analyses by topic or keyword
        """
        if not self.supabase:
            print("⚠️  Database not available, returning empty list for demo")
            return []
            
        try:
            # Get all analyses first, then filter in Python
            # This is more reliable than complex Supabase JSON queries
            result = self.supabase.table(self.table_name).select("*").order("created_at", desc=True).execute()
            
            if not result.data:
                print(f"🔍 No analyses found in database")
                return []
            
            analyses = []
            search_term = topic or keyword
            search_field = "topics" if topic else "keywords"
            
            for item in result.data:
                # Check if search term exists in the specified field
                field_data = item.get(search_field, [])
                if isinstance(field_data, list):
                    # Check if any item in the list contains the search term (case insensitive)
                    matches = any(search_term.lower() in str(field_item).lower() for field_item in field_data)
                else:
                    # Fallback for string fields
                    matches = search_term.lower() in str(field_data).lower()
                
                # Check sentiment filter if provided
                sentiment_matches = True
                if sentiment and sentiment != "all":
                    sentiment_matches = item.get("sentiment", "").lower() == sentiment.lower()
                
                if matches and sentiment_matches:
                    analysis = {
                        "id": item["id"],
                        "summary": item["summary"],
                        "title": item.get("title"),
                        "topics": item.get("topics", []),
                        "sentiment": item["sentiment"],
                        "keywords": item.get("keywords", []),
                        "confidence_score": float(item["confidence_score"]),
                        "entities": item.get("entities", {}),
                        "phrases": item.get("phrases", []),
                        "readability_score": float(item.get("readability_score")) if item.get("readability_score") else None,
                        "word_count": item.get("word_count"),
                        "sentence_count": item.get("sentence_count"),
                        "created_at": item["created_at"]
                    }
                    analyses.append(analysis)
            
            # Apply sorting
            if sortBy == "oldest":
                analyses.sort(key=lambda x: x["created_at"])
            elif sortBy == "sentiment":
                # Sort by sentiment: positive, neutral, negative
                sentiment_order = {"positive": 0, "neutral": 1, "negative": 2}
                analyses.sort(key=lambda x: sentiment_order.get(x["sentiment"], 3))
            # Default is "newest" which is already sorted by created_at desc from the query
            
            print(f"🔍 Found {len(analyses)} analyses matching '{search_term}' in {search_field}" + 
                  (f" with sentiment '{sentiment}'" if sentiment and sentiment != "all" else "") +
                  f" sorted by {sortBy}")
            return analyses
            
        except Exception as e:
            print(f"❌ Database search error: {str(e)}")
            # Return empty list instead of crashing
            return []
    
    async def get_all_analyses(self) -> List[Dict[str, Any]]:
        """
        Get all analyses ordered by creation date
        """
        if not self.supabase:
            print("⚠️  Database not available, returning empty list for demo")
            return []
            
        try:
            print("📊 Fetching all analyses from database...")
            result = self.supabase.table(self.table_name).select("*").order("created_at", desc=True).execute()
            
            # Check if result has data
            if not result.data:
                print("📊 No analyses found in database")
                return []
            
            analyses = []
            for item in result.data:
                analysis = {
                    "id": item["id"],
                    "summary": item["summary"],
                    "title": item.get("title"),
                    "topics": item.get("topics", []),
                    "sentiment": item["sentiment"],
                    "keywords": item.get("keywords", []),
                    "confidence_score": float(item["confidence_score"]),
                    "entities": item.get("entities", {}),
                    "phrases": item.get("phrases", []),
                    "readability_score": float(item.get("readability_score")) if item.get("readability_score") else None,
                    "word_count": item.get("word_count"),
                    "sentence_count": item.get("sentence_count"),
                    "created_at": item["created_at"]
                }
                analyses.append(analysis)
            
            print(f"📊 Retrieved {len(analyses)} analyses from database")
            return analyses
            
        except Exception as e:
            print(f"❌ Database fetch error: {str(e)}")
            # Return empty list instead of crashing
            return []
