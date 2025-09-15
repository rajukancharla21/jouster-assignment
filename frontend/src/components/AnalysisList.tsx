import type { TextAnalysis } from '../types';
import { RefreshCw, Calendar, TrendingUp, Hash, Target, BarChart3, Users, Building, MapPin, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface AnalysisListProps {
  analyses: TextAnalysis[];
  loading: boolean;
  onRefresh: () => void;
}

const AnalysisList = ({ analyses, loading, onRefresh }: AnalysisListProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
          <p className="text-muted-foreground mb-4">
            Submit some text to see AI-powered insights here!
          </p>
          <Button onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analysis Results ({analyses.length})
          </CardTitle>
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    {analysis.title && (
                      <CardTitle className="text-lg">{analysis.title}</CardTitle>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(analysis.created_at)}
                    </div>
                  </div>
                  <Badge className={getSentimentColor(analysis.sentiment)}>
                    {getSentimentIcon(analysis.sentiment)} {analysis.sentiment}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Topics
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {analysis.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      Keywords
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced spaCy insights */}
                {analysis.entities && (analysis.entities.people.length > 0 || analysis.entities.organizations.length > 0 || analysis.entities.locations.length > 0) && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Named Entities
                    </h5>
                    <div className="space-y-2">
                      {analysis.entities.people.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">People:</span>
                          <div className="flex flex-wrap gap-1">
                            {analysis.entities.people.slice(0, 3).map((person, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {person}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysis.entities.organizations.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Organizations:</span>
                          <div className="flex flex-wrap gap-1">
                            {analysis.entities.organizations.slice(0, 3).map((org, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {org}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysis.entities.locations.length > 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Locations:</span>
                          <div className="flex flex-wrap gap-1">
                            {analysis.entities.locations.slice(0, 3).map((location, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {analysis.phrases && analysis.phrases.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Key Phrases
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {analysis.phrases.slice(0, 3).map((phrase, index) => (
                        <Badge key={index} variant="outline">
                          {phrase}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {analysis.word_count !== undefined && (
                      <span>Words: {analysis.word_count}</span>
                    )}
                    {analysis.sentence_count !== undefined && (
                      <span>Sentences: {analysis.sentence_count}</span>
                    )}
                    {analysis.readability_score !== undefined && (
                      <span className={`font-medium ${
                        analysis.readability_score < 30 ? 'text-green-600' : 
                        analysis.readability_score < 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        Readability: {analysis.readability_score < 30 ? 'Easy' : 
                        analysis.readability_score < 60 ? 'Medium' : 'Hard'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {Math.round(analysis.confidence_score * 100)}% confidence
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisList;