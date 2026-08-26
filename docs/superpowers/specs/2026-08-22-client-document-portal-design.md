# Client Document Portal — Design

**Date:** 2026-08-22
**Status:** Approved for planning
**Repo:** new — `vantage-portal` (this spec moves there once it exists)

## Purpose

Give Vantage Safety Services clients authenticated access to the documents
produced for them — RAMS, inspection reports, certificates, policies. Clients
browse a thumbnail grid, read documents in the browser, and download them.
Vantage staff upload, categorise, and assign documents to clients.

The existing marketing site is untouched. It stays on GitHub Pages at the apex
domain; the portal is a separate application on `portal.vantagesafetyservices.co.uk`.

## Scope

**In:** authenticated document access, in-browser preview and download,
admin upload with categorisation, client and user provisioning, download audit,
document expiry tracking.

**Out (deliberately):** free-form tags, client uploads, acknowledgement /
e-signature workflows, invite emails, notifications, expiry reminders,
non-PDF file types. Each is additive against this design; none requires
revisiting it.

## Architecture

| Component | Technology | Hosting |
|---|---|---|
| Portal SPA | React 19, Vite, Tailwind (matches marketing site) | Static Web Apps, Free tier |
| API | .NET 10 minimal API | Container Apps, Consumption |
| Database | Azure SQL, Basic tier (5 DTU, 2GB) | — |
| Documents | Blob Storage, private container `documents` | — |
| Thumbnails | Blob Storage, private container `previews` | — |
| Identity | Microsoft Entra External ID (external tenant) | — |

Domains: `portal.vantagesafetyservices.co.uk` (SPA),
`api.vantagesafetyservices.co.uk` (API).

Blobs are named by document GUID. Nothing in a blob name reveals ownership or
content, and renaming a document is a database update rather than a file move.

## Identity and authorisation

### Sign-in

Entra External ID external tenant, sign-up-and-sign-in user flow configured for
**email one-time passcode**. Self-service sign-up is disabled by setting
`isSignUpAllowed = false` on the user flow via Microsoft Graph.

**On MFA:** email OTP does not rule out multifactor authentication — **SMS text
codes** may be added as a second factor. What is impossible is email OTP serving
as both factors. Phase 1 ships single-factor email OTP; enabling SMS later is a
user-flow configuration change requiring no change to this design.

(An earlier revision of this spec stated MFA was unavailable entirely. That was
wrong, and the decision to accept single-factor sign-in should be re-taken on the
correct facts rather than inherited.)

### Provisioning

Because sign-up is disabled, accounts are created by the API. `POST /api/admin/clients`
takes `{ businessName, contactEmail }` and, in one operation:

1. Creates the `Client` row
2. Creates the Entra user via Graph with an `emailAddress` identity
3. Creates the `AppUser` row and a `UserClient` membership

Graph requires a `passwordProfile` on a local-account identity, so one is
generated and discarded — never returned, logged, or sent to the client. It is
not a usable portal credential: the sign-in method is decided by the user flow,
not the user object, so the account still signs in by one-time passcode.
`passwordPolicies` must be `DisablePasswordExpiration`, or the account expires
and locks the client out of a flow that never uses the password.

(An earlier revision specified *no* password profile. That was wrong — Graph
rejects it, and the first real provisioning call would have failed.)

Vantage tells the client to visit the portal; there is no invite email.

**Graph access — the federated-credential design does NOT work here.**

The Container App's user-assigned managed identity lives in the Azure
subscription's tenant (`cf50f445`), which is *not* the External ID tenant
(`d5865b05`). The original design had an app registration in the External ID
tenant trusting that identity through a federated identity credential, so no
secret would exist.

**Microsoft does not permit this.** Per *Configure an application to trust a
managed identity*: "The managed identity must be in the same tenant as the app
registration." A cross-tenant attempt fails with **AADSTS700236** — Entra-issued
tokens may not be used for federated identity credential flows for applications
registered in that tenant.

Verified 2026-08-24, after the identity was deployed. The managed identity does
successfully mint a token for `api://AzureADTokenExchange` (iss = home tenant,
sub = principal id) — but obtaining the assertion was never the constrained
step. Its acceptance across a tenant boundary is, and that is refused.

