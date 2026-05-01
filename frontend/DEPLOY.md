# Frontend Deployment Notes

## ✅ Render Deployment Checklist

### Critical Configuration

1. **vite.config.js** - Must use root base path:

   ```js
   base: "/"; // ✅ Correct for Render
   base: "/project-management/"; // ❌ Wrong - for GitHub Pages only
   ```

2. **\_redirects file** - Must exist in `public/` folder:

   ```
   /*    /index.html   200
   ```

   This enables React Router to work on direct URLs and refresh.

3. **Environment Variables** - On Render dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

### Build Settings on Render

- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Node Version:** Auto-detected from package.json

### Common Issues

**White screen / Assets 404:**

- Check `base: "/"` in vite.config.js
- Clear browser cache (Ctrl+Shift+R)

**MIME type errors:**

- Incorrect base path in vite.config.js
- Assets being served from wrong path

**React Router 404 on refresh:**

- Missing `_redirects` file
- Wrong content in `_redirects`

**API calls failing:**

- Check `VITE_API_BASE_URL` environment variable
- Must end with `/api`
- Must use `https://` for production

### Testing Locally

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

Visit http://localhost:4173 to test production build locally.

### Deployment Commands

```bash
# After making changes
git add .
git commit -m "Fix: Update for Render deployment"
git push origin main
```

Render will auto-deploy on push to main branch.
