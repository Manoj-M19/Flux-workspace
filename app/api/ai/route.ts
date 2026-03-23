import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, text, context } = body;

    if (!action || !text) {
      return NextResponse.json(
        { error: "Action and text required" },
        { status: 400 },
      );
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Groq API key not configured. Please add GROQ_API_KEY to .env.local",
        },
        { status: 500 },
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    let prompt = "";
    let systemPrompt =
      "You are a helpful writing assistant. Provide clear, concise responses.";

    switch (action) {
      case "custom":
        const userPrompt = context?.customPrompt || "";
        if (!userPrompt) {
          return NextResponse.json(
            { error: "Custom prompt is required" },
            { status: 400 },
          );
        }
        prompt = `${userPrompt}\n\nText to work with:\n${text}\n\nProvide your response directly without preambles.`;
        systemPrompt =
          "You are a helpful AI assistant. Follow the user's instructions precisely. Return only the result without explanations or preambles.";
        break;

      case "continue":
        prompt = `Continue writing this text naturally. Match the writing style and tone. Only provide the continuation, not the original text:\n\n${text}`;
        systemPrompt =
          "You are a creative writing assistant. Continue the user's writing in their exact style and tone.";
        break;

      case "improve":
        prompt = `Improve this text to make it clearer, more engaging, and more professional while maintaining its core meaning and style:\n\n${text}`;
        systemPrompt =
          "You are a writing improvement expert. Enhance clarity, engagement, and professionalism.";
        break;

      case "fix-grammar":
        prompt = `Fix all grammar, spelling, and punctuation errors in this text. Return ONLY the corrected version with no explanations:\n\n${text}`;
        systemPrompt =
          "You are a grammar expert. Fix errors while preserving the original style and meaning. Return only the corrected text.";
        break;

      case "make-shorter":
        prompt = `Make this text significantly shorter and more concise while keeping all key points and main ideas:\n\n${text}`;
        systemPrompt =
          "You are a text summarization expert. Be concise but preserve all important information.";
        break;

      case "make-longer":
        prompt = `Expand this text with more details, examples, and explanations to make it more comprehensive:\n\n${text}`;
        systemPrompt =
          "You are a text expansion expert. Add relevant details, examples, and context naturally.";
        break;

      case "tone-professional":
        prompt = `Rewrite this text in a professional, formal business tone suitable for corporate communication:\n\n${text}`;
        systemPrompt =
          "You are a professional business writing expert. Use formal, polished language.";
        break;

      case "tone-casual":
        prompt = `Rewrite this text in a casual, conversational, and friendly tone:\n\n${text}`;
        systemPrompt =
          "You are a casual writing expert. Use relaxed, conversational language.";
        break;

      case "tone-friendly":
        prompt = `Rewrite this text in a warm, friendly, and welcoming tone:\n\n${text}`;
        systemPrompt =
          "You are a friendly communication expert. Use warm, approachable language.";
        break;

      case "summarize":
        prompt = `Provide a clear, concise summary of this text in 2-3 sentences:\n\n${text}`;
        systemPrompt =
          "You are a summarization expert. Capture the key points concisely.";
        break;

      case "translate":
        const targetLang = context?.language || "Spanish";
        prompt = `Translate this text to ${targetLang}. Maintain the tone and meaning:\n\n${text}`;
        systemPrompt = `You are a professional translator. Translate accurately to ${targetLang} while preserving tone and nuance.`;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    console.log(` Groq AI Request: ${action}`);
    console.log(` Text length: ${text.length} characters`);

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = completion.choices[0]?.message?.content || "";

    console.log(` Groq Response: ${result.length} characters`);

    return NextResponse.json({
      result,
      model: "Groq Llama 3",
      provider: "groq",
      free: true,
    });
  } catch (error: any) {
    console.error(" Groq API error:", error);

    if (error?.status === 401) {
      return NextResponse.json(
        {
          error:
            "Invalid Groq API key. Please check your .env.local configuration.",
        },
        { status: 500 },
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        {
          error:
            "Groq rate limit exceeded. Free tier: 30 requests/minute. Please wait a moment.",
        },
        { status: 500 },
      );
    }

    if (error?.status === 500 || error?.status === 503) {
      return NextResponse.json(
        { error: "Groq service is temporarily unavailable. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: `AI processing failed: ${error?.message || "Unknown error"}` },
      { status: 500 },
    );
  }
}
