export interface TextAnalysis {
  id: string;
  summary: string;
  title?: string;
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  confidence_score: number;
  created_at: string;
  // Enhanced insights from spaCy
  entities?: {
    entities: string[];
    organizations: string[];
    people: string[];
    locations: string[];
  };
  phrases?: string[];
  readability_score?: number;
  word_count?: number;
  sentence_count?: number;
}

export interface TextAnalysisRequest {
  text: string;
}

export interface SearchParams {
  topic?: string;
  keyword?: string;
  sentiment?: string;
  sortBy?: 'newest' | 'oldest' | 'sentiment';
}

export interface URLExtractionRequest {
  url: string;
}

export interface URLExtractionResponse {
  success: boolean;
  content?: string;
  title?: string;
  url?: string;
  word_count?: number;
  extracted_at?: string;
  error?: string;
}
