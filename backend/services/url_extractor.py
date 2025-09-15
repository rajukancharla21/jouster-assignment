import requests
from bs4 import BeautifulSoup
import re
from typing import Dict, Any, Optional
from urllib.parse import urlparse
import time

class URLExtractor:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def extract_content_from_url(self, url: str) -> Dict[str, Any]:
        """
        Extract text content from a URL
        """
        try:
            print(f"🔗 Extracting content from URL: {url}")
            
            # Validate URL
            if not self._is_valid_url(url):
                return {
                    "success": False,
                    "error": "Invalid URL format"
                }
            
            # Add protocol if missing
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            # Fetch the webpage
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            # Parse HTML content
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header", "aside"]):
                script.decompose()
            
            # Extract title
            title = self._extract_title(soup)
            
            # Extract main content
            content = self._extract_main_content(soup)
            
            if not content or len(content.strip()) < 50:
                return {
                    "success": False,
                    "error": "Could not extract meaningful content from the URL"
                }
            
            # Clean and format content
            cleaned_content = self._clean_content(content)
            
            return {
                "success": True,
                "content": cleaned_content,
                "title": title,
                "url": url,
                "word_count": len(cleaned_content.split()),
                "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Failed to fetch URL: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Error extracting content: {str(e)}"
            }
    
    def _is_valid_url(self, url: str) -> bool:
        """Check if URL is valid"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract page title"""
        title_tag = soup.find('title')
        if title_tag:
            return title_tag.get_text().strip()
        
        # Try meta title
        meta_title = soup.find('meta', property='og:title')
        if meta_title:
            return meta_title.get('content', '').strip()
        
        # Try h1 as fallback
        h1_tag = soup.find('h1')
        if h1_tag:
            return h1_tag.get_text().strip()
        
        return "Untitled"
    
    def _extract_main_content(self, soup: BeautifulSoup) -> str:
        """Extract main content from the page"""
        # Try to find main content areas
        main_selectors = [
            'main',
            'article',
            '[role="main"]',
            '.content',
            '.post-content',
            '.entry-content',
            '.article-content',
            '#content',
            '#main'
        ]
        
        for selector in main_selectors:
            main_content = soup.select_one(selector)
            if main_content:
                return main_content.get_text()
        
        # Fallback: get all paragraph text
        paragraphs = soup.find_all('p')
        if paragraphs:
            return ' '.join([p.get_text() for p in paragraphs])
        
        # Last resort: get all text
        return soup.get_text()
    
    def _clean_content(self, content: str) -> str:
        """Clean and format extracted content"""
        # Remove extra whitespace
        content = re.sub(r'\s+', ' ', content)
        
        # Remove common unwanted patterns
        unwanted_patterns = [
            r'Cookie\s+policy',
            r'Privacy\s+policy',
            r'Terms\s+of\s+service',
            r'Subscribe\s+to\s+our\s+newsletter',
            r'Follow\s+us\s+on',
            r'Share\s+this\s+article',
            r'Read\s+more',
            r'Continue\s+reading',
            r'Advertisement',
            r'Ad\s+content'
        ]
        
        for pattern in unwanted_patterns:
            content = re.sub(pattern, '', content, flags=re.IGNORECASE)
        
        # Remove extra whitespace again
        content = re.sub(r'\s+', ' ', content).strip()
        
        return content

# Global instance
url_extractor = URLExtractor()
