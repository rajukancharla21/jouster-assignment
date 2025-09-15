"""
Centralized configuration management for the LLM Knowledge Extractor backend.
Loads environment variables once and provides them to all services.
"""
import os
from dotenv import load_dotenv
from typing import Optional

class Config:
    """Centralized configuration class"""
    
    def __init__(self):
        # Load environment variables from project root
        load_dotenv()
        # Also try loading from parent directory if running from backend folder
        load_dotenv('../.env')
        
        # OpenAI Configuration
        self.openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
        
        # Supabase Configuration
        self.supabase_url: Optional[str] = os.getenv("SUPABASE_URL").strip()
        self.supabase_api_key: Optional[str] = os.getenv("SUPABASE_API_KEY").strip()
        
        # Application Configuration
        self.app_name: str = "LLM Knowledge Extractor"
        self.app_version: str = "1.0.0"
        self.debug: bool = os.getenv("DEBUG", "false").lower() == "true"
        

    
    def is_openai_available(self) -> bool:
        """Check if OpenAI is properly configured"""
        return self.openai_api_key is not None
    
    def is_supabase_available(self) -> bool:
        """Check if Supabase is properly configured"""
        return self.supabase_url is not None and self.supabase_api_key is not None
    
    def get_openai_config(self) -> dict:
        """Get OpenAI configuration"""
        return {
            "api_key": self.openai_api_key,
            "model": "gpt-3.5-turbo",
            "temperature": 0.3,
            "max_tokens": 500
        }
    
    def get_supabase_config(self) -> dict:
        """Get Supabase configuration"""
        return {
            "url": self.supabase_url.strip(),
            "api_key": self.supabase_api_key.strip(),
            "table_name": "text_analyses"
        }

# Global config instance
config = Config()
