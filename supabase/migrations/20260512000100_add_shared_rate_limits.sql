create table if not exists public.api_rate_limits (
  key text primary key,
  owner_user_id text not null,
  window_started_at timestamptz not null default timezone('utc'::text, now()),
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.api_rate_limits enable row level security;

create policy "Users can view their own rate-limit rows"
on public.api_rate_limits
as permissive
for select
to authenticated
using (
  ((select auth.jwt()->>'sub') = owner_user_id)
);

create policy "Users can insert their own rate-limit rows"
on public.api_rate_limits
as permissive
for insert
to authenticated
with check (
  ((select auth.jwt()->>'sub') = owner_user_id)
);

create policy "Users can update their own rate-limit rows"
on public.api_rate_limits
as permissive
for update
to authenticated
using (
  ((select auth.jwt()->>'sub') = owner_user_id)
)
with check (
  ((select auth.jwt()->>'sub') = owner_user_id)
);

create or replace function public.consume_rate_limit(
  p_key text,
  p_owner_user_id text,
  p_limit integer,
  p_window_seconds integer
)
returns table (
  allowed boolean,
  remaining integer,
  retry_after_seconds integer
)
language plpgsql
security invoker
as $$
declare
  current_row public.api_rate_limits%rowtype;
  now_utc timestamptz := timezone('utc'::text, now());
  window_age interval := make_interval(secs => p_window_seconds);
  next_count integer;
begin
  if p_limit <= 0 or p_window_seconds <= 0 then
    raise exception 'invalid rate limit configuration';
  end if;

  insert into public.api_rate_limits as rl (key, owner_user_id, window_started_at, count, updated_at)
  values (p_key, p_owner_user_id, now_utc, 1, now_utc)
  on conflict (key) do nothing;

  select *
  into current_row
  from public.api_rate_limits
  where key = p_key and owner_user_id = p_owner_user_id
  for update;

  if not found then
    return query select false, 0, p_window_seconds;
    return;
  end if;

  if current_row.window_started_at <= (now_utc - window_age) then
    update public.api_rate_limits
    set count = 1,
        window_started_at = now_utc,
        updated_at = now_utc
    where key = p_key;

    return query select true, greatest(p_limit - 1, 0), 0;
    return;
  end if;

  if current_row.count >= p_limit then
    return query
    select
      false,
      0,
      greatest(1, ceil(extract(epoch from ((current_row.window_started_at + window_age) - now_utc)))::integer);
    return;
  end if;

  next_count := current_row.count + 1;

  update public.api_rate_limits
  set count = next_count,
      updated_at = now_utc
  where key = p_key;

  return query select true, greatest(p_limit - next_count, 0), 0;
end;
$$;

grant execute on function public.consume_rate_limit(text, text, integer, integer) to authenticated;
