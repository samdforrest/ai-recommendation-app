import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);
    setRecommendations([]);

    try {
      const res = await fetch('/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),

      });

      const data = await res.json();
      console.log('API response:', data);
      setRecommendations([{ title: "AI Recommends", year: "", description: data.raw }]);
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
        {recommendations.length > 0 && (
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>
                <strong>{rec.title}</strong> ({rec.year})<br />
                <em>{rec.description}</em>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
