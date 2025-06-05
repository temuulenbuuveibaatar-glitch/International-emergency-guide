# International Emergency Guide

A comprehensive multilingual emergency response platform providing critical medical and safety information for global users.

## Features

- **Emergency Protocols**: Detailed step-by-step emergency response procedures
- **Hospital Finder**: Locate nearby hospitals with interactive maps
- **Emergency Contacts**: Country-specific emergency numbers
- **Medical Resources**: Treatment guidelines and medication database  
- **AI Analysis**: Damage assessment and medical imaging analysis
- **Offline Support**: Access critical information without internet
- **Multilingual**: Support for 7 languages

## Deploy from GitHub

This project supports multiple deployment platforms from GitHub:

### Deploy to Vercel (Full-Stack - Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)
*Supports backend API and database*

### Deploy to Netlify (Full-Stack)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)
*Supports backend API and database*

### GitHub Pages (Frontend Only)
For static deployment without backend features:
1. Enable GitHub Pages in repository settings
2. Select "GitHub Actions" as source
3. Push to main branch to trigger deployment
*Note: AI features and database will not work on GitHub Pages*

## Required Environment Variables

Set these in your deployment platform:

```bash
DATABASE_URL=your_postgresql_database_url
OPENAI_API_KEY=your_openai_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Getting Started

1. **Fork/Clone this repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your API keys and database URL
4. **Start development server**
   ```bash
   npm run dev
   ```

## Deployment Options

### Automatic Deployment (GitHub Actions)
- Push to `main` branch triggers automatic deployment
- Configure secrets in GitHub repository settings:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID` 
  - `VERCEL_PROJECT_ID`
  - `DATABASE_URL`
  - `OPENAI_API_KEY`
  - `VITE_GOOGLE_MAPS_API_KEY`

### Manual Deployment
```bash
npm run build
npm start
```

## Project Structure

```
├── client/           # React frontend
├── server/           # Express.js backend
├── shared/           # Shared types and schemas
├── public/           # Static assets
├── .github/          # GitHub Actions workflows
├── vercel.json       # Vercel deployment config
└── netlify.toml      # Netlify deployment config
```

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Build**: Vite
- **Deployment**: Vercel, Netlify, GitHub Actions

## License

MIT License