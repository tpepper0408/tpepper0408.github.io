# Deployment Setup Guide

This guide will walk you through setting up your blog and deploying it to GitHub Pages (or alternative hosting).

## Initial Setup

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `yourusername.github.io` (replace with your actual username)
   - Or use any name if you'll use a custom domain
3. Don't initialize with README (we already have one)

### 2. Update Configuration

Before pushing, update these files with your information:

#### `astro.config.mjs`
```javascript
site: 'https://yourusername.github.io', // Your actual GitHub Pages URL
```

#### `README.md`
- Replace `yourusername` with your GitHub username
- Update contact information
- Customize the description

#### `src/layouts/BaseLayout.astro`
- Update the site title (currently `>_dev.log`)
- Update footer links

#### `src/pages/about.astro`
- Add your bio and information
- Update contact links

### 3. Push to GitHub

```bash
cd astro-blog

# Initialize git (if not already)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Astro blog setup"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/yourusername.github.io.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 4. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. That's it! The workflow will run automatically

### 5. Wait for Deployment

- Go to **Actions** tab in your repository
- Watch the "Deploy to GitHub Pages" workflow run
- Once complete (green checkmark), your site is live!
- Visit: `https://yourusername.github.io`

## Alternative Hosting Options

### Option A: Netlify

**Pros:** Instant deploy previews, form handling, serverless functions

**Setup:**

1. Sign up at [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Build settings (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Option B: Cloudflare Pages

**Pros:** Ultra-fast CDN, unlimited bandwidth

**Setup:**

1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Go to Pages → Create a project
3. Connect to GitHub and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click "Save and Deploy"

### Option C: Vercel

**Pros:** Zero config, automatic previews

**Setup:**

1. Sign up at [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel auto-detects Astro
5. Click "Deploy"

## Updating Your Site

The workflow is super simple:

```bash
# Make changes to markdown files or code
# Test locally
npm run dev

# Commit and push
git add .
git commit -m "Add new post about X"
git push

# GitHub Actions handles the rest!
```

## Troubleshooting

### Build failing?

1. Check GitHub Actions logs for specific error
2. Test build locally: `npm run build`
3. Common issues:
   - Invalid frontmatter YAML
   - Missing required fields
   - Syntax errors in .astro files

### Site not updating?

1. Check Actions completed successfully
2. Clear browser cache
3. Wait a few minutes for CDN propagation

---

Happy blogging! 🚀
