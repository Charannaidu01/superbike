# Real login + photo upload setup

## Supabase
1. Open your Supabase project.
2. Open **SQL Editor** → **New query**.
3. Paste `supabase-setup.sql` and click **Run**.
4. Open **Project Settings → API** and copy the Project URL and the browser-safe **Publishable key** (or legacy `anon` key).

## GitHub
In your repository:
1. **Settings → Secrets and variables → Actions → New repository secret**.
2. Add `VITE_SUPABASE_URL` with your Supabase Project URL.
3. Add `VITE_SUPABASE_ANON_KEY` with your Supabase Publishable/anon key.
4. Go to **Settings → Pages** and choose **GitHub Actions**.
5. Push/commit the files. The included workflow will build the Vite app and deploy it.

For the repository `Charannaidu01/bikeforge`, the site path is `/bikeforge/` and the workflow is already configured for that base path.

## Test
- Open the deployed site.
- Click **Sign In / Create Account**.
- Create an account with your real email and password.
- Confirm the email if Supabase asks you to.
- Sign in.
- Open **Customize**.
- Upload a JPG, PNG, or WEBP bike photo.
- The file is stored in Supabase Storage under your user ID.
- Sign out and sign in again; your account remains real and persistent.
