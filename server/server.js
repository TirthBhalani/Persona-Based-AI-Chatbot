import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { personas } from './prompts.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Persona Chatbot Backend is running!' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { persona, message, history } = req.body;

    if (!persona || !personas[persona]) {
      return res.status(400).json({ error: 'Invalid persona selected.' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const systemPrompt = personas[persona].systemPrompt;

    // Formatting messages for OpenRouter API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/free', // You can change the model if needed
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'Persona Chatbot',
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to communicate with OpenRouter API. Please try again later.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
