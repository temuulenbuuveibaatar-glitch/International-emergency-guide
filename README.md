# International Emergency Guide

A comprehensive multilingual emergency response platform providing critical medical and safety information.

## Features

- **Emergency Protocols**: Detailed step-by-step emergency response procedures
- **Hospital Finder**: Locate nearby hospitals with interactive maps
- **Emergency Contacts**: Country-specific emergency numbers
- **Medical Resources**: Treatment guidelines and medication database
- **AI Analysis**: Damage assessment and medical imaging analysis
- **Offline Support**: Access critical information without internet
- **7 Languages**: Korean, German, Mongolian, Chinese, Japanese, Spanish, Russian

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)

## Environment Variables

Set these in your deployment platform:

```
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start development server: `npm run dev`

## Deployment

### GitHub Actions (Automatic)

Push to main branch to trigger automatic deployment via GitHub Actions.

### Manual Deployment

1. Build: `npm run build`
2. Start: `npm start`

## Technologies

- React + TypeScript
- Express.js backend
- Drizzle ORM
- PostgreSQL
- Tailwind CSS
- Vite build tool

## License

MIT License