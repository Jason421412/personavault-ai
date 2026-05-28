# PersonaVault AI

Personal identity, document vault, proof-pack sharing, and AI authenticity checker MVP.

PersonaVault AI is a full-stack product prototype for the AI era: a user can create a verified personal profile, store important documents in a private vault, prepare privacy-controlled proof packs, and eventually analyze suspicious offers or documents with a server-side AI checker.

## Current Status

Phase 4 implementation is present; local Supabase Storage verification is pending. The current codebase includes Supabase email/password auth, protected `/app` routes, a verified profile editor, public profile pages, document vault upload/delete implementation with SHA-256 hashing, and audit logging for profile and vault actions.

Proof Pack, AI Checker, and full Audit Timeline business modules are still upcoming placeholders.

## Problem

Students and early-career candidates often need to prove identity, academic context, portfolio credibility, and document authenticity across many online workflows. The usual pattern is scattered: profile links in one place, PDFs in another, screenshots in chats, and little visibility into what was shared or when.

At the same time, AI-generated scams and suspicious offers make it harder to trust documents, recruiter messages, and employment opportunities without a structured review process.

## Solution

PersonaVault AI organizes a user's profile and documents around controlled proof sharing:

- Keep a verified personal profile in one place.
- Store important documents in a private vault.
- Track SHA-256 hashes for uploaded files as tamper-evidence.
- Prepare proof packs with recipient labels, expiry, and watermarks in a future phase.
- Route suspicious document or offer text through a server-side AI checker in a future phase.
- Record important actions in audit logs.

## Key Features

Implemented:

- Landing page and professional app shell.
- Supabase email/password login and signup.
- Middleware-protected `/app` routes.
- Session-aware redirect behavior for `/login` and `/app/*`.
- Verified profile create/update form with Zod validation.
- Public profile page at `/u/[id]`.
- Document vault page at `/app/vault`.
- Server action for private document upload to Supabase Storage.
- SHA-256 hash computation for uploaded documents.
- Document metadata persistence in Supabase Postgres.
- Document deletion with database row removal and best-effort storage cleanup.
- Audit log insertion for profile and document create/update/delete actions.
- SQL schema with RLS policies for profiles, documents, audit logs, and storage objects.

Planned:

- Proof pack generation and public share pages backed by real data.
- Server-side AI document/offer checker.
- Full audit timeline UI.
- More complete verification flows.

## Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI conventions:** shadcn/ui-style local primitives
- **Auth:** Supabase Auth
- **Database:** Supabase Postgres
- **Storage:** Supabase Storage
- **Validation:** Zod
- **Deployment target:** Vercel-compatible Next.js app

## Architecture Overview

```text
Browser
  -> Next.js App Router pages
  -> Client forms and server actions
  -> Supabase SSR client
  -> Supabase Auth / Postgres / Storage
```

- `middleware.ts` refreshes Supabase sessions and protects `/app/*`.
- `src/app/app/layout.tsx` performs a server-side auth check and renders the app shell.
- `src/lib/supabase/client.ts` creates the browser Supabase client.
- `src/lib/supabase/server.ts` creates the cookie-aware server Supabase client.
- `src/app/app/profile/actions.ts` handles profile persistence and profile audit events.
- `src/app/app/vault/actions.ts` handles document upload, hashing, metadata, deletion, and vault audit events.
- `docs/supabase-schema.sql` contains the current database/storage schema and RLS policies.

More detail is available in [docs/architecture.md](docs/architecture.md).

## Core User Flows

### Auth

1. User visits `/login`.
2. User signs up or signs in with email/password.
3. Supabase session cookies are refreshed by middleware.
4. Authenticated users access `/app`; unauthenticated users are redirected to `/login`.

### Verified Profile

1. User opens `/app/profile`.
2. The page loads the user's profile row by authenticated `user_id`.
3. If no profile exists, the form saves a new row.
4. On update, the server action updates only the current user's row.
5. A profile audit event is inserted.
6. The public page `/u/[id]` displays public profile fields.

### Document Vault

1. User opens `/app/vault`.
2. User uploads a PDF, PNG, JPG, or JPEG file up to 10 MB.
3. The server action computes the SHA-256 hash.
4. The file is uploaded to the private `documents` bucket under `{userId}/{timestamp}-{safeFileName}`.
5. Metadata is saved to the `documents` table.
6. The vault table displays metadata only, not public file URLs.
7. Deleting a document removes the database row and attempts storage cleanup.

## Data Model Overview

Current schema:

- `profiles`: public profile fields, verification flags, `user_id`, timestamps.
- `documents`: file metadata, storage path, SHA-256 hash, visibility, `user_id`.
- `audit_logs`: user-scoped action log with entity metadata.

Planned schema:

- `proof_packs`
- `proof_pack_items`
- `document_checks`

The schema and RLS policies live in [docs/supabase-schema.sql](docs/supabase-schema.sql).

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local env file:

```bash
cp .env.example .env.local
```

Fill in your Supabase values in `.env.local`, then run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On Windows PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

## Environment Variables

```txt
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_STORAGE_BUCKET=documents
OPENAI_API_KEY=
```

Do not expose service role keys or AI provider keys through `NEXT_PUBLIC_*` variables. The current MVP uses the Supabase anon key plus Row Level Security for user-scoped database and storage access.

## Supabase Setup

1. Create a Supabase project.
2. Enable Email authentication.
3. Add these redirect URLs in Supabase Auth settings:

```txt
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

4. Run [docs/supabase-schema.sql](docs/supabase-schema.sql) in Supabase SQL Editor.
5. Confirm the private `documents` bucket exists. The SQL attempts to create/update it safely.
6. Restart the local dev server after changing `.env.local`.

## Testing / Quality Checks

```bash
npm run typecheck
npm run lint
npm run build
```

These commands passed during the initial GitHub checkpoint and should be run before future phase commits.

## Security and Privacy Notes

- Authenticated user IDs are derived from the server Supabase session, not from client input.
- RLS policies restrict profile edits, document metadata, storage objects, and audit logs to the owning user where applicable.
- Public profile pages intentionally select only public profile fields.
- Vault files are stored in a private Supabase Storage bucket.
- The app does not expose raw public storage URLs by default.
- SHA-256 hashes help detect file changes, but they are not encryption or access control.
- Future hardening should include encryption strategy, signed URL review, rate limits, audit retention rules, and a security review before production use.

## Known Limitations

- Phase 4 document vault code is implemented, but live Supabase upload/delete verification is still pending.
- Proof packs are placeholder pages and do not yet persist or share selected documents.
- The AI checker page is a placeholder and does not yet call an AI provider.
- The audit timeline page is not yet connected to persisted audit log rows.
- Email verification and GitHub verification badges are simple flags/placeholders, not full verification workflows.
- This is an MVP/prototype, not a production identity or compliance system.

## Roadmap

1. Verify Supabase Storage upload/delete behavior against a live project.
2. Implement proof pack creation, item selection, recipient labels, expiry, and public share pages.
3. Implement the server-side AI document/offer checker with strict JSON validation.
4. Build the audit timeline UI from `audit_logs`.
5. Add integration tests around auth, profile, vault, and server actions.
6. Add deployment notes, demo script, and screenshots.

## What I Learned

- How to structure a serious full-stack MVP around auth, protected routes, server actions, and user-scoped data.
- Why identity and document-sharing products need privacy boundaries from the first design pass.
- How Supabase Auth, Postgres RLS, and Storage policies work together in a Next.js App Router app.
- How to keep planned AI features honest by documenting boundaries before implementation.
