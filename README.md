# Daily SQL - Landing Page

A modern, conversion-focused landing page for a daily SQL practice platform. Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- **Modern Landing Page**: Clean, professional design matching Supabase aesthetic
- **Waitlist Signup**: Form-first flow with Google OAuth integration
- **Supabase Integration**: Database and authentication powered by Supabase
- **Responsive Design**: Mobile-first approach with dark theme
- **Type-Safe**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (get one at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your Supabase project:

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the migration from `supabase/migrations/001_create_waitlist.sql`
   - Go to Authentication > Providers and enable Google OAuth
   - Configure Google OAuth credentials (Client ID and Secret)
   - Add your redirect URL: `http://localhost:3000/waitlist/callback` (for local) and your production URL

3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
```

You can find these values in your Supabase project settings under API.

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Project Structure

```
/
├── app/
│   ├── api/waitlist/route.ts    # API endpoint for waitlist
│   ├── waitlist/                 # Waitlist signup pages
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── landing/                  # Landing page sections
│   ├── waitlist/                 # Waitlist components
│   └── ui/                       # shadcn/ui components
├── lib/
│   └── supabase/                 # Supabase client utilities
├── types/
│   └── waitlist.ts               # TypeScript types
└── supabase/
    └── migrations/               # Database migrations
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update your Supabase Google OAuth redirect URL to include your Vercel domain
5. Deploy!

## Database Schema

The waitlist table stores:
- `id` (UUID, primary key)
- `email` (text, from Google auth)
- `occupation` (text)
- `job_role` (text)
- `years_of_experience` (integer)
- `user_id` (UUID, foreign key to auth.users)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## License

Private project. and liscensed under a startup
Making sure everything works fine remerge

