import './App.css';
import { useState, useRef } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef(null); // Step 1: Ref for textarea

  // Step 2: Auto-grow handler
  const handleInputChange = (e) => {
    setPrompt(e.target.value);

    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto'; // Reset height to shrink if needed
      el.style.height = el.scrollHeight + 'px'; // Set to content height
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    setMovies([]);
    setShows([]);

    try {
      const res = await fetch('/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log('API response:', data);
      setMovies(data.movies || []);
      setShows(data.shows || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      alert('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>AI Media Recommender</h1>
        <h3 className="subheading">Ask AI for your new selection of Movies and TV!</h3>
      </div>

      {/* Input Section */}
      <div className="input-section">
        <textarea
          ref={textareaRef}
          className="prompt-input"
          rows="1"
          placeholder="What kind of shows or movies are you in the mood for?"
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // Prevent new line
              getRecommendations(); // Triggers the recommendation button
            }
          }}
        />
        <button
          className="recommend-button"
          onClick={getRecommendations}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </div>

      {/* Results Section */}
      <div className="results-section">
        {movies.length > 0 && (
          <div className="category" style={{ animationDelay: '0.1s' }}>
            <h2>Movies</h2>
            <ul>
              {movies.map((rec, index) => (
                <li key={index}>
                  <strong>{rec.title}</strong> ({rec.year})<br />
                  <em>{rec.description}</em>
                </li>
              ))}
            </ul>
          </div>
        )}

        {shows.length > 0 && (
          <div className="category" style={{ animationDelay: '0.2s' }}>
            <h2>TV Series</h2>
            <ul>
              {shows.map((rec, index) => (
                <li key={index}>
                  <strong>{rec.title}</strong> ({rec.year})<br />
                  <em>{rec.description}</em>
                </li>
              ))}
            </ul>
          </div>
        )}

        {movies.length === 0 && shows.length === 0 && !loading && (
          <div className="no-results">No recommendations yet.</div>
        )}
      </div>
    </div>
  );
}

export default App;
