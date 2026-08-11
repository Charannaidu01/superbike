# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## Real email login + photo uploads
This project has been updated without replacing the original UI. It now supports:
- Real Supabase email/password sign up
- Real sign in and sign out
- Persistent sessions
- Password reset email
- Real motorcycle photo uploads to Supabase Storage
- Photo metadata linked to the authenticated user
- GitHub Pages deployment through GitHub Actions

### One-time setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase-setup.sql`.
3. In Supabase Authentication settings, keep Email enabled. If email confirmation is enabled, users must confirm their email before the first login.
4. In your GitHub repository, open **Settings → Secrets and variables → Actions** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Enable GitHub Pages using **GitHub Actions** as the source.
6. Push the project to the `main` branch. The included workflow builds and deploys it.

The Supabase publishable/anon key is intended for frontend use when Row Level Security is configured. Never expose a `service_role`/secret key in this repository.
