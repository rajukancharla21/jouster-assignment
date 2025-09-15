import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import type { TextAnalysisRequest } from '../types';
import { extractUrlContent } from '../services/api';

interface EnhancedTextAnalyzerProps {
  onAnalyze: (request: TextAnalysisRequest) => void;
  loading: boolean;
  error: string | null;
  onError: (error: string | null) => void;
}

const EnhancedTextAnalyzer: React.FC<EnhancedTextAnalyzerProps> = ({
  onAnalyze,
  loading,
  error,
  onError
}) => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');

  const handleUrlExtraction = async (url: string) => {
    setIsExtracting(true);
    onError(null);
    try {
      console.log('🔗 Extracting content from URL:', url);
      const result = await extractUrlContent({ url });
      
      if (result.success && result.content) {
        console.log('✅ URL extraction successful, content length:', result.content.length);
        setText(result.content);
        setInputMode('text');
        setUrl(''); // Clear URL input
      } else {
        console.error('❌ URL extraction failed:', result.error);
        onError(result.error || 'Failed to extract content from URL');
      }
    } catch (err) {
      console.error('❌ URL extraction error:', err);
      onError('Failed to extract content from URL. Please check the URL and try again.');
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
              <div className="text-sm text-gray-600 text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="font-medium">Extracting content from URL...</span>
                </div>
                <p className="text-xs">This may take a few seconds depending on the website</p>
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
