# Product Decisions

PersonaVault AI is designed as a portfolio-grade MVP for personal identity, document organization, proof sharing, and AI-assisted authenticity review.

## Why Personal Identity Context Matters

People increasingly present themselves through fragmented links: GitHub, LinkedIn, portfolios, university pages, PDFs, certificates, screenshots, and chats. That fragmentation makes it hard to give a recipient the right amount of context without oversharing.

The verified profile module gives the app a simple anchor:

- who the user is
- what they study or do
- where their public work lives
- which public links they want to share

This is not a legal identity verification system. In the MVP, "verified" means the app has structure for verification flags and public badges, with deeper verification planned later.

## Why Document Organization Comes First

Proof sharing is only useful if the user can manage their source documents. The vault phase adds:

- private storage intent
- user-scoped paths
- metadata records
- SHA-256 hashes
- audit logging

This makes the later proof-pack feature more credible because packs can reference known vault documents instead of ad hoc uploads.

## Why Proof Packs Help

A proof pack can help users present selected evidence in a controlled way:

- only selected documents
- recipient label
- time-limited access
- watermarking intent
- audit visibility

The MVP intentionally keeps proof packs on the roadmap until the storage and metadata boundary is in place. The next implementation step should focus on token expiry, revocation, and avoiding accidental document exposure.

## Why AI Authenticity Checking Needs Care

AI can help summarize suspicious signals in offers, recruiter messages, or document text, but it should not be treated as a final authority.

The AI checker should be framed as:

- structured risk review
- evidence extraction
- recommended next actions
- uncertainty-aware decision support

It should not claim to prove fraud, guarantee authenticity, or replace official verification with employers, universities, or issuing bodies.

## Privacy and User Control

The product should default to user control:

- private vault storage
- no public document URLs by default
- user-scoped database rows
- explicit share links
- expiry for public proof packs
- audit logs for important actions

Future production hardening should include encryption strategy, retention controls, rate limiting, abuse handling, signed URL review, and security testing.

## MVP Trade-offs

Current trade-offs:

- Supabase types are hand-maintained instead of generated.
- Public profile fields are read directly from `profiles`.
- Proof packs and AI checker are represented by routes/placeholders but not connected to real business logic.
- Document encryption beyond Supabase platform storage is not implemented.
- Phase 4 storage behavior still needs manual verification against a live Supabase project.

These trade-offs keep the one-week MVP focused while preserving a credible path toward a safer product architecture.
