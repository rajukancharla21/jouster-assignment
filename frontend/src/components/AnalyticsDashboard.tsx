import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface AnalyticsData {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  loading?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {data.total}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Total Analysis
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {data.positive}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Positive
            </div>
            <Badge className={`mt-1 ${getSentimentColor('positive')}`}>
              {data.total > 0 ? Math.round((data.positive / data.total) * 100) : 0}%
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {data.negative}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Negative
            </div>
            <Badge className={`mt-1 ${getSentimentColor('negative')}`}>
              {data.total > 0 ? Math.round((data.negative / data.total) * 100) : 0}%
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {data.neutral}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Neutral
            </div>
            <Badge className={`mt-1 ${getSentimentColor('neutral')}`}>
              {data.total > 0 ? Math.round((data.neutral / data.total) * 100) : 0}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
