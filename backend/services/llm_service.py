import openai
import json
from typing import Dict, Any, Optional
from config import config

class LLMService:
    def __init__(self):
        self.client: Optional[openai.AsyncOpenAI] = None
        
        if config.is_openai_available():
            openai_config = config.get_openai_config()
            self.client = openai.AsyncOpenAI(api_key=openai_config["api_key"])
        else:
            print("⚠️  OpenAI not available, running in demo mode")
    
    async def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Analyze text using OpenAI GPT to extract summary, topics, and sentiment
        """
        if not self.client:
            # Return mock analysis when OpenAI is not available
            return self._get_mock_analysis(text)
        
        try:
            openai_config = config.get_openai_config()
            prompt = f"""
            Analyze the following text and provide a structured response in JSON format:
            
            Text: "{text}"
            
            Please provide:
            1. A 1-2 sentence summary
            2. A title (if available, otherwise generate suitable title)
            3. 3 key topics from the text
            4. Sentiment analysis (positive/neutral/negative)
            5. A confidence score (0.0 to 1.0)
            
            Return the response as valid JSON with these exact keys:
            {{
                "summary": "string",
                "title": "string",
                "topics": ["topic1", "topic2", "topic3"],
                "sentiment": "positive/neutral/negative",
                "confidence_score": 0.0-1.0
            }}
            """
            
            response = await self.client.chat.completions.create(
                model=openai_config["model"],
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that analyzes text and extracts structured information. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=openai_config["temperature"],
                max_tokens=openai_config["max_tokens"]
            )
            
            content = response.choices[0].message.content.strip()
            
            # Parse JSON response
            try:
                result = json.loads(content)
                return result
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return {
                    "summary": content[:200] + "..." if len(content) > 200 else content,
                    "title": None,
                    "topics": ["general", "text", "analysis"],
                    "sentiment": "neutral",
                    "confidence_score": 0.5
                }
                
        except Exception as e:
            # Handle API failures gracefully
            print(f"LLM API error: {str(e)}")
            return self._get_mock_analysis(text)
    
    def _get_mock_analysis(self, text: str) -> Dict[str, Any]:
        """Generate a mock analysis when OpenAI is not available"""
        # Simple mock analysis based on text content
        words = text.split()
        word_count = len(words)
        
        # Simple sentiment analysis based on keywords
        positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'joy']
        negative_words = ['bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'disappointed', 'frustrated']
        
        positive_count = sum(1 for word in words if word.lower() in positive_words)
        negative_count = sum(1 for word in words if word.lower() in negative_words)
        
        if positive_count > negative_count:
            sentiment = "positive"
            confidence = min(0.8, 0.5 + (positive_count - negative_count) * 0.1)
        elif negative_count > positive_count:
            sentiment = "negative"
            confidence = min(0.8, 0.5 + (negative_count - positive_count) * 0.1)
        else:
            sentiment = "neutral"
            confidence = 0.6
        
        # Generate topics based on common words
        common_words = [word.lower() for word in words if len(word) > 4 and word.isalpha()]
        topic_words = list(set(common_words))[:3]
        
        return {
            "summary": f"This text contains {word_count} words and appears to be {sentiment} in sentiment. It discusses topics related to {', '.join(topic_words[:2]) if topic_words else 'general content'}.",
            "title": f"Analysis of {word_count} word text",
            "topics": topic_words[:3] if topic_words else ["text", "analysis", "content"],
            "sentiment": sentiment,
            "confidence_score": confidence
        }
