import { useState } from 'react';
import { Search, X, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface SearchBarProps {
  onSearch: (topic?: string, keyword?: string) => void;
  onClear: () => void;
  loading: boolean;
}

const SearchBar = ({ onSearch, onClear, loading }: SearchBarProps) => {
  const [searchType, setSearchType] = useState<'topic' | 'keyword'>('topic');
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      if (searchType === 'topic') {
        onSearch(searchValue.trim(), undefined);
      } else {
        onSearch(undefined, searchValue.trim());
      }
    }
  };

  const handleClear = () => {
    setSearchValue('');
    onClear();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Analyses
        </CardTitle>
        <CardDescription>
          Find specific analyses by topic or keyword
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Search Type</Label>
            <RadioGroup
              value={searchType}
              onValueChange={(value) => setSearchType(value as 'topic' | 'keyword')}
              className="flex space-x-6"
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
          
          <div className="space-y-2">
            <Label htmlFor="search-input">Search Query</Label>
            <div className="flex gap-2">
              <Input
                id="search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Search by ${searchType}...`}
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !searchValue.trim()}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleClear}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchBar;