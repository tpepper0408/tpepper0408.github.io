---
title: "Building a Dark Mode Toggle"
description: "How to implement a flicker-free dark mode toggle in vanilla JavaScript with localStorage persistence."
pubDate: 2024-02-05
tags: ["javascript", "css", "web-dev"]
---

Dark mode has become a must-have feature for modern websites. But implementing it well—without that annoying flash of light theme on page load—requires a bit of finesse.

## The Flash Problem

The naive approach is to check `localStorage` after the page loads and apply the theme. But this causes a visible flash:

```javascript
// ❌ This causes a flash
window.addEventListener('load', () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
  }
});
```

## The Solution: Inline Script

The trick is to run a blocking script in the `<head>` before any content renders:

```html
<script>
  const theme = (() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  })();
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
</script>
```

## CSS Setup with Tailwind

Using Tailwind's dark mode is straightforward:

```css
/* tailwind.config.js */
module.exports = {
  darkMode: 'class',
  // ...
}
```

Then use the `dark:` variant:

```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content here
</div>
```

## Toggle Implementation

Here's a complete toggle button:

```javascript
const toggle = document.getElementById('theme-toggle');

toggle.addEventListener('click', () => {
  const element = document.documentElement;
  const isDark = element.classList.contains('dark');
  
  if (isDark) {
    element.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    element.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
});
```

## Respecting System Preferences

You can also listen for changes to the system theme:

```javascript
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', e => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', e.matches);
    localStorage.setItem('theme', newTheme);
  });
```

## Testing

Don't forget to test:

1. Initial page load (no flash!)
2. Toggle functionality
3. Persistence across page reloads
4. System preference changes
5. Accessibility (keyboard navigation)

## Wrapping Up

A good dark mode implementation is invisible to users—it just works. By using an inline script and respecting user preferences, you can create a smooth, professional experience.
