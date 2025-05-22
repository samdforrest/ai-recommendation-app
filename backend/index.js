import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Point OpenAI SDK to Groq's endpoint
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1', // Important!
});

app.post('/recommendations', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'llama3-8b-8192', // Or try 'llama3-8b-8192'
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that recommends movies or shows based on the user\'s description.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const reply = chatResponse.choices[0].message.content;
    console.log('🤖 Raw AI reply:\n', reply); // Add this line
    
    // const parseRecommendations = (text) => {
    //     const result = {
    //         movies: [],
    //         shows: [],
    //     };

    //     const movieSection = text.split('Movies:')[1]?.split('TV Shows:')[0];
    //     const showSection = text.split('TV Shows:')[1];

    //     const parseLines = (section) => {
    //         return section
    //         ?.split('\n')
    //         .filter(line => /^\d+\.\s*".+?"\s*\(.+?\)\s*-\s*/.test(line))
    //         .map(line => {
    //             const match = line.match(/^\d+\.\s*"(.+?)"\s*\((.+?)\)\s*-\s*(.*)/);
    //             if (match) {
    //             return {
    //                 title: match[1],
    //                 year: match[2],
    //                 description: match[3],
    //             };
    //             }
    //             return null;
    //         })
    //         .filter(Boolean);
    //     };

    //     if (movieSection) result.movies = parseLines(movieSection);
    //     if (showSection) result.shows = parseLines(showSection);

    //     return result;
    // };

    //const structured = parseRecommendations(reply);
    res.json({ raw: reply });

  } catch (error) {
    console.error('🔥 ERROR:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
