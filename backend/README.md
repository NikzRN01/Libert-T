# Backend

Express.js (TypeScript) API for SkillXIntell.

## Local development

1. Install dependencies from repo root:
	- `npm install`
2. Create your env file:
	- Copy `.env.example` to `.env`
	- Fill in values (at minimum: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`)
	- For avatar uploads, create a Supabase Storage bucket (default: `avatars`) or set `SUPABASE_AVATAR_BUCKET` to an existing bucket
3. Start the API:
	- `npm run dev`

If you see `Missing required environment variable: ...`, it means `.env` is missing or incomplete.
