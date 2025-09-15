import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { TextAnalysisRequest } from '../types';
import { extractContentFromUrl } from '../services/urlExtractor';

interface EnhancedTextAnalyzerProps {
  onAnalyze: (request: TextAnalysisRequest) => void;
  loading: boolean;
  error: string | null;
}

const EnhancedTextAnalyzer: React.FC<EnhancedTextAnalyzerProps> = ({
  onAnalyze,
  loading,
  error
}) => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');

  const handleUrlExtraction = async (url: string) => {
    setIsExtracting(true);
    try {
      const result = await extractContentFromUrl(url);
      
      if (result.success) {
        setText(result.content);
        setInputMode('text');
      } else {
        setError(result.error || 'Failed to extract content from URL');
      }
    } catch (err) {
      setError('Failed to extract content from URL. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onAnalyze({ text: text.trim() });
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    await handleUrlExtraction(url.trim());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          Analyze Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={inputMode === 'text' ? 'default' : 'outline'}
            onClick={() => setInputMode('text')}
            className="flex-1"
          >
            📄 Text Input
          </Button>
          <div className="flex-1 relative">
            <Button
              variant={inputMode === 'url' ? 'default' : 'outline'}
              onClick={() => setInputMode('url')}
              className="w-full"
            >
              🔗 URL Input
            </Button>
            <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">
              BETA
            </Badge>
          </div>
        </div>

        {inputMode === 'text' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="text">Text Content</Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your article, blog post, or any text content here..."
                className="min-h-[120px] mt-2"
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading || !text.trim()}
              className="w-full"
            >
              {loading ? 'Analyzing...' : '🚀 Analyze Text'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="mt-2"
                disabled={isExtracting}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isExtracting || !url.trim()}
              className="w-full"
            >
              {isExtracting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Extracting Content...
                </>
              ) : (
                '🔍 Extract & Analyze'
              )}
            </Button>
            
            {isExtracting && (
              <div className="text-sm text-gray-600 text-center">
                <p>🔄 Extracting content from URL...</p>
                <p className="text-xs mt-1">This may take a few seconds</p>
              </div>
            )}
          </form>
        )}

        {error && (
          <Alert variant="destructive">
            <span className="font-medium">Error:</span> {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTextAnalyzer;
