import re
from collections import Counter
from typing import List, Dict, Any
import nltk
import spacy
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag

class TextProcessor:
    def __init__(self):
        # Download required NLTK data
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
            nltk.data.find('taggers/averaged_perceptron_tagger')
        except LookupError:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('averaged_perceptron_tagger', quiet=True)
        
        self.stop_words = set(stopwords.words('english'))
        
        # Load spaCy model
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("spaCy model 'en_core_web_sm' not found. Please install it with: python -m spacy download en_core_web_sm")
            self.nlp = None
    
    def extract_keywords(self, text: str, num_keywords: int = 3) -> List[str]:
        """
        Extract the most frequent nouns from the text using spaCy (with NLTK fallback)
        """
        try:
            if self.nlp:
                return self._extract_keywords_spacy(text, num_keywords)
            else:
                return self._extract_keywords_nltk(text, num_keywords)
        except Exception as e:
            print(f"Error extracting keywords: {str(e)}")
            return self._extract_keywords_nltk(text, num_keywords)
    
    def _extract_keywords_spacy(self, text: str, num_keywords: int = 3) -> List[str]:
        """
        Extract keywords using spaCy for better accuracy
        """
        doc = self.nlp(text)
        
        # Extract nouns and proper nouns
        nouns = []
        for token in doc:
            if (token.pos_ in ['NOUN', 'PROPN'] and 
                not token.is_stop and 
                not token.is_punct and 
                not token.is_space and
                len(token.text) > 2 and
                not token.like_email and
                not token.like_url):
                nouns.append(token.lemma_.lower())
        
        # Count frequency and return top keywords
        word_freq = Counter(nouns)
        return [word for word, count in word_freq.most_common(num_keywords)]
    
    def _extract_keywords_nltk(self, text: str, num_keywords: int = 3) -> List[str]:
        """
        Fallback keyword extraction using NLTK
        """
        # Clean and tokenize text
        text = re.sub(r'[^\w\s]', '', text.lower())
        tokens = word_tokenize(text)
        
        # Remove stopwords and get POS tags
        filtered_tokens = [word for word in tokens if word not in self.stop_words and len(word) > 2]
        pos_tags = pos_tag(filtered_tokens)
        
        # Extract only nouns
        nouns = [word for word, pos in pos_tags if pos in ['NN', 'NNS', 'NNP', 'NNPS']]
        
        # Count frequency and return top keywords
        word_freq = Counter(nouns)
        return [word for word, count in word_freq.most_common(num_keywords)]
    
    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """
        Extract named entities using spaCy
        """
        if not self.nlp:
            return {"entities": [], "organizations": [], "people": [], "locations": []}
        
        try:
            doc = self.nlp(text)
            entities = {
                "entities": [],
                "organizations": [],
                "people": [],
                "locations": []
            }
            
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    entities["people"].append(ent.text)
                elif ent.label_ == "ORG":
                    entities["organizations"].append(ent.text)
                elif ent.label_ in ["GPE", "LOC"]:
                    entities["locations"].append(ent.text)
                else:
                    entities["entities"].append(f"{ent.text} ({ent.label_})")
            
            # Remove duplicates and limit results
            for key in entities:
                entities[key] = list(set(entities[key]))[:5]  # Max 5 per category
            
            return entities
            
        except Exception as e:
            print(f"Error extracting entities: {str(e)}")
            return {"entities": [], "organizations": [], "people": [], "locations": []}
    
    def extract_phrases(self, text: str, num_phrases: int = 3) -> List[str]:
        """
        Extract key phrases using spaCy noun chunks
        """
        if not self.nlp:
            return []
        
        try:
            doc = self.nlp(text)
            phrases = []
            
            for chunk in doc.noun_chunks:
                if (len(chunk.text.split()) >= 2 and 
                    len(chunk.text.split()) <= 4 and
                    not any(token.is_stop for token in chunk) and
                    len(chunk.text) > 5):
                    phrases.append(chunk.text.strip())
            
            # Remove duplicates and return top phrases
            unique_phrases = list(set(phrases))
            return unique_phrases[:num_phrases]
            
        except Exception as e:
            print(f"Error extracting phrases: {str(e)}")
            return []
    
    def get_advanced_insights(self, text: str) -> Dict[str, Any]:
        """
        Get comprehensive text insights using spaCy
        """
        if not self.nlp:
            return {"keywords": self.extract_keywords(text), "entities": {}, "phrases": []}
        
        try:
            doc = self.nlp(text)
            
            insights = {
                "keywords": self.extract_keywords(text),
                "entities": self.extract_entities(text),
                "phrases": self.extract_phrases(text),
                "sentiment_score": self._get_sentiment_score(doc),
                "readability_score": self._get_readability_score(text),
                "word_count": len(doc),
                "sentence_count": len(list(doc.sents))
            }
            
            return insights
            
        except Exception as e:
            print(f"Error getting advanced insights: {str(e)}")
            return {"keywords": self.extract_keywords(text), "entities": {}, "phrases": []}
    
    def _get_sentiment_score(self, doc) -> float:
        """
        Simple sentiment scoring based on word polarity
        """
        positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best']
        negative_words = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointing']
        
        pos_count = sum(1 for token in doc if token.lemma_.lower() in positive_words)
        neg_count = sum(1 for token in doc if token.lemma_.lower() in negative_words)
        
        total = pos_count + neg_count
        if total == 0:
            return 0.0
        
        return (pos_count - neg_count) / total
    
    def _get_readability_score(self, text: str) -> float:
        """
        Simple readability score based on average word and sentence length
        """
        words = text.split()
        sentences = text.split('.')
        
        if len(sentences) == 0 or len(words) == 0:
            return 0.0
        
        avg_words_per_sentence = len(words) / len(sentences)
        avg_word_length = sum(len(word) for word in words) / len(words)
        
        # Simple readability formula (lower is more readable)
        score = (avg_words_per_sentence * 0.39) + (avg_word_length * 11.8) - 15.59
        return max(0, min(100, score))
