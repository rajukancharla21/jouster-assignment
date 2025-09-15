import { useState } from 'react';
import { FileText, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface TextAnalyzerProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
}

const TextAnalyzer = ({ onAnalyze, loading }: TextAnalyzerProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text.trim());
      setText('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Analyze New Text
        </CardTitle>
        <CardDescription>
          Enter text content to extract AI-powered insights and analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text Content</Label>
            <Textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article, blog post, or any text content here..."
              className="min-h-[120px] resize-none"
              disabled={loading}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Analyze Text
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TextAnalyzer;