# Ashidha Muneer — Portfolio

React 18 + Three.js (via @react-three/fiber) + Vite.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Edit content
- Text, projects, experience, skills, links: `src/data.js`
- Your photo: replace `public/ashidha.jpg` (portrait, about 3:4)
- Project screenshots: replace files in `public/previews/` (keep the same names, ~1200×710)
- Colors and fonts: top of `src/styles.css`
- 3D hero colors: `palette` in `src/Scene.jsx`

## Deploy to Vercel (recommended)
1. Create a new GitHub repo (e.g. `portfolio`) and push this folder:
   ```bash
   git init && git add . && git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/ashidhamuneer123/portfolio.git
   git push -u origin main
   ```
2. In Vercel: Add New → Project → import the repo. It detects Vite automatically
   (Build: `npm run build`, Output: `dist`). Click Deploy.
3. You get `your-project.vercel.app`. Rename the project in Settings to get a nicer free URL.
4. Every `git push` redeploys automatically.

## Custom domain (Namecheap)
1. Buy the domain on Namecheap.
2. Vercel → Project → Settings → Domains → add `yourdomain.com` (and `www`).
3. Vercel shows the DNS records to add. In Namecheap → Domain List → Manage → Advanced DNS,
   add exactly those records (usually an A record for `@` and a CNAME for `www`).
4. Wait for DNS (minutes to a few hours). Vercel issues HTTPS automatically.

## Alternative: Hostinger / any static host
`npm run build`, then upload the **contents** of `dist/` into `public_html`.
Paths are relative, so it also works in a sub-folder.
