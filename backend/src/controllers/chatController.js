const axios = require('axios');

// POST /api/chat
// body: { messages: [{role: 'system'|'user'|'assistant', content: string}], model?: string }
exports.createCompletion = async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured on server' });
    }

    const { messages = [], model } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages must be a non-empty array' });
    }

    const selectedModel = model || 'openai/gpt-4o-mini';

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: selectedModel,
        messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'LifeMon Chat',
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { error: err.message };
    res.status(status).json(data);
  }
};
