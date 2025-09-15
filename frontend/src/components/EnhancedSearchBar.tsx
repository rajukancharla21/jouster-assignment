import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { SearchParams } from '../types';

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
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Type */}
          <div>
            <Label className="text-sm font-medium">Search Type</Label>
            <RadioGroup
              value={searchType}
              onValueChange={(value: 'topic' | 'keyword') => setSearchType(value)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="topic" id="topic" />
                <Label htmlFor="topic">By Topic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="keyword" id="keyword" />
                <Label htmlFor="keyword">By Keyword</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Search Query */}
          <div>
            <Label htmlFor="query">Search Query</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search by ${searchType}...`}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !query.trim()}>
                {loading ? 'Searching...' : '🔍'}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sentiment Filter */}
            <div>
              <Label className="text-sm font-medium">Sentiment Filter</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {sentimentOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant={sentimentFilter === option.value ? 'default' : 'outline'}
                    className={`cursor-pointer ${option.color}`}
                    onClick={() => setSentimentFilter(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <Label className="text-sm font-medium">Sort By</Label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'sentiment')}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="sentiment">By Sentiment</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !query.trim()} className="flex-1">
              {loading ? 'Searching...' : '🔍 Search Analyses'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedSearchBar;
