# LEARNA — AI-Powered 6Ds Learning Engine

> Continuous Learning. Measurable Performance.

The world's first unified digital workflow engine operationalising all six disciplines of the 6Ds Learning Framework.

Built by Eranda Wakista, Lead Learning Manager, HNB Assurance PLC.

## Deployment Instructions

### Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and open your project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-setup.sql` and paste it
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" — this means all tables and policies are created

### Step 2: Disable Email Confirmation (for testing)

1. In Supabase, go to **Authentication** → **Providers** → **Email**
2. Toggle OFF "Confirm email" (this lets users sign in immediately without email verification)
3. Save

### Step 3: Push Code to GitHub

1. Go to your GitHub repository (github.com/your-username/learna)
2. Click **Add file** → **Upload files**
3. Drag all the files from this project into the upload area
4. Make sure the folder structure is maintained:
   - `package.json`, `vite.config.js`, `vercel.json`, `index.html` at root
   - `src/` folder with all subfolders
5. Click **Commit changes**

### Step 4: Vercel Deployment

1. Go to [vercel.com](https://vercel.com)
2. Your project should auto-detect the new code and start deploying
3. If it doesn't, click **Redeploy** from the project dashboard
4. Wait 1-2 minutes for the build to complete
5. Your app is live at your Vercel URL

### Step 5: Test

1. Open your Vercel URL
2. Click **Sign Up** and create an account with `eranda.wakista@gmail.com` (this will be admin)
3. Sign in — you should see the Admin Dashboard
4. Open an incognito window, sign up with a different email — this will be a requestor
5. Submit a test request from the requestor account
6. Switch to admin — the request should appear in your dashboard

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Hosting**: Vercel (free tier)
- **AI**: Google Gemini API (free tier) for Learning Needs Advisor
- **Cost**: $0/month

## Admin Emails

These emails are automatically assigned the admin role:
- eranda.wakista@hnbassurance.com
- eranda.wakista@gmail.com

All other sign-ups default to "requestor" role.
