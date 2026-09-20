# Deployment Guide

## Frontend

Platform: Vercel

Framework: Vite

Root Directory: `./`

Build Command: `npm run build`

Output Directory: `dist`

## Backend

Platform: Render

Start Command:

```text
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

Environment Variables:

* `GOOGLE_API_KEY`
* `TAVILY_API_KEY`
* `SUPABASE_URL`
* `SUPABASE_KEY`

## Database

Supabase PostgreSQL is used for persistent application data.

The database stores information related to research jobs, planner tasks, sources, evidence, validations, reports, and other project data.

## Live Services

* Frontend: Vercel
* Backend: Render
* Database: Supabase
* AI Model: Gemini
* Search Engine: Tavily
