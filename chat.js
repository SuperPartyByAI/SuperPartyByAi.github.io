// Vercel Serverless Function for AI Chat with Knowledge Base
// Path: /api/chat.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history, knowledgeBase } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // OpenAI API Key (set in Vercel Environment Variables)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Build system prompt with knowledge base
    let systemPrompt = `Tu ești un asistent AI pentru SuperParty - o companie de entertainment pentru evenimente (petreceri copii, animatori, personaje).

Răspunzi în limba română, prietenos și profesional.`;

    // Check if knowledge base has relevant info
    let usedKnowledgeBase = false;
    let usedWebSearch = false;

    if (knowledgeBase && knowledgeBase.trim()) {
      // Add knowledge base to system prompt
      systemPrompt += `\n\nIMPORTANT - Baza de cunoștințe SuperParty (FOLOSEȘTE PRIORITAR ACESTE INFORMAȚII):\n${knowledgeBase}`;
      
      // Check if the question might be answered by knowledge base
      const lowerMessage = message.toLowerCase();
      const lowerKB = knowledgeBase.toLowerCase();
      
      // Simple keyword matching to detect if KB is relevant
      const keywords = ['pret', 'cost', 'tarif', 'program', 'orar', 'contact', 'email', 'telefon', 'politica', 'anulare', 'rezervare'];
      usedKnowledgeBase = keywords.some(keyword => lowerMessage.includes(keyword) && lowerKB.includes(keyword));
    }

    // If knowledge base doesn't seem relevant, we'll use web search
    // For now, we'll just flag it - you can add actual web search later
    if (!usedKnowledgeBase && knowledgeBase && knowledgeBase.trim()) {
      usedWebSearch = true; // Flag that we didn't find answer in KB
    }

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error('OpenAI API Error:', error);
      return res.status(500).json({ 
        error: 'AI service error',
        details: error 
      });
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0].message.content;

    // Return response with flag indicating if web search was needed
    return res.status(200).json({
      success: true,
      response: aiResponse,
      usedWebSearch: usedWebSearch, // Frontend will log this as "unanswered question"
      usedKnowledgeBase: usedKnowledgeBase
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
