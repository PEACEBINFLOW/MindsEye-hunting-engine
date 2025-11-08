import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function EventChart({ data }) {
  const rows = data.map(d => ({
    time: new Date(d.bucket).toLocaleTimeString(),
    count: d.count,
    avgValue: d.avgValue ?? 0
  }))

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="count" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="avgValue" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
