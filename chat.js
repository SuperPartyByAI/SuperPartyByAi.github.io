// Vercel Serverless Function for AI Chat with Knowledge Base
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    let systemPrompt = `Tu ești un asistent AI pentru SuperParty - o companie de entertainment pentru evenimente (petreceri copii, animatori, personaje).

Răspunzi în limba română, prietenos și profesional.`;

    let usedKnowledgeBase = false;
    let usedWebSearch = false;

    if (knowledgeBase && knowledgeBase.trim()) {
      systemPrompt += `\n\nIMPORTANT - Baza de cunoștințe SuperParty (FOLOSEȘTE PRIORITAR ACESTE INFORMAȚII):\n${knowledgeBase}`;
      
      const lowerMessage = message.toLowerCase();
      const lowerKB = knowledgeBase.toLowerCase();
      
      const keywords = ['pret', 'cost', 'tarif', 'program', 'orar', 'contact', 'email', 'telefon', 'politica', 'anulare', 'rezervare'];
      usedKnowledgeBase = keywords.some(keyword => lowerMessage.includes(keyword) && lowerKB.includes(keyword));
    }

    if (!usedKnowledgeBase && knowledgeBase && knowledgeBase.trim()) {
      usedWebSearch = true;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message }
    ];

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

    return res.status(200).json({
      success: true,
      response: aiResponse,
      usedWebSearch: usedWebSearch,
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
