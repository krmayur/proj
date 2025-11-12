import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Use a proper environment variable name; do not hard-code secrets in source.
    const OPENAI_KEY = process.env.OPENAI_KEY || '';

    if (!OPENAI_KEY) {
      return res.status(200).json({
        lines: [
          "Hey love,",
          "Even now, thinking of you makes the whole day feel softer.",
          "You turn my little moments into something I'll remember forever.",
          "If feelings could be code, you'd be my favorite function.",
          "I love you more simply than words can hold.",
          "Press the button if this made you smile — I promise a little celebration on my end. ❤️"
        ]
      });
    }

    const prompt = `Write a short romantic love letter in 5-7 short lines (each line one sentence). Make it warm, sincere, and slightly playful. Avoid clichés. End with this exact line: Press the button if this made you smile — I promise a little celebration on my end. ❤️`;

    const apiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.9
      })
    });

    const data = await apiResp.json();
    const text = (data?.choices?.[0]?.message?.content ?? '').trim();
    let lines = text.split(/\\r?\\n/).map(s => s.trim()).filter(Boolean);
    const final = "Press the button if this made you smile — I promise a little celebration on my end. ❤️";
    if (!lines.some(l => l.includes('Press the button'))) lines.push(final);

    return res.status(200).json({ lines });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
