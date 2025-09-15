import axios from 'axios';
import type { TextAnalysis, TextAnalysisRequest, SearchParams, URLExtractionRequest, URLExtractionResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Log the API URL being used (only in development)
if (import.meta.env.DEV) {
  console.log(`🌐 Using API URL: ${API_BASE_URL}`);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const analyzeText = async (request: TextAnalysisRequest): Promise<TextAnalysis> => {
  try {
    console.log('🔍 Analyzing text...');
    const response = await api.post('/analyze', request);
    console.log('✅ Analysis completed');
    return response.data;
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  }
};

export const searchAnalyses = async (params: SearchParams): Promise<{ analyses: TextAnalysis[] }> => {
  try {
    console.log('🔍 Searching analyses...', params);
    const response = await api.get('/search', { params });
    console.log(`✅ Found ${response.data.analyses.length} analyses`);
    return response.data;
  } catch (error) {
    console.error('❌ Search failed:', error);
    throw error;
  }
};

export const getAllAnalyses = async (): Promise<{ analyses: TextAnalysis[] }> => {
  try {
    console.log('📊 Fetching all analyses...');
    const response = await api.get('/analyses');
    console.log(`✅ Retrieved ${response.data.analyses.length} analyses`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch analyses:', error);
    throw error;
  }
};

export const extractUrlContent = async (request: URLExtractionRequest): Promise<URLExtractionResponse> => {
  try {
    console.log('🔗 Extracting content from URL...', request.url);
    const response = await api.post('/extract-url', request);
    console.log('✅ URL extraction completed');
    return response.data;
  } catch (error) {
    console.error('❌ URL extraction failed:', error);
    throw error;
  }
};
