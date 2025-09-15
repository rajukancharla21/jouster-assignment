# 🧠 LLM Knowledge Extractor

**Assignment for Jouster** | **Submitted by Raju Kancharla**

A full-stack application that uses AI to extract structured insights from unstructured text. Built with FastAPI (backend) and React + TypeScript (frontend), this tool analyzes text content to generate summaries, extract topics, determine sentiment, and identify key keywords.

> **Note**: This repository will be made private in 1 week as per assignment guidelines.

## ✨ Features

- **AI-Powered Analysis**: Uses OpenAI GPT-3.5-turbo to generate summaries and extract structured data
- **Advanced NLP Processing**: Combines spaCy and NLTK for sophisticated text analysis
- **Smart Keyword Extraction**: spaCy-powered keyword extraction with lemmatization and POS tagging
- **Named Entity Recognition**: Extracts people, organizations, and locations from text
- **Key Phrase Detection**: Identifies important noun phrases and concepts
- **Sentiment Analysis**: Determines text sentiment (positive/neutral/negative) with confidence scores
- **Topic Extraction**: Identifies 3 key topics from the analyzed text
- **Readability Analysis**: Calculates text complexity and readability scores
- **Search & Filter**: Search through past analyses by topic or keyword
- **Modern UI**: Beautiful, responsive interface built with React and TypeScript
- **Real-time Processing**: Fast analysis with loading states and error handling
- **Persistent Storage**: All analyses stored in Supabase for easy retrieval

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with async/await support
- **Database**: Supabase (PostgreSQL) with JSONB support for flexible data storage
- **LLM Integration**: OpenAI API with robust error handling
- **Text Processing**: spaCy + NLTK for advanced NLP and keyword extraction
- **API Design**: RESTful endpoints with proper error handling and validation

### Frontend (React + TypeScript)
- **Framework**: Vite + React 18 with TypeScript
- **Styling**: Custom CSS with modern design patterns
- **State Management**: React hooks for local state
- **HTTP Client**: Axios for API communication
- **UI Components**: Modular, reusable components with proper TypeScript interfaces

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Supabase account
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Install spaCy language model**:
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_API_KEY=your_supabase_api_key_here
   ```

5. **Set up Supabase database**:
   Run the SQL schema in your Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of backend/schema.sql
   ```

6. **Start the backend server**:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 📚 API Endpoints

### `POST /analyze`
Analyzes text and returns structured insights.

**Request Body**:
```json
{
  "text": "Your text content here..."
}
```

**Response**:
```json
{
  "id": "uuid",
  "summary": "1-2 sentence summary",
  "title": "Extracted title or null",
  "topics": ["topic1", "topic2", "topic3"],
  "sentiment": "positive|neutral|negative",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "confidence_score": 0.85,
  "created_at": "2024-01-01T00:00:00Z",
  "entities": {
    "people": ["John Doe", "Jane Smith"],
    "organizations": ["OpenAI", "Microsoft"],
    "locations": ["San Francisco", "New York"]
  },
  "phrases": ["artificial intelligence", "machine learning", "natural language processing"],
  "readability_score": 45.2,
  "word_count": 250,
  "sentence_count": 12
}
```

### `GET /search`
Search analyses by topic or keyword.

**Query Parameters**:
- `topic`: Search by topic
- `keyword`: Search by keyword

**Response**:
```json
{
  "analyses": [...]
}
```

### `GET /analyses`
Get all analyses ordered by creation date.

**Response**:
```json
{
  "analyses": [...]
}
```

## 🎨 Design Choices & My Approach

Hey! I wanted to share my thought process behind the technical decisions I made for this project. I tried to balance speed of development with code quality and maintainability.

### Backend Architecture
- **FastAPI**: I chose FastAPI because it's incredibly fast to develop with, has excellent async support, and automatically generates beautiful API docs. Perfect for a 90-minute assignment!
- **Supabase**: I went with Supabase over SQLite because it's more production-ready and gives us real-time capabilities. Plus, the JSONB support is perfect for storing the flexible topic/keyword arrays.
- **spaCy + NLTK Combo**: I added spaCy alongside NLTK because it's way more powerful for NLP tasks. It gives us named entity recognition, better keyword extraction, and phrase detection. It's like having a professional linguist on the team! 🧠
- **Service Layer Pattern**: I separated the LLM, database, and text processing into different services. This makes the code much cleaner and easier to test.
- **Error Handling**: I made sure to handle edge cases like empty input and API failures gracefully. No crashes on my watch! 😄
- **Async/Await**: Everything is async for better performance. The LLM calls can take a few seconds, so this prevents blocking.

