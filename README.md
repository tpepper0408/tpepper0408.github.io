# Pepper Headspace

A thoughtful, personal blog exploring technical leadership, inclusive team building, and the intersection of technology and people. Built with Astro, Tailwind CSS, and a terminal-inspired aesthetic.

## ✨ Features

- 🚀 **Blazing fast** - Static site generation with Astro
- 🎨 **Dark/Light mode** - Flicker-free theme toggle with localStorage
- 🏷️ **Tag system** - Organize posts by topics
- 📱 **Responsive** - Looks great on all devices
- 🔍 **SEO optimized** - Meta tags, sitemap, RSS feed
- 💻 **Code highlighting** - Beautiful syntax highlighting with Shiki
- ⚡ **Zero JavaScript** - By default (only for dark mode toggle)
- 📝 **Markdown content** - Simple content authoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone this repository:
```bash
git clone https://github.com/tpepper0408/pepper-headspace.github.io.git
cd pepper-headspace.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:4321](http://localhost:4321) in your browser

## 📝 Writing a Blog Post

Creating a new blog post is simple:

1. Create a new `.md` file in `src/content/blog/`
2. Add frontmatter with required fields:

```markdown
---
title: "Your Post Title"
description: "A brief description of your post"
pubDate: 2024-02-15
tags: ["tag1", "tag2"]
---

Your content here...
```

3. Write your content in Markdown
4. Commit and push - GitHub Actions will deploy automatically!

### Frontmatter Fields

- `title` (required) - Post title
- `description` (required) - Brief description for SEO and post preview
- `pubDate` (required) - Publication date (YYYY-MM-DD format)
- `tags` (optional) - Array of tags
- `draft` (optional) - Set to `true` to exclude from build

### Markdown Features

All standard Markdown is supported, plus:

- Syntax-highlighted code blocks
- Tables
- Task lists
- Footnotes
- And more!

Example code block:

````markdown
```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
````

## 🎨 Customization

### Updating Your Contact Info

Edit `src/pages/about.astro` and replace the placeholder links:

```astro
- Email: your.email@example.com
- LinkedIn: linkedin.com/in/yourprofile  
- GitHub: github.com/yourhandle
```

### Updating Site URL

Edit `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://pepper-headspace.github.io',
  // or your custom domain like 'https://pepperheadspace.com'
});
```

### Changing Colors

Edit the Tailwind config in `tailwind.config.mjs`:

```javascript
colors: {
  accent: {
    cyan: '#00ffff',    // Change to your preferred color
    green: '#00ff00',
    orange: '#ff6b35',
  },
}
```

### Updating Fonts

Fonts are loaded from Google Fonts in `src/styles/global.css`. Replace the import URL with your preferred fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

Then update `tailwind.config.mjs`:

```javascript
fontFamily: {
  sans: ['Your Font', 'sans-serif'],
  // ...
}
```

### Modifying the Layout

- Header/Nav: `src/layouts/BaseLayout.astro`
- Blog post layout: `src/layouts/BlogPost.astro`
- Homepage: `src/pages/index.astro`

## 🚢 Deployment

This blog is configured to deploy automatically via GitHub Actions.

### GitHub Pages (Default)

1. Go to your repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to the `main` branch
4. Your site will be live at `https://pepper-headspace.github.io`

### Netlify (Alternative)

1. Rename `.github/workflows/deploy-netlify.yml.example` to `deploy.yml`
2. Add secrets to GitHub:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
3. Push to deploy

### Cloudflare Pages (Alternative)

1. Rename `.github/workflows/deploy-cloudflare.yml.example` to `deploy.yml`
2. Add secrets to GitHub:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. Update `projectName` in the workflow
4. Push to deploy

## 📁 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── content/
│   │   └── blog/       # Blog posts (markdown files)
│   ├── layouts/        # Astro layouts
│   ├── pages/          # Page routes
│   ├── styles/         # Global CSS
│   └── content/
│       └── config.ts   # Content collection schema
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind configuration
└── package.json
```

## 🛠️ Built With

- [Astro](https://astro.build) - Static site framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Shiki](https://shiki.matsu.io/) - Syntax highlighting
- [IBM Plex](https://fonts.google.com/specimen/IBM+Plex+Sans) - Typography

## 📄 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📮 Contact

- GitHub: [@tpepper0408](https://github.com/tpepper0408)
- Email: tim.pepper04@gmail.com

---

Built with ❤️ using Astro
