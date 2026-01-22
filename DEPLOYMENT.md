# Deployment Guide

## Prerequisites

1. **Supabase Project**: Create a project at [supabase.com](https://supabase.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Google OAuth**: Set up OAuth credentials in Google Cloud Console

## Step 1: Set Up Supabase

1. Create a new Supabase project
2. Go to **SQL Editor** and run the migration:
   - Copy the contents of `supabase/migrations/001_create_waitlist.sql`
   - Paste and execute in the SQL Editor
3. Configure Google OAuth:
   - Go to **Authentication > Providers**
   - Enable **Google**
   - Add your Google OAuth Client ID and Secret
   - Add redirect URLs:
     - `http://localhost:3000/waitlist/callback` (for local development)
     - `https://your-domain.vercel.app/waitlist/callback` (for production)
4. Get your API credentials:
   - Go to **Settings > API**
   - Copy your **Project URL** and **anon/public key**

## Step 2: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**
4. Go to **Credentials** and create **OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
6. Copy the **Client ID** and **Client Secret** to Supabase

## Step 3: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Your Supabase publishable key
4. Deploy!

## Step 4: Update Supabase Redirect URLs

After deployment, update your Supabase Google OAuth redirect URL to include your Vercel domain:
- Go to **Authentication > Providers > Google**
- Add: `https://your-domain.vercel.app/waitlist/callback`

## Testing

1. Visit your deployed site
2. Click "Start your daily SQL practice"
3. Fill out the waitlist form
4. Sign in with Google
5. Verify you see the success message
6. Check your Supabase dashboard to confirm the entry was saved

## Troubleshooting

### OAuth Redirect Error
- Ensure redirect URLs match exactly in both Google Cloud Console and Supabase
- Check that your Vercel domain is added to both places

### Database Errors
- Verify the migration was run successfully
- Check RLS policies are set correctly
- Ensure the user is authenticated before saving

### Environment Variables
- Double-check variable names (case-sensitive)
- Ensure `NEXT_PUBLIC_` prefix is included for client-side variables
- Restart Vercel deployment after adding new variables

