# Open Source Meals

A small, no-login recipe contribution site. Visitors paste a URL, recipe text, or a screenshot; Gemini returns editable structured data; submitted recipes are public through the browse UI and `GET /api/recipes`.

## Setup

1. Copy `.env.example` to `.env.local` and add the server-only Supabase service-role key and Gemini key.
2. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor.
3. `npm install && npm run dev`

## Public API

`GET /api/recipes?page=1&limit=24&q=chicken&cuisine=Italian&tag=high-protein&minProtein=30&maxCalories=600`

Add `download=1` to download the current result set as JSON. The server route is the only writer: anonymous users do not receive database credentials. It includes in-memory rate limiting, source URL duplicate blocking, and a similar-title check. For multi-instance production, replace the in-memory limiter with a shared store.
