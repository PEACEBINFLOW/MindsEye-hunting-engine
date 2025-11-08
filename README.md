# MindsEye - MVP (Server + Client)

A minimal, deployable MVP for MindsEye: a cognitive dashboard that visualizes time-labeled events (BinFlow-style) over time.

## What you get
- server/: Node + Express + MongoDB (Atlas-ready). Endpoints to ingest and query events.
- client/: Vite + React dashboard with a live chart and simple event feed.
- .env.example: copy to .env files for quick config.
- One-branch friendly: simple, manageable structure.

## Quick Start (Local)

1) Server
    cd server
    cp .env.example .env           # add your MONGODB_URI
    npm install
    npm run dev                    # http://localhost:4000

2) Client
    cd ../client
    cp .env.example .env           # set VITE_API_BASE (defaults to http://localhost:4000)
    npm install
    npm run dev                    # http://localhost:5173

## Deploy Notes

- MongoDB Atlas: Use your connection string as MONGODB_URI in server/.env.
- Replit: Run server as the main repl, set secrets (MONGODB_URI). For the client, deploy separately or use Vercel/Netlify.
- Vercel/Netlify (client): set VITE_API_BASE to your server URL.
- Railway/Fly/Render (server): set PORT env; the server respects PORT.

## API Endpoints (Server)

- GET /health -> { status: "ok" }
- POST /events -> create an event.
  Body example:
    {
      "timestamp": "2025-11-08T10:00:00Z",
      "type": "signal",
      "source": "mindseye",
      "value": 0.72,
      "tags": ["demo","alpha"]
    }
- GET /events?limit=100 -> latest events.
- GET /events/stats?bucket=minute&minutes=60 -> aggregated counts/avg by time bucket.

Event Schema (MongoDB)

{
  timestamp: Date,
  type: String,        // e.g., "signal", "note", "anomaly"
  source: String,      // e.g., "mindseye", "binflow", "sensor"
  value: Number,       // optional numeric value
  tags: [String]       // labels for filtering (BinFlow lanes etc.)
}

## Folder Structure

mindseye/
  README.md
  .gitignore
  .env.example
  server/
    package.json
    .env.example
    src/
      index.js
      config/
        env.js
        db.js
      models/
        Event.js
      routes/
        health.js
        events.js
      middleware/
        errorHandler.js
      utils/
        binflowSchema.js
    scripts/
      seed.js
  client/
    package.json
    .env.example
    index.html
    vite.config.js
    src/
      main.jsx
      App.jsx
      styles.css
      components/
        Header.jsx
        EventChart.jsx
      services/
        api.js

## Roadmap Hints
- Add auth/JWT when you are ready.
- Create "Hunting Engine" views: anomaly heatmap, tag timelines.
- Add /events/search?tag=...&type=...
- Add WebSocket/SSE for live streaming.
