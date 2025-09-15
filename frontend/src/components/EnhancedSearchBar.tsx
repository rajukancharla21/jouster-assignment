import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import type { SearchParams } from '../types';

interface EnhancedSearchBarProps {
  onSearch: (params: SearchParams) => void;
  onClear: () => void;
  loading?: boolean;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearch,
  onClear,
  loading = false
}) => {
  const [searchType, setSearchType] = useState<'topic' | 'keyword'>('topic');
  const [query, setQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'sentiment'>('newest');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params: SearchParams = {
      [searchType]: query.trim(),
      sentiment: sentimentFilter !== 'all' ? sentimentFilter : undefined,
      sortBy
    };
    
    onSearch(params);
  };

  const handleClear = () => {
    setQuery('');
    setSentimentFilter('all');
    setSortBy('newest');
    onClear();
  };

  const sentimentOptions = [
    { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-800' },
    { value: 'positive', label: 'Positive', color: 'bg-green-100 text-green-800' },
    { value: 'negative', label: 'Negative', color: 'bg-red-100 text-red-800' },
    { value: 'neutral', label: 'Neutral', color: 'bg-blue-100 text-blue-800' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={handleSearch} className="space-y-3">
          {/* Search Row */}
          <div className="flex gap-2 items-center">
            {/* Search Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSearchType('topic')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  searchType === 'topic' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Topic
              </button>
              <button
                type="button"
                onClick={() => setSearchType('keyword')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  searchType === 'keyword' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Keyword
              </button>
            </div>

            {/* Search Input */}
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search by ${searchType}...`}
              disabled={loading}
              className="flex-1"
            />

            {/* Search Button */}
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? '⏳' : '🔍'}
            </Button>
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Filter:</span>
            <div className="flex gap-1">
              {sentimentOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={sentimentFilter === option.value ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    sentimentFilter === option.value 
                      ? option.color 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSentimentFilter(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
            
            <span className="text-sm text-gray-600 font-medium ml-4">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'sentiment')}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="sentiment">Sentiment</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={loading}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setQuery('');
                setSentimentFilter('all');
                setSortBy('newest');
                onClear();
              }}
              className="flex-1"
              disabled={loading}
            >
              Show All
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedSearchBar;
