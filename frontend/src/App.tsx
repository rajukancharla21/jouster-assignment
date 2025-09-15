import { useState, useEffect } from 'react';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AnimatedHero from './components/AnimatedHero';
import EnhancedTextAnalyzer from './components/EnhancedTextAnalyzer';
import EnhancedSearchBar from './components/EnhancedSearchBar';
import EnhancedAnalysisCard from './components/EnhancedAnalysisCard';
import AnalysisModal from './components/AnalysisModal';
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EnhancedTextAnalyzer 
            onAnalyze={handleAnalyze} 
            loading={loading} 
            error={error} 
          />
          <EnhancedSearchBar 
            onSearch={handleSearch} 
            onClear={handleClearSearch} 
            loading={isSearching} 
          />
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
                <EnhancedAnalysisCard
                  key={analysis.id}
                  analysis={analysis}
                  onViewDetails={handleViewDetails}
                />
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