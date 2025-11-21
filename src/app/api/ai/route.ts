import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log("🚀 AI API route hit"); // Debug log

  try {
    const { message } = await req.json();
    console.log("📝 User message:", message); // Debug log

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY is missing");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    console.log("🤖 Calling OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Cyfa AI, an analytics assistant for a Nigerian gadgets retail business called Cyfalytics. Provide insightful, data-driven responses about sales, trends, and customer behavior. Keep responses concise and actionable. Use Nigerian Naira (₦) for currency.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message?.content || "No response generated";
    console.log("✅ AI Response:", aiResponse); // Debug log

    return NextResponse.json({ reply: aiResponse });
  } catch (error: any) {
    console.error("❌ AI error:", error);
    console.error("Error details:", error.message);
    
    // More specific error messages
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: "OpenAI API quota exceeded. Please check your billing." },
        { status: 429 }
      );
    }
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `Failed to generate AI response: ${error.message}` },
      { status: 500 }
    );
  }
}