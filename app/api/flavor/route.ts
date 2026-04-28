import { NextRequest, NextResponse } from "next/server";
import { generateFlavorDialogue } from "@/lib/game/dialogue";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dialogue = await generateFlavorDialogue(body);

    return NextResponse.json({
      dialogue,
      provider: process.env.ANTHROPIC_API_KEY ? "anthropic" : "fallback"
    });
  } catch (error) {
    return NextResponse.json(
      {
        dialogue: "The moment passes in a blur, but something in you still shifts.",
        provider: "fallback",
        error: error instanceof Error ? error.message : "unknown"
      },
      { status: 200 }
    );
  }
}
