import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { SaveData } from "@/lib/game/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ save: null }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ save: null, reason: "missing-env" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("game_saves")
      .select("save_data")
      .eq("clerk_user_id", userId)
      .eq("semester_key", "freshman-fall")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ save: null, reason: error.message }, { status: 500 });
    }

    return NextResponse.json({ save: (data?.save_data as SaveData | null) ?? null });
  } catch (error) {
    return NextResponse.json(
      {
        save: null,
        reason: error instanceof Error ? error.message : "unknown"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ persisted: false, reason: "unauthorized" }, { status: 401 });
    }

    const incomingSave = (await request.json()) as SaveData;
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json({ persisted: false, reason: "missing-env" }, { status: 500 });
    }

    const sanitizedSave: SaveData = {
      ...incomingSave,
      playerId: userId,
      updatedAt: new Date().toISOString()
    };

    const { error } = await supabase.from("game_saves").upsert(
      {
        clerk_user_id: userId,
        player_name: sanitizedSave.playerName,
        semester_key: "freshman-fall",
        save_data: sanitizedSave,
        updated_at: sanitizedSave.updatedAt
      },
      {
        onConflict: "clerk_user_id,semester_key"
      }
    );

    if (error) {
      return NextResponse.json({ persisted: false, reason: error.message }, { status: 500 });
    }

    return NextResponse.json({ persisted: true, save: sanitizedSave });
  } catch (error) {
    return NextResponse.json(
      {
        persisted: false,
        reason: error instanceof Error ? error.message : "unknown"
      },
      { status: 500 }
    );
  }
}
