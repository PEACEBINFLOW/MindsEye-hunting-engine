import React, { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import EventChart from './components/EventChart.jsx'
import { api } from './services/api.js'

export default function App() {
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [ev, st] = await Promise.all([
      api.getEvents(100),
      api.getStats('minute', 120)
    ])
    setEvents(ev)
    setStats(st)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="container">
      <Header onRefresh={load} />
      {loading ? <p>Loading...</p> : null}
      <section className="grid">
        <div className="card">
          <h2>Flow Activity (last 2h)</h2>
          <EventChart data={stats} />
        </div>
        <div className="card">
          <h2>Recent Events</h2>
          <ul className="events">
            {events.map(e => (
              <li key={e._id}>
                <span className="ts">{new Date(e.timestamp).toLocaleString()}</span>
                <span className="pill">{e.type}</span>
                <span className="src">{e.source}</span>
                {e.value != null ? <span className="val">v={e.value.toFixed(3)}</span> : null}
                {e.tags?.length ? <span className="tags">[{e.tags.join(', ')}]</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
