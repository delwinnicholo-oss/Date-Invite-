# 💕 Romantic Date Invitation

A beautiful, animated single-page React app to ask someone out on a date.

## Features

- 💌 Playful "Yes / No" screen — the No button runs away!
- 📅 Elegant date picker calendar
- 🌙 Time selection with animated pill cards
- 🍣 Food preference multi-select grid
- ✨ Romantic summary card with floating hearts burst
- 📅 One-click Google Calendar export

## Tech Stack

- **React 18** + **Vite**
- **Framer Motion** — page transitions, spring animations
- **Canvas API** — floating hearts background
- **Google Fonts** — Playfair Display + Poppins

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3. Build for production

```bash
npm run build
```

---

## Deploy to Vercel (Free, Instant)

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B — Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Click **Deploy** — done! 🎉

You'll get a live URL like `https://romantic-date.vercel.app`

---

## Deploy to Netlify (Alternative)

```bash
npm run build
# Then drag the /dist folder to netlify.com/drop
```

---

## Project Structure

```
romantic-date/
├── public/
│   └── heart.svg          # Favicon
├── src/
│   ├── App.jsx            # Main app (all screens)
│   ├── index.css          # Global CSS reset
│   └── main.jsx           # React entry point
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

Made with ❤️ — good luck on your date!
