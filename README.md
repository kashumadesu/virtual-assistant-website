# Zen Virtual Assistance — Platform POC

A full-stack Virtual Assistance Management Platform built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## Tech Stack

- **Frontend/Backend**: Next.js 15 App Router (TypeScript)
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (architecture ready)
- **Deployment**: Vercel

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/kashumadesu/virtual-assistant-website.git
cd virtual-assistant-website
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase project values from [supabase.com](https://supabase.com/dashboard).

### 3. Set Up Database

In your Supabase SQL editor, run the following in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`

### 4. Create Demo Users

In your Supabase Dashboard → Authentication → Users, create:

| Email | Password | Notes |
|-------|----------|-------|
| admin@zenva.test | Admin123! | Role: admin |
| employee@zenva.test | Employee123! | Role: employee |
| client@zenva.test | Client123! | Role: client |

Then run `supabase/seed.sql` in the SQL editor to set roles and insert sample data.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

The login page includes quick-fill buttons for all three demo accounts.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@zenva.test | Admin123! |
| Employee | employee@zenva.test | Employee123! |
| Client | client@zenva.test | Client123! |

## User Roles

- **Admin**: Full access — users, activity logs, dashboards
- **Employee**: Tasks, files, messages, profile
- **Client**: Tasks (read-only), files, messages, profile

## Activity Logging

Every meaningful action is logged to `activity_logs`:
- Login / Logout / Failed Login
- Dashboard access
- File access
- Task views and updates
- Messages sent
- Profile views and updates

Admins can filter logs by: User, Role, Action, Module, Date range, Search.

## Deployment to Vercel

The application is fully configured and ready for one-click or Git-integrated hosting on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkashumadesu%2Fvirtual-assistant-website&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY)

### Option A: Automatic Git Integration (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** → **Project**.
3. Select and import your GitHub repository: `kashumadesu/virtual-assistant-website`.
4. Framework Preset will automatically detect **Next.js** (configured via `vercel.json`).
5. In the **Environment Variables** section, enter the 3 keys from your Supabase project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click **Deploy**. Vercel will build and assign you a live production URL with automatic HTTPS and continuous deployment on every `git push`.

### Option B: Deploy via Vercel CLI
```bash
# Link and deploy to Vercel directly from the terminal
npx vercel
# Follow the interactive prompts, then deploy to production:
npx vercel --prod
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public landing page
│   ├── login/                # Login page
│   ├── admin/                # Admin portal
│   ├── employee/             # Employee portal
│   ├── client/               # Client portal
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── navigation/           # Sidebar, TopBar, DashboardLayout
│   ├── landing/              # Public website sections
│   └── messages/             # Messaging components
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── auth/                 # Auth utilities
│   └── activity/             # Centralized logger
├── types/                    # TypeScript interfaces
└── utils/                    # Helper functions
```
