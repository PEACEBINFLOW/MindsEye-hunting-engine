// client/src/services/api.js
// ---------------------------------------------------
// API service layer for MindsEye Dashboard
// Handles requests to the backend (Express server)
// ---------------------------------------------------

// Base URL — uses env var if provided, otherwise defaults to localhost:4000
const BASE = import.meta.env.VITE_API_BASE?.trim() || 'http://localhost:4000';

// simple JSON fetch helper
async function json(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

// main API methods exposed to the React components
export const api = {
  // GET /events — fetch latest events (default 100)
  async getEvents(limit = 100) {
    return json(`${BASE}/events?limit=${limit}`);
  },

  // GET /events/stats — fetch time-bucketed event stats
  async getStats(bucket = 'minute', minutes = 60) {
    return json(`${BASE}/events/stats?bucket=${bucket}&minutes=${minutes}`);
  },

  // POST /events — create new event (optional helper)
  async createEvent(payload) {
    const res = await fetch(`${BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  },
};