### Frontend Architecture
- **Vite + React**: Vite is lightning fast for development, and React with TypeScript gives us great type safety. Perfect combo for rapid prototyping.
- **Component-Based Design**: I broke everything into small, reusable components. Makes the code much easier to understand and maintain.
- **Custom CSS**: I went with custom CSS instead of a framework like Tailwind because I wanted complete control over the design and didn't want to spend time learning a new framework.
- **TypeScript**: Full type safety everywhere! This catches bugs at compile time and makes the code much more maintainable.
- **Responsive Design**: Mobile-first approach because most people use their phones these days.

### Data Flow
- **Unidirectional Data Flow**: I kept the data flow simple and predictable - parent components manage state, children just display it.
- **Centralized State**: All the analysis data lives in the main App component. Simple but effective for this scope.
- **Optimistic Updates**: The UI updates immediately when you submit text, then shows the real results when they come back. Feels snappy!
- **Error Boundaries**: Proper error handling with user-friendly messages. Nobody likes cryptic error codes!

## ⚡ Performance Optimizations

- **Async Processing**: Backend uses async/await throughout for non-blocking operations
- **Database Indexing**: Proper indexes on searchable fields (topics, keywords, sentiment)
- **Component Memoization**: React components optimized to prevent unnecessary re-renders
- **Lazy Loading**: Components loaded only when needed
- **Efficient Search**: Database queries optimized with proper WHERE clauses and JSONB operations

## 🛡️ Error Handling & Edge Cases

### Backend
- **Empty Input Validation**: Rejects empty or whitespace-only text
- **LLM API Failures**: Graceful fallback with error messages when OpenAI API is unavailable
- **Database Errors**: Proper error handling for database connection and query failures
- **Input Sanitization**: Text input properly sanitized before processing

### Frontend
- **Loading States**: Clear loading indicators during API calls
- **Error Messages**: User-friendly error messages with retry options
- **Form Validation**: Client-side validation for required fields
- **Network Errors**: Proper handling of network timeouts and connection issues

## 🔧 Trade-offs I Made (And Why)

### Time Constraints (90 minutes)
- **No Authentication**: I skipped user auth to focus on the core functionality. In a real app, I'd definitely add this!
- **Simple UI**: I went with custom CSS instead of a complex UI framework. It's not as fancy as Material-UI, but it's clean and works great.
- **Basic Testing**: I focused on getting the core features working rather than writing comprehensive tests. I know, I know... 😅
- **Single Database Table**: I used one table instead of a normalized schema. It's not perfect, but it works and was faster to implement.

### Technical Trade-offs
- **OpenAI vs Local Models**: I chose OpenAI because it's reliable and gives great results. Local models would be cheaper but more complex to set up.
- **Supabase vs SQLite**: I went with Supabase for better scalability, even though it adds some complexity. SQLite would have been simpler but less production-ready.
- **Custom CSS vs Framework**: I chose custom CSS for complete design control. Tailwind would have been faster, but I wanted to show I can write clean CSS.
- **REST vs GraphQL**: I used REST because it's simpler and faster to develop. GraphQL would be better for complex queries, but REST works fine here.

## 🚀 What I'd Add Next (If I Had More Time)

If I had more time, here's what I'd love to add:

- **User Authentication**: Personal accounts so each user can see their own analysis history
- **Batch Processing**: Upload multiple texts at once and analyze them all together
- **Advanced Analytics**: Cool charts showing sentiment trends over time
- **Export Features**: Download your analyses as PDF or CSV files
- **Real-time Updates**: WebSocket support so you can see analyses happening live
- **Custom Models**: Support for different LLM providers (Claude, Gemini, etc.)
- **API Rate Limiting**: Proper rate limiting for production use
- **Caching**: Redis caching to make everything super fast

## 🎯 My 3-5 Sentence Design Summary

I built this as a full-stack application with FastAPI and React because I wanted to demonstrate both backend API design skills and modern frontend development. I chose Supabase over SQLite for better scalability and real-time capabilities, and implemented a service layer pattern to keep the code clean and testable. The frontend uses TypeScript for type safety and custom CSS for complete design control, while the backend handles LLM integration with proper error handling and async processing. I focused on creating a production-ready application that's both functional and maintainable, with a beautiful UI that works great on mobile devices.

## 📝 Assignment Submission

This project was created as part of the Jouster Software Engineer Take-Home Assignment. It demonstrates full-stack development skills, API design, database integration, and modern frontend development practices.

**Repository will be made private in 1 week as per assignment guidelines.**

---

**Built with ❤️ by Raju Kancharla using FastAPI, React, TypeScript, and OpenAI**
