import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching recommendations. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <div className="inline-block p-4 rounded-full bg-white shadow-sm mb-4">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight sm:text-6xl mb-4">
            StackSense
          </h1>
          <p className="mt-2 text-xl text-gray-600 max-w-2xl mx-auto">
            Intelligent, explainable tech stack recommendations for your next big idea.
          </p>
        </header>

        <main>
          {error && (
            <div className="max-w-2xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-sm" role="alert">
              <p className="font-bold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Connection Error
              </p>
              <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>
          )}

          {!results ? (
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          ) : (
            <ResultsView results={results} onReset={handleReset} />
          )}
        </main>

        <footer className="mt-16 border-t border-gray-200/50 pt-8 text-center pb-8">
          <p className="text-gray-500 text-sm mb-4">
            &copy; {new Date().getFullYear()} StackSense™. Crafted with <span className="text-rose-500 animate-pulse">♥</span> by Remil Salim using React & FastAPI.
          </p>
          <a
            href="https://github.com/remilsalim/StackSense"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Star on GitHub</span>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
