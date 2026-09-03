# Northline Contact Worker

Cloudflare Worker backend for the Free Assessment / Contact form.

**Live Worker:** https://google-services.catiq.workers.dev/

Validated form submissions are stored in **Cloudflare D1** (`leads` table).  
Email, CMS, and admin UI are **not** implemented yet.

## Structure

```
backend/worker/
  src/index.js              # Worker entry (POST /api/contact)
  migrations/               # D1 SQL migrations
    0001_create_leads.sql
  wrangler.toml             # Cloudflare + D1 config
  package.json
  README.md
```

## 1. Install dependencies

```bash
cd backend/worker
npm install
```

## 2. Create the D1 database (Cloudflare)

Run once while logged in to Cloudflare:

```bash
npx wrangler login
npm run db:create
```

Wrangler prints output similar to:

```text
Created your database 'google-services-leads' with id 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
```

Copy that UUID into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "google-services-leads"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # paste here
migrations_dir = "migrations"
```

> **Local-only testing:** you can develop locally before creating the remote database.  
> Use the local migration command below; replace `database_id` before deploying to production.

## 3. Run the migration

### Local (Wrangler dev)

```bash
npm run db:migrate:local
```

### Remote (production database)

After `database_id` is set:

```bash
npm run db:migrate:remote
```

## 4. Run the Worker locally

```bash
npm run dev
```

Wrangler serves at:

```text
http://127.0.0.1:8787
```

Health check:

```bash
curl http://127.0.0.1:8787/
```

## 5. Test a form submission

### Option A — site form

```bash
# terminal A — static site
python -m http.server 5500

# terminal B — worker (after migration)
cd backend/worker
npm run dev
```

Open http://127.0.0.1:5500/, scroll to Free Assessment, submit the form.

### Option B — curl

```bash
curl -X POST http://127.0.0.1:8787/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: http://127.0.0.1:5500" \
  -d "{
    \"clientName\": \"Jordan Hale\",
    \"email\": \"jordan@example.com\",
    \"phone\": \"+1 555 010 2841\",
    \"businessName\": \"Hale & Co. Plumbing\",
    \"service\": \"Local SEO\",
    \"mapsLink\": \"https://maps.google.com/?cid=example\",
    \"message\": \"Need help getting found locally.\"
  }"
```

Expected success:

```json
{
  "success": true,
  "message": "Your message has been received."
}
```

Invalid payloads return `400` and are **not** saved.

## 6. Verify the lead was stored

Local database:

```bash
npm run db:leads:local
```

Or:

```bash
npx wrangler d1 execute google-services-leads --local --command "SELECT * FROM leads ORDER BY id DESC LIMIT 5;"
```

Remote database (after deploy + remote migration):

```bash
npx wrangler d1 execute google-services-leads --remote --command "SELECT id, name, email, service, status, created_at FROM leads ORDER BY id DESC LIMIT 10;"
```

## 7. Deploy later

1. Set the real `database_id` in `wrangler.toml`
2. Apply remote migration: `npm run db:migrate:remote`
3. Deploy Worker: `npm run deploy`

Do **not** deploy until `database_id` is configured.

## How the frontend connects

The site form (`#contract-form`) is handled in `assets/site.js`.

On submit it:

1. Keeps existing client-side validation / invalid field UI
2. Sends a `POST` JSON request to `/api/contact`
3. Uses the local Worker on `localhost` / `127.0.0.1`
4. Uses the live Worker URL in production

No UI changes are required for D1 storage.

## API fields

Required:

- `clientName` → stored as `name`
- `email`
- `phone`
- `businessName` → stored as `business`
- `service`

Optional:

- `mapsLink` → stored as `website_url`
- `message`

Allowed `service` values:

- `Reputation Management`
- `Local SEO`
- `Paid Advertising`
- `Web Design & Development`
- `Not sure yet`

## Example error responses

Validation error (`400`):

```json
{
  "success": false,
  "message": "Please complete all required fields."
}
```

Database / server error (`500`):

```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

Internal database errors are never returned to the browser.

## CORS

Allowed origins are configured in `wrangler.toml` under `ALLOWED_ORIGINS`.  
Any `localhost` / `127.0.0.1` origin is also accepted for local development.

## What this Worker does NOT do yet

- Email delivery
- CMS / admin panel
- Authentication
- Bulk messaging
- Custom domain routing

Those will be added in later steps.
