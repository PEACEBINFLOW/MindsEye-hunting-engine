// server/scripts/seed.js
// ---------------------------------------------------
// Seeds the MindsEye database with demo events.
// Run with:  npm run seed
// ---------------------------------------------------

import 'dotenv/config';
import { connectDB } from '../src/config/db.js';
import { Event } from '../src/models/Event.js';

async function run() {
  await connectDB();

  const now = Date.now();
  // Create 120 events (1 per minute, last 2 hours)
  const docs = Array.from({ length: 120 }).map((_, i) => {
    const timestamp = new Date(now - (120 - i) * 60 * 1000);
    const type = i % 10 === 0 ? 'anomaly' : 'signal';
    const value = Math.random();
    const tags = ['demo', value > 0.8 ? 'spike' : value < 0.2 ? 'flat' : 'normal'];
    return {
      timestamp,
      type,
      source: 'seed',
      value,
      tags
    };
  });

  try {
    await Event.deleteMany({ source: 'seed' });
    await Event.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} demo events`);
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    process.exit(0);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
