import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TextAnalysis } from '../types';

interface EnhancedAnalysisCardProps {
  analysis: TextAnalysis;
  onViewDetails: (analysis: TextAnalysis) => void;
}

const EnhancedAnalysisCard: React.FC<EnhancedAnalysisCardProps> = ({
  analysis,
  onViewDetails
}) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Just now';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-purple-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {analysis.title || 'Untitled Analysis'}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {analysis.summary}
            </p>
          </div>
          <Badge className={`ml-2 ${getSentimentColor(analysis.sentiment)}`}>
            {getSentimentIcon(analysis.sentiment)} {analysis.sentiment}
          </Badge>
        </div>

        {/* Topics */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Topics:</div>
          <div className="flex flex-wrap gap-1">
            {analysis.topics.slice(0, 3).map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{topic}
              </Badge>
            ))}
            {analysis.topics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{analysis.topics.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Keywords */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Keywords:</div>
          <div className="flex flex-wrap gap-1">
            {analysis.keywords.slice(0, 5).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {analysis.keywords.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{analysis.keywords.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            {analysis.word_count && (
              <span>📝 {analysis.word_count} words</span>
            )}
            {analysis.sentence_count && (
              <span>📄 {analysis.sentence_count} sentences</span>
            )}
            {analysis.readability_score && (
              <span>📊 Score: {analysis.readability_score.toFixed(1)}</span>
            )}
          </div>
          <span>{formatDate(analysis.created_at)}</span>
        </div>

        {/* Confidence Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-700">Confidence</span>
            <span className="font-medium">{Math.round(analysis.confidence_score * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${analysis.confidence_score * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onViewDetails(analysis)}
          className="w-full group-hover:bg-purple-600 transition-colors duration-200"
          variant="outline"
        >
          🔍 View Full Analysis
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedAnalysisCard;
