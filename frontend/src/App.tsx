import { useState, useEffect } from 'react';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AnimatedHero from './components/AnimatedHero';
import EnhancedTextAnalyzer from './components/EnhancedTextAnalyzer';
import EnhancedSearchBar from './components/EnhancedSearchBar';
import AnalysisModal from './components/AnalysisModal';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import type { TextAnalysis, TextAnalysisRequest, SearchParams } from './types';
import { analyzeText, searchAnalyses, getAllAnalyses } from './services/api';

function App() {
  const [analyses, setAnalyses] = useState<TextAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TextAnalysis[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<TextAnalysis | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const animatedTexts = [
    "Uncover today?",
    "Reveal today?",
    "Decode today?",
    "Understand today?",
    "Extract today?",
    "Clarify today?",
    "Explore today?"
  ];
  

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Loading analyses...');
      const response = await getAllAnalyses();
      console.log(`📊 Loaded ${response.analyses.length} analyses`);
      setAnalyses(response.analyses);
    } catch (err) {
      console.error('❌ Error loading analyses:', err);
      setError('Failed to load analyses. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (request: TextAnalysisRequest) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Starting text analysis...');
      const result = await analyzeText(request);
      console.log('✅ Analysis completed, adding to list');
      setAnalyses(prev => [result, ...prev]);
    } catch (err) {
      console.error('❌ Error analyzing text:', err);
      setError('Failed to analyze text. Please check if the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params: SearchParams) => {
    try {
      setIsSearching(true);
      setError(null);
      console.log('🔍 Searching analyses...', params);
      const response = await searchAnalyses(params);
      console.log(`🔍 Found ${response.analyses.length} search results`);
      setSearchResults(response.analyses);
    } catch (err) {
      console.error('❌ Error searching analyses:', err);
      setError('Failed to search analyses. Please check if the backend is running and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleViewDetails = (analysis: TextAnalysis) => {
    setSelectedAnalysis(analysis);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnalysis(null);
  };

  const displayAnalyses = searchResults.length > 0 ? searchResults : analyses;

  // Calculate analytics data
  const analyticsData = {
    total: analyses.length,
    positive: analyses.filter(a => a.sentiment === 'positive').length,
    negative: analyses.filter(a => a.sentiment === 'negative').length,
    neutral: analyses.filter(a => a.sentiment === 'neutral').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            🧠 LLM Knowledge Extractor
          </h1>
        </header>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <AnalyticsDashboard data={analyticsData} loading={loading} />
        </div>

        {/* Animated Hero */}
        <AnimatedHero texts={animatedTexts} />

        {/* Main Content */}
        <div className="space-y-6 mb-8">
          {/* Analyze Content - Full Width */}
          <div className="w-full">
            <EnhancedTextAnalyzer 
              onAnalyze={handleAnalyze} 
              loading={loading} 
              error={error}
              onError={setError}
            />
          </div>
          
          {/* Search & Filter - Full Width */}
          <div className="w-full">
            <EnhancedSearchBar 
              onSearch={handleSearch} 
              onClear={handleClearSearch} 
              loading={isSearching} 
            />
          </div>
        </div>

        {/* Analysis Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              📊 Analysis Results
            </h2>
            <button
              onClick={loadAnalyses}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>

          {loading || isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : displayAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No analyses yet
              </h3>
              <p className="text-gray-600">
                Submit some text to see AI-powered insights here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAnalyses.map((analysis) => (
                <div key={analysis.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1">
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                        {analysis.title || 'Untitled Analysis'}
                      </h3>
                      <Badge className={`ml-2 px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                        analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800 border-green-200' :
                        analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {analysis.sentiment === 'positive' ? '😊' : 
                         analysis.sentiment === 'negative' ? '😞' : '😐'} {analysis.sentiment}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                      {analysis.summary}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Topics */}
                    {analysis.topics && analysis.topics.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Topics</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.topics.slice(0, 3).map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-purple-50 text-purple-700 border-purple-200">
                              #{topic}
                            </Badge>
                          ))}
                          {analysis.topics.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 text-gray-600">
                              +{analysis.topics.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Keywords */}
                    {analysis.keywords && analysis.keywords.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Keywords</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.keywords.slice(0, 4).map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Named Entities */}
                    {analysis.entities && (analysis.entities.people.length > 0 || analysis.entities.organizations.length > 0 || analysis.entities.locations.length > 0) && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Entities</span>
                        </div>
                        <div className="space-y-1">
                          {analysis.entities.people.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">👤</span>
                              <div className="flex flex-wrap gap-1">
                                {analysis.entities.people.slice(0, 2).map((person, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs px-1 py-0.5 bg-pink-50 text-pink-700">
                                    {person}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {analysis.entities.organizations.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">🏢</span>
                              <div className="flex flex-wrap gap-1">
                                {analysis.entities.organizations.slice(0, 2).map((org, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs px-1 py-0.5 bg-green-50 text-green-700">
                                    {org}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {analysis.entities.locations.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">📍</span>
                              <div className="flex flex-wrap gap-1">
                                {analysis.entities.locations.slice(0, 2).map((location, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs px-1 py-0.5 bg-orange-50 text-orange-700">
                                    {location}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key Phrases */}
                    {analysis.phrases && analysis.phrases.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Key Phrases</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.phrases.slice(0, 2).map((phrase, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 italic">
                              "{phrase}"
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{analysis.word_count || 0}</div>
                        <div className="text-xs text-gray-500">Words</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{analysis.sentence_count || 0}</div>
                        <div className="text-xs text-gray-500">Sentences</div>
                      </div>
                    </div>

                    {/* Readability & Confidence */}
                    <div className="grid grid-cols-2 gap-4">
                      {analysis.readability_score && (
                        <div className="text-center">
                          <div className={`text-lg font-bold ${
                            analysis.readability_score < 30 ? 'text-green-600' : 
                            analysis.readability_score < 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {analysis.readability_score.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">Readability</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {Math.round(analysis.confidence_score * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                      📅 {new Date(analysis.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Footer with action button */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <Button
                      onClick={() => handleViewDetails(analysis)}
                      variant="outline"
                      className="w-full group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-colors duration-200"
                    >
                      🔍 View Full Analysis
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <AnalysisModal
          analysis={selectedAnalysis}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}

export default App;