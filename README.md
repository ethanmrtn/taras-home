# Tara's Home

sticker-book app for planning stuff to buy for a new home

## setup

```bash
npm install
npx convex dev
npm run dev
```

runs on `localhost:3000`

## env vars

create `.env.local`:

```
CONVEX_DEPLOYMENT=<your-convex-deployment>
VITE_CONVEX_URL=http://127.0.0.1:3210
VITE_CONVEX_SITE_URL=http://127.0.0.1:3211
VITE_SITE_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<generate with: npx @better-auth/cli secret>
```

## deploy

hosted on netlify + convex. build runs `npx convex deploy --cmd 'vite build'`.

set `CONVEX_DEPLOY_KEY`, `VITE_CONVEX_URL`, `VITE_CONVEX_SITE_URL`, `VITE_SITE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET` in netlify env vars.

## stack

react, tanstack start, convex, better auth, tailwind, shadcn
