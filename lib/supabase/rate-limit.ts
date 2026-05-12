import { checkRateLimit } from "@/lib/rate-limit";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type SupabaseRpcClient = {
  rpc: (
    fn: string,
    args: Record<string, string | number>
  ) => PromiseLike<{
    data: RateLimitResult[] | null;
    error: { message: string } | null;
  }>;
};

export async function checkSharedRateLimit({
  supabase,
  key,
  ownerUserId,
  limit,
  windowSeconds
}: {
  supabase: SupabaseRpcClient | null;
  key: string;
  ownerUserId: string;
  limit: number;
  windowSeconds: number;
}) {
  if (!supabase) {
    return checkRateLimit({
      key,
      limit,
      windowMs: windowSeconds * 1000
    });
  }

  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_key: key,
    p_owner_user_id: ownerUserId,
    p_limit: limit,
    p_window_seconds: windowSeconds
  });

  if (error || !data?.[0]) {
    return checkRateLimit({
      key,
      limit,
      windowMs: windowSeconds * 1000
    });
  }

  return data[0];
}
