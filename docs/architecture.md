# PersonaVault AI Architecture

This document describes the current MVP architecture as implemented in the repository. It intentionally separates implemented behavior from planned phases.

## Frontend Structure

PersonaVault AI uses the Next.js App Router.

```text
src/app/
  page.tsx                 Landing page
  login/page.tsx           Auth entry page
  auth/callback/route.ts   Supabase email callback route
  app/layout.tsx           Protected app layout
  app/page.tsx             Dashboard placeholder/overview
  app/profile/             Verified profile editor
  app/vault/               Document vault
  app/proof-packs/         Placeholder proof-pack routes
  app/checker/             Placeholder AI checker route
  app/audit/               Placeholder audit route
  u/[id]/page.tsx          Public profile page
  share/[token]/page.tsx   Placeholder public proof-pack route
```

Shared UI lives under `src/components/`, with app shell components, local shadcn-style primitives, profile form components, and vault components.

## Authentication

Authentication is handled with Supabase Auth and SSR helpers.

- `middleware.ts` refreshes session cookies and protects `/app/*`.
- Authenticated users visiting `/login` are redirected to `/app`.
- Unauthenticated users visiting protected app routes are redirected to `/login`.
- `src/app/app/layout.tsx` performs a server-side `auth.getUser()` check before rendering the app shell.
- The app shell displays the current user's email and includes a logout control.

## Supabase Integration

The app keeps Supabase client creation centralized:

- `src/lib/supabase/client.ts` creates the browser client.
- `src/lib/supabase/server.ts` creates the server client using Next.js cookies.
- `src/lib/supabase/types.ts` contains hand-maintained table types for the current MVP schema.

The SQL setup lives in `docs/supabase-schema.sql` and includes:

- `profiles`
- `documents`
- `audit_logs`
- indexes
- `updated_at` trigger for profiles
- RLS policies
- private `documents` storage bucket setup and storage object policies

## Server Actions

Implemented mutations use server actions.

### Profile Actions

`src/app/app/profile/actions.ts`:

- Validates profile form data with Zod.
- Derives `user_id` from the authenticated session.
- Creates or updates only the current user's profile.
- Inserts `PROFILE_CREATED` or `PROFILE_UPDATED` audit events.
- Revalidates relevant app/public routes.

### Vault Actions

`src/app/app/vault/actions.ts`:

- Validates file type and size.
- Supports PDF, PNG, JPG, and JPEG.
- Computes a SHA-256 hash server-side.
- Uploads to the private `documents` bucket under `{userId}/{timestamp}-{safeFileName}`.
- Inserts document metadata into the `documents` table.
- Deletes metadata and attempts storage cleanup.
- Inserts `DOCUMENT_UPLOADED` and `DOCUMENT_DELETED` audit events.

## Document Handling

The vault displays document metadata only:

- file name
- file type
- readable file size
- SHA-256 hash preview
- upload timestamp
- visibility badge

It does not expose public storage URLs by default. Storage access is intended to remain user-scoped through Supabase Storage RLS policies.

## Public Profile

`/u/[id]` reads public profile fields by `user_id` and renders:

- display name
- headline
- university
- major
- location
- bio
- GitHub/LinkedIn/portfolio links
- simple verification badges

The public route does not expose private vault documents.

## Proof-Pack Sharing Flow

The route placeholders exist:

- `/app/proof-packs`
- `/app/proof-packs/new`
- `/share/[token]`

The database tables and business logic for proof packs are not implemented yet. Planned flow:

1. User selects vault documents.
2. User enters recipient label, expiry, and watermark.
3. Server creates a tokenized proof pack.
4. Public share route validates token and expiry before rendering limited metadata or document access.

## AI Authenticity Checker Flow

`/app/checker` is currently a placeholder. The intended flow is:

1. User pastes suspicious offer or document text.
2. Server-side route calls an AI model with a strict JSON schema.
3. Response is validated before rendering a risk report.
4. Report is saved to `document_checks`.
5. An audit event is inserted.

No AI provider call is currently implemented.

## Important Boundaries and Limitations

- This is an MVP, not a production identity/compliance system.
- Supabase Storage upload/delete code exists, but live project verification is pending.
- Hand-maintained Supabase types should eventually be generated from the database schema.
- Public profile read access is intentionally broad for current profile fields; private data should move to separate tables or stricter views if the model grows.
- Future proof-pack document access needs careful signed URL, expiry, and revocation design.
- AI checker output should be treated as decision support, not as a definitive fraud ruling.
