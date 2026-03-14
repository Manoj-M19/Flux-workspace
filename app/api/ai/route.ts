import { getServerSession } from "next-auth";
import { OpenAI } from "./../../../node_modules/openai/src/client";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, text, context } = body;

    if (!action || !text) {
      return NextResponse.json(
        { error: "Action and text required" },
        { status: 400 },
      );
    }

    let prompt = "";
    let systemPrompt =
      "You are a helpful writing assistant.Provide clear,concise response.";

    switch (action) {
      case "continue":
        prompt = `Continue writing this naturally.Only provide the continuation,not the original text:\n\n${text}`;
        systemPrompt =
          "You are a creative writing assistent.Continue the user's writing in thier style.";
        break;

      case "improve":
        prompt = `Improve this text while maintaining its meaning and style:\n\n${text}`;
        systemPrompt =
          "You are a writing improvement assistant. Make text clearer and more engaging.";
        break;

      case "fix-grammar":
        prompt = `Fix grammar and spelling errors in this text. Return only the corrected version:\n\n${text}`;
        systemPrompt =
          "You are a grammar correction assistant. Fix errors while preserving the original style.";
        break;

      case "make-shorter":
        prompt = `Make this text shorter and more concise while keeping the key points:\n\n${text}`;
        systemPrompt =
          "You are a text summarization assistant. Be concise but complete.";
        break;

      case "make-longer":
        prompt = `Expand this text with more details and examples:\n\n${text}`;
        systemPrompt =
          "You are a text expansion assistant. Add relevant details and examples.";
        break;

      case "tone-professional":
        prompt = `Rewrite this text in a professional business tone:\n\n${text}`;
        systemPrompt =
          "You are a professional writing assistant. Use formal, business-appropriate language.";
        break;

      case "tone-casual":
        prompt = `Rewrite this text in a casual, friendly tone:\n\n${text}`;
        systemPrompt =
          "You are a casual writing assistant. Use relaxed, conversational language.";
        break;

      case "tone-friendly":
        prompt = `Rewrite this text in a warm, friendly tone:\n\n${text}`;
        systemPrompt =
          "You are a friendly writing assistant. Use warm, welcoming language.";
        break;

      case "summarize":
        prompt = `Summarize this text in 2-3 sentences:\n\n${text}`;
        systemPrompt =
          "You are a summarization assistant. Capture key points concisely.";
        break;

      case "translate":
        const targetLang = context?.language || "Spanish";
        prompt = `Translate this text to ${targetLang}:\n\n${text}`;
        systemPrompt = `You are a translation assistant. Translate accurately to ${targetLang}.`;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key. Please check your configuration." },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        error: "AI Processing failed.Please try again.",
      },
      { status: 500 },
    );
  }
}
