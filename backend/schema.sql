-- Supabase table schema for text_analyses
CREATE TABLE IF NOT EXISTS text_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    summary TEXT NOT NULL,
    title TEXT,
    topics JSONB NOT NULL,
    sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    keywords JSONB NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    -- Enhanced insights from spaCy
    entities JSONB DEFAULT '{}',
    phrases JSONB DEFAULT '[]',
    readability_score DECIMAL(5,2),
    word_count INTEGER,
    sentence_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_text_analyses_topics ON text_analyses USING GIN (topics);
CREATE INDEX IF NOT EXISTS idx_text_analyses_keywords ON text_analyses USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_text_analyses_sentiment ON text_analyses (sentiment);
CREATE INDEX IF NOT EXISTS idx_text_analyses_created_at ON text_analyses (created_at DESC);