Microsoft's documented cross-tenant path is a **multitenant** app registered in
the home tenant and provisioned into the other tenant. Whether an external
(CIAM) tenant will admit a foreign multitenant service principal and grant it
`User.ReadWrite.All` is unverified — external tenants restrict API permissions
and require single-tenant registrations of their own apps.

The design must therefore choose between that unverified path and a credential
held in Key Vault. See the Phase 1 plan for the decision.

**Risk, to be settled in phase 1:** the exact Graph request shape for creating
an external-tenant user that can sign in with email OTP only, and the
cross-tenant federated credential, are the least certain parts of this design.
Both are proven or disproven before any other work begins.

### Authorisation

Entra establishes *who you are*. The database decides *what you can see*.

The access token is validated conventionally — issuer, audience, signature via
cached JWKS. A claims transformation then loads the `AppUser` by `oid` once per
request (memory-cached) along with its memberships. A token with no matching
`AppUser` receives 403 and sees nothing; authentication alone grants no access.

### Tenant resolution

**Endpoints are agnostic to all of this.** Tenant resolution is middleware. By
the time any handler runs the request has either been rejected or
`TenantContext` holds an authorised organisation id. There is no fallback and no
implicit default — one rule, every caller.

The header is a **request, not an assertion**:

1. Middleware resolves the caller's permitted organisations — their `UserClient`
   memberships, or *all* clients if `AppUser.IsAdmin`
2. Header absent → **400**
3. Header names an organisation outside that set → **403**
4. Otherwise the id is written to a scoped `TenantContext`

Handlers never read the header, never read `TenantContext`, and never mention
`ClientId`. They write `db.Documents.Where(d => d.Category == category)` and the
EF global query filter scopes the result. Tenancy is invisible to application
code, which is the entire point — a handler cannot forget to apply it.

`GET /api/organizations` is the sole exception, because a caller cannot know a
legal organisation id before asking which memberships it has. That is expressed as
pipeline composition rather than a condition inside a handler — the bootstrap
route simply does not have the filter attached:

```csharp
var bootstrap = app.MapGroup("/api");
var tenanted  = app.MapGroup("/api").AddEndpointFilter<ResolveTenant>();

bootstrap.MapGet("/organizations", ...);  // no tenant resolution
tenanted .MapGet("/documents", ...);      // resolved and authorised before entry
```

Because nothing is ever inferred, every request's organisation was explicitly
chosen by the caller and explicitly authorised by the server, and the audit row
records that choice rather than a server-side guess.

An EF Core **global query filter** on `Document` reads `TenantContext.OrgId`.
Application code never mentions organisation, and a query that omits the scope
cannot be written. A client requesting another client's document GUID receives
404 from the ORM rather than 403 from a hand-written guard. Admin queries bypass
the filter explicitly via `IgnoreQueryFilters()`, so every bypass is greppable.

## Data model

```
Client        Id, BusinessName, ContactEmail, IsActive, CreatedUtc

AppUser       Id, Email UNIQUE, EntraObjectId UNIQUE NULL, DisplayName,
              IsAdmin, InvitedUtc, FirstSignInUtc, LastSeenUtc

UserClient    AppUserId + ClientId (composite PK), GrantedUtc

Site          Id PK, ClientId FK, Name,
              Status {Active|Complete}, StartedUtc

Document      Id PK, ClientId FK, SiteId FK NULL,
              Title, Category, DocumentDate, ExpiresUtc NULL,
              PreviewBlobId NULL, PreviewStatus {Pending|Ready|Failed},
              UploadedByUserId FK, UploadedUtc, IsArchived

DocumentFile  Id PK (= blob name), DocumentId FK,
              FileName, ContentType, SizeBytes, PageCount NULL,
              IsPrimary, UploadedUtc

DownloadAudit Id, DocumentId FK, DocumentFileId FK NULL, AppUserId FK,
              ClientId FK, Action {View|Download}, OccurredUtc,
              IpAddress, UserAgent
```

### A document is a record, not a file

The same document exists in several formats: a PDF the client reads in the
browser, a DOCX they can edit, sometimes a signed scan. These are renditions of
one thing, not separate documents — they share a title, a category, a site, an
expiry date and an audit trail. Separate `Document` rows would duplicate all of
that and show the client the same RAMS three times.

- **One file per document carries `IsPrimary`** — the one the reader opens. In
  practice the PDF, because that is what browsers render natively.
