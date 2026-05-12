import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateFlavorDialogue } from "@/lib/game/dialogue";
import { validateFlavorRequest } from "@/lib/game/validation";
import { logSecurityEvent, logServerError } from "@/lib/observability";
import { checkSharedRateLimit } from "@/lib/supabase/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const FLAVOR_USER_LIMIT = 30;
const FLAVOR_IP_LIMIT = 60;
const FLAVOR_WINDOW_SECONDS = 10 * 60;

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      logSecurityEvent("flavor_unauthorized", {
        ip: getClientIp(request)
      });
      return NextResponse.json(
        {
          dialogue: "Sign in to continue your story.",
          provider: "fallback",
          error: "unauthorized"
        },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const userLimit = await checkSharedRateLimit({
      supabase,
      key: `flavor:user:${userId}`,
      ownerUserId: userId,
      limit: FLAVOR_USER_LIMIT,
      windowSeconds: FLAVOR_WINDOW_SECONDS
    });
    if (!userLimit.allowed) {
      logSecurityEvent("flavor_rate_limited_user", {
        userId,
        ip: getClientIp(request),
        retryAfterSeconds: userLimit.retryAfterSeconds
      });
      return NextResponse.json(
        {
          dialogue: "You have asked for a lot of story moments in a short burst. Give it a minute and try again.",
          provider: "fallback",
          error: "rate_limited"
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(userLimit.retryAfterSeconds)
          }
        }
      );
    }

    const ipLimit = checkRateLimit({
      key: `flavor:ip:${getClientIp(request)}`,
      limit: FLAVOR_IP_LIMIT,
      windowMs: FLAVOR_WINDOW_SECONDS * 1000
    });
    if (!ipLimit.allowed) {
      logSecurityEvent("flavor_rate_limited_ip", {
        userId,
        ip: getClientIp(request),
        retryAfterSeconds: ipLimit.retryAfterSeconds
      });
      return NextResponse.json(
        {
          dialogue: "Too many dialogue requests are coming from this connection right now. Give it a minute and try again.",
          provider: "fallback",
          error: "rate_limited"
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(ipLimit.retryAfterSeconds)
          }
        }
      );
    }

    const body = await request.json();
    const validated = validateFlavorRequest(body);
    if (!validated.ok) {
      logSecurityEvent("flavor_invalid_body", {
        userId,
        ip: getClientIp(request),
        reason: validated.reason
      });
      return NextResponse.json(
        {
          dialogue: "That story moment could not be processed. Try again with a smaller request.",
          provider: "fallback",
          error: validated.reason
        },
        { status: 400 }
      );
    }

    const dialogue = await generateFlavorDialogue(validated.value);

    return NextResponse.json({
      dialogue,
      provider: process.env.ANTHROPIC_API_KEY ? "anthropic" : "fallback"
    });
  } catch (error) {
    logServerError("flavor_route_failed", error, {
      ip: getClientIp(request)
    });
    return NextResponse.json(
      {
        dialogue: "The moment passes in a blur, but something in you still shifts.",
        provider: "fallback",
        error: error instanceof Error ? error.message : "unknown"
      },
      { status: 500 }
    );
  }
}
