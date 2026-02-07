# Quick Start Guide: Adding New Posts

## Creating Your First Post

1. **Create a new file** in `src/content/blog/`:
   ```bash
   touch src/content/blog/my-new-post.md
   ```

2. **Add frontmatter** (the metadata at the top):
   ```markdown
   ---
   title: "My Awesome Post"
   description: "A short description that appears in previews and search results"
   pubDate: 2024-02-15
   tags: ["javascript", "tutorial"]
   ---
   ```

3. **Write your content** below the frontmatter in Markdown

4. **Preview locally**:
   ```bash
   npm run dev
   ```
   Then open http://localhost:4321

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Add new post"
   git push
   ```
   GitHub Actions will automatically build and deploy!

## Frontmatter Fields Explained

- `title`: **Required** - The title of your post
- `description`: **Required** - Used for SEO and post previews (keep it under 160 characters)
- `pubDate`: **Required** - Publication date in YYYY-MM-DD format
- `tags`: *Optional* - Array of tags (use lowercase, hyphenated words)
- `draft`: *Optional* - Set to `true` to prevent publishing (default: false)

## Markdown Tips

### Code Blocks

Use triple backticks with a language:

````markdown
```javascript
console.log('Hello, world!');
```
````

### Images

1. Add images to `public/images/`
2. Reference them in markdown:
   ```markdown
   ![Alt text](/images/my-image.png)
   ```

### Links

```markdown
[Link text](https://example.com)
```

### Headings

```markdown
## H2 Heading
### H3 Heading
#### H4 Heading
```

Use H2 for main sections, H3 for subsections.

## Common Workflows

### Draft a Post

Set `draft: true` in frontmatter to work on it without publishing:

```markdown
---
title: "Work in Progress"
draft: true
...
---
```

### Schedule a Post

Set a future `pubDate`. The post won't appear until that date (you'll need to rebuild).

### Update a Post

Just edit the `.md` file and push. The build date doesn't change, only content updates.

### Delete a Post

Delete the `.md` file and push.

## Troubleshooting

### Post not showing up?

- Check frontmatter is valid YAML
- Ensure `draft` is not set to `true`
- Check `pubDate` is not in the future
- Run `npm run build` locally to see errors

### Build failing?

- Check for syntax errors in frontmatter
- Ensure all required fields are present
- Look at GitHub Actions logs for specific errors

### Dark mode not working?

- Clear browser cache
- Check browser console for JavaScript errors

## Need Help?

- Check the main [README.md](./README.md)
- Open an issue on GitHub
- Review the [Astro documentation](https://docs.astro.build)
