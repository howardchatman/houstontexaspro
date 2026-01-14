# Houston Texas Pro - Contractor Directory

A full-featured contractor directory web application for Houston, Texas built with Next.js 14, Supabase, and shadcn/ui.

## Features

- **Contractor Listings**: Browse and search Houston-area contractors
- **25 Trade Categories**: From electrical to landscaping and everything in between
- **User Accounts**: Contractors can register and manage their profiles
- **Reviews & Ratings**: Customers can leave reviews, contractors can respond
- **Mini-Sites**: Each contractor gets a dedicated profile page at `/contractors/[slug]`
- **Photo Gallery**: Contractors can showcase their work
- **Lead Capture**: Contact forms that create leads in the contractor's dashboard
- **AIVA Integration**: AI Voice Assistant-ready call button for lead capture
- **Search & Filters**: Search by category, location, rating, and more
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)

### 1. Clone and Install

```bash
cd houstontexaspro
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up Database

Run the SQL migrations in your Supabase SQL Editor (in order):

1. `supabase/migrations/001_initial_schema.sql` - Creates tables, types, and functions
2. `supabase/migrations/002_rls_policies.sql` - Sets up Row Level Security
3. `supabase/migrations/003_seed_categories.sql` - Seeds the 25 contractor categories

### 4. Set Up Storage (Optional)

For photo gallery uploads:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `gallery`
3. Set the bucket to public
4. Add a policy to allow authenticated users to upload

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
houstontexaspro/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── categories/          # Category listing pages
│   ├── contractors/         # Contractor listing and profile pages
│   ├── dashboard/           # Contractor dashboard
│   ├── search/              # Search results page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── contractors/         # Contractor-related components
│   ├── leads/               # Lead form and call button
│   ├── layout/              # Header, Footer, Sidebar
│   └── reviews/             # Review components
├── lib/
│   ├── supabase/            # Supabase client setup
│   └── utils.ts             # Utility functions
├── supabase/
│   └── migrations/          # SQL migration files
├── types/
│   └── index.ts             # TypeScript types and constants
└── public/                  # Static assets
```

## Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, search, featured contractors, categories |
| Browse Contractors | `/contractors` | List all contractors |
| Contractor Profile | `/contractors/[slug]` | Individual contractor mini-site |
| Categories | `/categories` | All 25 categories |
| Category Listings | `/categories/[category]` | Contractors in a category |
| Search Results | `/search` | Search with filters |
| Login | `/login` | User sign in |
| Register | `/register` | Customer registration |
| Contractor Register | `/register/contractor` | 3-step contractor registration |
| Dashboard | `/dashboard` | Contractor dashboard home |
| Profile Settings | `/dashboard/profile` | Edit contractor profile |
| Gallery | `/dashboard/gallery` | Manage photos |
| Leads | `/dashboard/leads` | View and manage leads |
| Reviews | `/dashboard/reviews` | View and respond to reviews |

## AIVA Integration

The project includes a call button component ready for AI Voice Assistant integration. To enable:

1. Choose a provider (Vapi.ai, Twilio + OpenAI, or Bland.ai)
2. Set up your AIVA account and get API keys
3. Add to `.env.local`:
   ```env
   AIVA_API_KEY=your_api_key
   AIVA_WEBHOOK_SECRET=your_webhook_secret
   ```
4. Implement the webhook handler in `app/api/aiva/webhook/route.ts`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works with any platform that supports Next.js:
- Railway
- Render
- DigitalOcean App Platform
- Self-hosted with Node.js

## License

MIT
