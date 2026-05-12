# AdSwirll — Redesigned Website

## ▶️ HOW TO RUN

1. Open this folder in VS Code  
2. Open terminal (Ctrl + `)
3. Make sure you are IN this folder (you should see package.json here)
4. Run:

```
npm install
npm start
```

5. Browser opens at http://localhost:3000 ✅

## ⚠️ COMMON MISTAKE
Do NOT run `npm run dev` — this project uses Create React App, not Vite.  
The correct command is **`npm start`**

## 🎨 Design
- Light cream theme (#F7F9FC)
- Colors matched to logo: Blue #0069A5 + Teal #007896
- Fonts: Outfit (body) + Playfair Display (headings)
- 5 pages: Home, Services, About, Portfolio, Contact

## 📁 Structure
```
AdSwirll/
├── public/
│   ├── index.html
│   └── logo.jpeg
├── src/
│   ├── App.js          ← Design system + routes
│   ├── Navbar.js
│   ├── Footer.js
│   ├── HomePage.js
│   ├── ServicesPage.js
│   ├── AboutPage.js
│   ├── PortfolioPage.js
│   └── ContactPage.js
└── package.json
```
