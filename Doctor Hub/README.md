# Doctor Hub

A healthcare consultation and patient history management system.

## Setup

### 1. Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Run **`supabase-schema.sql`** in the Supabase SQL editor.
3. In Supabase → Storage → New Bucket → name it **`payment-screenshots`** and set it to **Public**.
4. Copy your project URL and anon key from **Settings → API**.

### 2. Environment Variables

Create a `.env` file (or set Vercel env vars):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Run Locally

```bash
npm install
npm run dev
```

### 4. Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo.
3. Add Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Click Deploy.

## Features

- Doctor search (Allopathic / Homeopathic / Herbal)
- Appointment booking with payment upload
- Assistant payment verification workflow
- Medical history (immutable records)
- Prescription management (append-only)
- RBAC: Patient, Doctor, Assistant, Admin, Super Admin
- JWT authentication via Supabase Auth

## Project: FA23-BSE-014
