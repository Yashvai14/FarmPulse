// app/api/openai-crop/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = `...`; // Your prompt here

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("🚨 OPENAI_API_KEY not set in .env.local");
      return NextResponse.json({ error: 'OpenAI API key missing' }, { status: 500 });
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const result = await res.json();

    if (!result.choices || !result.choices[0]?.message?.content) {
      console.error("⚠️ Invalid response from OpenAI:", result);
      return NextResponse.json({ error: 'OpenAI response error' }, { status: 500 });
    }

    const text = result.choices[0].message.content;

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({ result: parsed });
    } catch (e) {
      console.error("❌ JSON parse failed:", text);
      return NextResponse.json({ error: 'Invalid JSON format from OpenAI' }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ API Server Error:", error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
