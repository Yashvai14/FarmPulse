// app/api/openai-crop/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json();

    const prompt = `Based on the following farming details, provide 3 crop suggestions in JSON format:
    
    Location: ${body.location}
    Soil Type: ${body.soil}
    Planting Month: ${body.month}
    Water Source: ${body.waterSource}
    Experience Level: ${body.experience}
    Budget: ${body.budget}
    Preferred Crop Type: ${body.cropType}
    
    Please respond with a JSON array of exactly 3 objects, each containing:
    - cropName: string
    - profitability: string (High/Medium/Low)
    - marketValue: string (price range)
    - riskLevel: string (Low/Medium/High)
    - reasoning: string (brief explanation)
    
    Example format:
    [
      {
        "cropName": "Wheat",
        "profitability": "High",
        "marketValue": "₹2000-2500 per quintal",
        "riskLevel": "Low",
        "reasoning": "Suitable for your soil and climate conditions"
      }
    ]`;

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
      
      // Save to database
      await supabase
        .from('crop_suggestions')
        .insert([
          {
            user_id: session.user.id,
            location: body.location,
            soil_type: body.soil,
            month: body.month,
            water_source: body.waterSource,
            experience: body.experience,
            budget: body.budget,
            crop_type: body.cropType,
            suggestions: parsed
          }
        ])
      
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
