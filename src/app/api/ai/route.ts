import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OpenAI API key" },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Cyfa AI, an analytics assistant for a Nigerian gadget retail outlet stores. Keep responses short, data-driven, and use ₦.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return NextResponse.json({
      reply: completion.choices[0].message?.content ?? "",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI error" },
      { status: 500 }
    );
  }
}
