# PersonaVault AI

A personal identity, document vault, proof-pack sharing, and AI document authenticity checker for the AI era.

PersonaVault AI helps users create a verified personal profile, store important documents, generate privacy-controlled proof packs, analyze suspicious offers or documents with AI, and track access through an audit timeline.

## Status

Phase 4 implementation is present; local Supabase verification is pending. The app currently has Supabase email/password auth, protected `/app` routes, a verified profile editor, public profile pages, document vault upload/delete code with SHA-256 hashing, and audit logging for profile and vault actions.

Proof Pack, Checker, and Audit business modules are intentionally still placeholders.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui conventions
- Supabase Auth, Postgres, and Storage
- Planned server-side AI API route
- Zod validation
- Vercel-ready deployment

## Planned Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/login` | Supabase login/signup |
| `/app` | Protected dashboard |
| `/app/profile` | Verified profile editor |
| `/u/[id]` | Public profile |
| `/app/vault` | Document vault |
| `/app/proof-packs` | Proof pack list |
| `/app/proof-packs/new` | Proof pack generator |
| `/share/[token]` | Public proof-pack share page |
| `/app/checker` | AI document/offer checker |
| `/app/audit` | Audit timeline |

## Project Structure

```txt
src/
  app/
    auth/callback/       Supabase email confirmation callback
    app/                 Protected app shell routes
    login/               Auth entry route
    share/[token]/       Public proof-pack route
    u/[id]/              Public profile route
    globals.css          Tailwind and design tokens
    layout.tsx           Root layout
    page.tsx             Landing page
  components/
    auth/                Login/signup form
    app/                 App shell and dashboard UI
    layout/              Public layout pieces
    profile/             Verified profile form
    vault/               Document vault upload and table UI
    ui/                  shadcn-style primitives
docs/
  supabase-schema.sql    Profiles, documents, audit logs, and storage RLS
src/lib/
  auth/                  Auth redirect helpers
  supabase/              Browser/server Supabase clients
  validators/            Zod validation helpers
  vault/                 Document display helpers
middleware.ts            Supabase session refresh and route protection
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Fill in Supabase values in `.env.local`.

4. Run the app:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

If port `3000` is occupied, run a different port and update `NEXT_PUBLIC_SITE_URL`:

```bash
npm run dev -- --port 3001
```

## Environment Variables

```txt
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_STORAGE_BUCKET=documents
OPENAI_API_KEY=
```

Never expose service role keys or AI provider keys through `NEXT_PUBLIC_*` variables. The current MVP uses the Supabase anon key plus Row Level Security for user-scoped database and storage access.

## Supabase Auth Setup

1. Create a Supabase project.
2. In Supabase, go to Project Settings -> API and copy:
   - Project URL into `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In Authentication -> Providers, enable Email.
4. For local development, set `NEXT_PUBLIC_SITE_URL` to your dev origin, for example `http://localhost:3001`.
5. In Authentication -> URL Configuration, add redirect URLs for your local app:

```txt
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

6. Restart the Next.js dev server after changing `.env.local`.

Auth behavior:

- Unauthenticated visits to `/app/*` redirect to `/login`.
- Authenticated visits to `/login` redirect to `/app`.
- Email confirmation links land on `/auth/callback`, exchange the Supabase code server-side, then redirect into `/app`.
- Logout clears the Supabase session and returns the user to `/login`.

## Supabase Database Setup

Phase 4 requires the `profiles`, `documents`, and `audit_logs` tables before `/app/profile` and `/app/vault` can save data.

1. Open Supabase.
2. Go to SQL Editor.
3. Open [docs/supabase-schema.sql](docs/supabase-schema.sql).
4. Paste the full SQL into Supabase SQL Editor and run it.
5. Refresh the local app.

The schema file creates:

- `profiles`
- `documents`
- `audit_logs`
- indexes
- `updated_at` trigger
- private `documents` storage bucket setup
- Row Level Security policies

RLS summary:

- Public users can read profile rows for public profile pages.
- Authenticated users can insert and update only their own profile.
- Authenticated users can select, insert, and delete only their own document metadata.
- Authenticated users can insert only their own audit logs.
- Authenticated users can read only their own audit logs.
- Authenticated users can access storage objects only when the first path segment matches their Supabase user id.

## Supabase Storage Setup

The SQL script attempts to create or update a private Supabase Storage bucket named `documents` with a 10 MB file limit and allowed MIME types for PDF, PNG, and JPEG.

If you prefer to create the bucket in the Supabase dashboard:

1. Go to Storage.
2. Create a bucket named `documents`.
3. Keep the bucket private.
4. Set the allowed MIME types to:

```txt
application/pdf
image/png
image/jpeg
```

5. Run [docs/supabase-schema.sql](docs/supabase-schema.sql) afterward so the storage RLS policies are created.

## Planned Database Tables

- `profiles` implemented in `docs/supabase-schema.sql`
- `documents` implemented in `docs/supabase-schema.sql`
- `proof_packs`
- `proof_pack_items`
- `document_checks`
- `audit_logs` implemented in `docs/supabase-schema.sql`

Remaining table migrations and Row Level Security policies will be added in later phases.

## Security Notes

- AI provider calls must happen only in server-side routes or server actions.
- Supabase Auth uses the public anon key on the client and server-side session checks for protected app routes.
- Profile writes derive `user_id` from the authenticated session instead of trusting client input.
- Profile create/update actions insert audit log events: `PROFILE_CREATED` and `PROFILE_UPDATED`.
- Document writes derive `user_id` from the authenticated session instead of trusting client input.
- Vault uploads are stored under `{userId}/{timestamp}-{safeFileName}` inside the private `documents` bucket.
- The vault stores file metadata and SHA-256 hashes, but does not expose raw public storage URLs by default.
- Document upload/delete actions insert audit log events: `DOCUMENT_UPLOADED` and `DOCUMENT_DELETED`.
- Supabase Row Level Security should restrict each user to their own profile, documents, proof packs, AI checks, and audit logs.
- Public proof-pack links should validate token existence, expiry, and visibility before rendering any metadata.
- Hashing document contents with SHA-256 helps detect tampering but is not a replacement for strong access controls.
- Future hardening should include encryption at rest strategy, signed URL policy review, abuse limits, audit retention rules, and security review before production use.

## One-Week MVP Phases

1. Foundation: project setup, design system, route shell, Supabase helpers.
2. Auth: Supabase login/signup, protected routes, session-aware redirects.
3. Verified profile: private profile editor, public profile page, profile audit logs.
4. Vault: private uploads, metadata persistence, SHA-256 hashing, storage rules.
5. Proof packs: pack creation, item selection, token generation, expiry handling, public share page.
6. AI checker: strict Zod request/response validation, server-side AI route, risk report persistence.
7. Audit timeline and polish: action logging across remaining modules, Vercel deployment, demo script.

## License

License to be decided before public release.
