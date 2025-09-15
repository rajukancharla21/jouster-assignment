import React from 'react';
import { TextAnalysis } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AnalysisModalProps {
  analysis: TextAnalysis | null;
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  analysis,
  isOpen,
  onClose
}) => {
  if (!isOpen || !analysis) return null;

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
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Just now';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {analysis.title || 'Analysis Details'}
              </h2>
              <p className="text-gray-600">
                Analyzed on {formatDate(analysis.created_at)}
              </p>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              ✕
            </Button>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
            <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Sentiment & Confidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sentiment Analysis</h3>
              <div className="flex items-center gap-3">
                <Badge className={`text-lg px-4 py-2 ${getSentimentColor(analysis.sentiment)}`}>
                  {getSentimentIcon(analysis.sentiment)} {analysis.sentiment.toUpperCase()}
                </Badge>
                <div className="text-sm text-gray-600">
                  Confidence: {Math.round(analysis.confidence_score * 100)}%
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Text Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {analysis.word_count && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{analysis.word_count}</div>
                    <div className="text-gray-600">Words</div>
                  </div>
                )}
                {analysis.sentence_count && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{analysis.sentence_count}</div>
                    <div className="text-gray-600">Sentences</div>
                  </div>
                )}
                {analysis.readability_score && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{analysis.readability_score.toFixed(1)}</div>
                    <div className="text-gray-600">Readability</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Topics</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.topics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                  #{topic}
                </Badge>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Named Entities */}
          {analysis.entities && Object.keys(analysis.entities).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Named Entities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.entities).map(([category, entities]) => (
                  entities.length > 0 && (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 capitalize">
                        {category.replace('_', ' ')}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {entities.slice(0, 5).map((entity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {entity}
                          </Badge>
                        ))}
                        {entities.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{entities.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Key Phrases */}
          {analysis.phrases && analysis.phrases.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Phrases</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.phrases.slice(0, 10).map((phrase, index) => (
                  <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                    "{phrase}"
                  </Badge>
                ))}
                {analysis.phrases.length > 10 && (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    +{analysis.phrases.length - 10} more phrases
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Original Text Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Original Text Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysis.summary.length > 200 
                  ? `${analysis.summary.substring(0, 200)}...` 
                  : analysis.summary
                }
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
            <Button onClick={() => window.print()} variant="default">
              📄 Print Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
