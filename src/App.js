import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>AI Show/Movie Recommender</h1>

      <textarea
        rows="3"
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="What kind of shows or movies are you in the mood for?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={getRecommendations} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>

      <div style={{ marginTop: '2rem' }}>
        {movies.length > 0 && (
          <>
            <h2>Movies</h2>
            <ul>
              {movies.map((rec, index) => (
                <li key={index} style={{ marginBottom: '1rem' }}>
                  <strong>{rec.title}</strong> ({rec.year})<br />
                  <em>{rec.description}</em>
                </li>
              ))}
            </ul>
          </>
        )}
        {shows.length > 0 && (
          <>
            <h2>TV Series</h2>
            <ul>
              {shows.map((rec, index) => (
                <li key={index} style={{ marginBottom: '1rem' }}>
                  <strong>{rec.title}</strong> ({rec.year})<br />
                  <em>{rec.description}</em>
                </li>
              ))}
            </ul>
          </>
        )}
        {movies.length === 0 && shows.length === 0 && !loading && (
          <div style={{ color: '#888' }}>No recommendations yet.</div>
        )}
      </div>
    </div>
  );
}

export default App;