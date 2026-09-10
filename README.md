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

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy

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