- **The thumbnail comes from the primary rendition**, so `PreviewBlobId` stays on
  `Document` rather than on each file.
- **A document with no PDF is download-only**, not an error. The reader shows the
  file list in place of a viewer.
- **Unique on `(DocumentId, ContentType)`** — two DOCX renditions of one document
  is a mistake, not a feature.
- `DownloadAudit` gains `DocumentFileId`: "who took the editable copy" is a
  different question from "who read it".

### Category is a lookup, not an enum

Originally a fixed enum of RAMS, Inspection, Certificate, Policy. CEMPs were
wanted almost immediately, and COSHH assessments and waste transfer notes will
follow. The portal derives its filter cards from the categories actually present
on documents, so adding one must not require a deployment.

Indexes: `Document(ClientId, IsArchived)`, `Document(SiteId)`,
`Document(ExpiresUtc)` filtered on non-null, `DocumentFile(DocumentId)`,
unique on `DocumentFile(DocumentId, ContentType)`, unique on `AppUser.Email`
and `AppUser.EntraObjectId`, `DownloadAudit(DocumentId, OccurredUtc)`.

`EntraObjectId` is nullable because the row is created at provisioning time,
before the person has ever signed in. On first sign-in the API matches the
verified email from the token and binds the `oid`; every subsequent request
matches on `oid` alone.

**Email matching is safe here specifically because email OTP *is* the identity** —
the user proved control of that address to obtain a token. This must carry a
code comment: if federated sign-in is ever added, email claims stop being
self-verifying and this match must be re-examined.

`Category` drives the card colour and the filter tiles, and is a lookup rather
than an enum (see above). Free-form tags remain deferred — the category axis has
so far been sufficient.

## API

All endpoints require a valid token. Client endpoints are scoped by
`TenantContext`; admin endpoints require `IsAdmin`.

**Client**

- `GET /api/organizations` — the caller's permitted organisations as
  `[{ id, businessName }]`, plus `isAdmin`. The only unfiltered route, and the
  bootstrap the SPA calls before it can address any other endpoint. Display name
  and email are deliberately absent: they are already in the ID token, so MSAL
  supplies them without a round trip. For an admin the list is every client,
  which is what the admin UI's client selector needs
- `GET /api/documents` — filters: `category`, `search` (LIKE on title and
  filename), `expiringBefore`; sorts by `documentDate` or `title`; paged.
  Each row carries a 30-minute `previewUrl`
- `GET /api/documents/{id}/content?disposition=inline|attachment` — 302 to a
  5-minute, read-only, single-blob user-delegation SAS

**Admin**

- `POST /api/admin/clients` — `{ businessName, contactEmail }`; provisions as above
- `GET /api/admin/clients` — full client detail (contact email, active,
  created); `GET /api/organizations` covers the id-and-name selector case
- `GET /api/admin/users`
- `POST /api/admin/users` — add a further person to an existing client;
  provisions the Entra account via Graph exactly as `POST /api/admin/clients`
  does, and creates a `UserClient` membership. A user who already exists gains
  an additional membership rather than a second account
- `POST /api/admin/documents` — multipart; stores blob, renders preview,
  creates row
- `PUT /api/admin/documents/{id}` — retitle, recategorise, set expiry
- `DELETE /api/admin/documents/{id}` — soft archive
- `GET /api/admin/documents/{id}/audit`

## Preview pipeline

Rendering runs in a **Container Apps job**, not in the API.

On upload the API validates the file, stores the blob, writes the rows and
enqueues the document id. It returns immediately with `PreviewStatus = Pending`.
A job triggered by that queue renders the preview, writes it to the `previews`
container and sets the status.

### Why a job rather than inline

A synchronous render is simpler and, for PDFs alone, cheap — PDFium is a small
native library rendering a page in milliseconds. The decision is driven by what
comes next:

- **Office renditions need LibreOffice**, which is ~500MB, takes seconds, and
  wants hundreds of megabytes of memory. Inside an API that scales to zero on
  0.25 vCPU it would dominate the image, slow every cold start, and risk being
  killed mid-request.
- **One mechanism, not two.** Rendering PDFs inline and spreadsheets out of band
  would mean two code paths, two failure modes and two places to look when a
  thumbnail is missing.
- **Failures become retryable.** A queue message can be redelivered; a
  half-finished synchronous render cannot.
