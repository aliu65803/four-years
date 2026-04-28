# Four Years

A Week 5 playable demo for `Four Years`, a pixel-art branching narrative game about freshman fall.

## What is implemented

- Freshman arrival scene and semester planner
- Three planner priorities chosen from four options
- Three branching story scenes with Professor Alden and Mina
- Live stat tracking for academics, social life, mental health, and finances
- Reflection ending plus semester summary
- Local save in `localStorage`
- Clerk authentication
- Supabase sync through `GET/POST /api/save`
- Optional Anthropic flavor dialogue through `POST /api/flavor`

## Run locally

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env.local`
3. Add your Clerk and Supabase values
4. Add Anthropic values only if you want Claude-generated flavor dialogue
5. Start the dev server with `npm run dev`

## Supabase setup

Apply the migration in [supabase/migrations/20260427195500_create_game_saves.sql](/Users/angelaliu/Desktop/design_build_ship/Game Project/supabase/migrations/20260427195500_create_game_saves.sql).

Then, in the Supabase dashboard:

1. Go to `Authentication > Sign In / Up`
2. Add `Clerk` as a third-party auth provider
3. Paste your Clerk domain from Clerk's Supabase integration page

The app uses Clerk session tokens with Supabase RLS, so you do not need a service role key for normal save/load behavior.

## Anthropic is optional

If `ANTHROPIC_API_KEY` is missing, the app still works. It falls back to built-in non-AI flavor text in the scene dialogue API.
