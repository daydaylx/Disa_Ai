Cloudflare Pages — Git Integration Only

- Production branch: `main`
- Build command: `npm ci && npm run build`
- Output directory: `dist`

Notes

- Base path: build uses `BASE_URL=./` for relative assets when needed (see CI workflows). On Pages, you can omit it if the project is at the root; otherwise, set an Environment Variable `BASE_URL` to a subpath.
- Domain changes only roll out on Production (main). Preview builds on branches do not change the custom domain.
- No Wrangler deploys, no deploy hooks, no GH Actions deploy: Pages pulls directly from Git.

Setup (Dashboard)

- Connect this repository to Cloudflare Pages
- Set Production branch to `main`
- Set Build command to `npm ci && npm run build`
- Set Output directory to `dist`
- Optionally set Environment Variable `BASE_URL` to `./` if you need strictly relative paths
- Attach custom domain and ensure SSL is active