- **Upload stops depending on rendering.** The admin gets an answer as soon as
  the file is stored, rather than waiting on a converter.

`PreviewStatus` already modelled this: `Pending` stops being vestigial and
becomes the state a document genuinely occupies for a few seconds after upload.

### Sequence

1. API validates the upload — magic bytes, size, permitted type
2. API writes the blob under the `DocumentFile` id
3. API writes `Document` and `DocumentFile` rows, `PreviewStatus = Pending`
4. API enqueues the document id on an Azure Storage queue
5. API responds — the admin screen shows the document as generating
6. The job scales from zero on the queue, renders the primary rendition, writes
   the preview blob and sets `PreviewStatus = Ready` or `Failed`

### Rendering rules

- The preview is generated from the **primary** rendition only.
- PDF renders directly through PDFium.
- Office formats convert to PDF first, then render by the same path — one
  renderer, one output.
- A document whose primary rendition cannot be rendered ends as `Failed` and
  shows its category mark instead. It remains downloadable: a missing thumbnail
  must never hide a document.

### Failure and retry

Queue delivery is at-least-once, so rendering must be idempotent — writing the
same preview twice is harmless. A message that fails repeatedly lands on the
poison queue rather than blocking the queue; the document stays `Failed` and can
be re-enqueued by hand.

## Security requirements

- Storage account: `allowBlobPublicAccess: false` and `allowSharedKeyAccess: false`.
  Disabling shared-key access removes account keys entirely; user-delegation SAS
  still works because it is Entra-signed rather than key-signed
- SQL: Entra-only authentication, no SQL logins, managed identity from the API
- SAS: read-only, single blob, 5 minutes for downloads, 30 for previews
- CORS: the portal origin only
- Rate limiting on download and upload endpoints via the built-in .NET limiter
- No secrets in configuration if federated credentials work as intended

## Infrastructure and cost

| | Monthly |
|---|---|
| Azure SQL, Basic | ~£4 |
| Container Apps, scale-to-zero | £0–2 |
| Blob Storage | <£1 |
| Static Web Apps, Free | £0 |
| Entra External ID (50k MAU free) | £0 |
| **Total** | **~£5–8** |

**Azure SQL serverless was rejected.** Its floor without pausing exceeds
$200/month, and auto-paused on weekday-hours usage it runs $80–100. Basic tier
is ~$4.78 flat, never cold-starts, and 2GB is vastly more than this metadata
needs.

Container Apps scale-to-zero stays inside the free grant (180,000 vCPU-seconds
and 2M requests per subscription per month). The trade is a 5–15 second cold
start on the first request after idle; the SPA shows an honest waking state. If
that becomes irritating, a KEDA cron scaler holding one warm replica during
weekday business hours costs a pound or two.

## Testing

Integration tests carry the weight: `WebApplicationFactory` with Testcontainers
for real SQL Server and Azurite. Five tests matter most —

1. A client requesting another client's document GUID receives 404
2. `X-Client-Org-Id` naming an organisation the caller does not belong to → 403
   and a request omitting the header entirely → 400
3. A token with no `AppUser` row → 403
4. A non-admin calling an admin endpoint → 403
5. A `.docx` renamed to `.pdf` is rejected at upload

Unit tests cover the preview renderer, filter composition, and tenant
resolution. Playwright covers sign-in → list → preview → download against a
deployed environment.

## Build phases

Each phase ends somewhere work could stop.

1. **Infrastructure and auth.** Container App, SQL, storage, External ID tenant,
   user flow, app registrations, federated credential. Proves a real token
   reaches `/api/organizations` and that Graph provisioning works. *Deliberately first —
   this holds the design's two least certain pieces.*
2. **Schema and provisioning.** EF model, migrations, tenant middleware and
   global query filter, `POST /api/admin/clients` end to end.
3. **Documents.** Upload, validation, PDFium preview, list and content endpoints.
4. **Portal SPA.** MSAL sign-in, org picker, thumbnail grid, filters, inline
   viewer, download. The SPA calls `GET /api/organizations` on load, persists the selected
   organisation in `localStorage`, and attaches `X-Client-Org-Id` to every
   subsequent request from a single fetch wrapper.
5. **Audit and hardening.** Download audit, expiry surfacing, rate limits,
   security pass.
