# Week 5 Summary

This week, `Four Years` became a playable freshman-fall demo.

## What was built

- A fresh Next.js + Tailwind app shell for the game
- A full first-semester flow with:
  - arrival scene
  - semester planner
  - branching narrative scenes
  - stat changes
  - reflection ending
- Four tracked stats:
  - academics
  - social life
  - mental health
  - finances
- Two main character routes in the semester:
  - Professor Alden
  - Mina
- A third resource-management scene to make semester tradeoffs feel more distinct
- Pixel-style UI treatment and custom background art for the major scenes
- Local save support in the browser
- Clerk authentication wiring for account-based play
- Supabase save/load integration through authenticated API routes
- A `game_saves` table plus row-level-security policies keyed to Clerk user IDs
- Optional Anthropic-powered flavor dialogue with graceful fallback text when no API key is configured

## Technical work completed

- Set up App Router pages and API routes
- Added Clerk middleware and provider setup
- Connected Supabase to Clerk-authenticated requests
- Wrote a migration for the `game_saves` table
- Added app error boundaries for more stable runtime behavior
- Replaced a text-heavy sidebar card with a small animated pixel dorm vignette

## Current state

The project now supports a real playable loop for Week 5:

1. A player signs in
2. Starts freshman fall
3. Chooses semester priorities
4. Plays through branching scenes
5. Sees stat changes and reflection text
6. Saves progress to Supabase under their own account

## Known follow-up work

- Finish validating the local dev runtime after recent HMR/cache issues
- Test Clerk sign-in and Supabase save flow end-to-end in the browser
- Create and push the standalone public GitHub repository once GitHub CLI authentication is repaired
