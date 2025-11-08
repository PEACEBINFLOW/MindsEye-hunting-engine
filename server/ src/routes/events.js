// server/src/routes/events.js
// ---------------------------------------------------
// Event Routes - create, list, and analyze events
// ---------------------------------------------------

import { Router } from 'express';
import { Event } from '../models/Event.js';

const router = Router();

// POST /events — Create new event
router.post('/', async (req, res, next) => {
  try {
    const { timestamp, type, source, value, tags } = req.body;
    const evt = await Event.create({ timestamp, type, source, value, tags });
    res.status(201).json(evt);
  } catch (err) {
    next(err);
  }
});

// GET /events — Retrieve recent events
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
    const events = await Event.find().sort({ timestamp: -1 }).limit(limit);
    res.json(events);
  } catch (err) {
    next(err);
  }
});

// GET /events/stats — Time bucket aggregation
router.get('/stats', async (req, res, next) => {
  try {
    const minutes = Math.min(parseInt(req.query.minutes || '60', 10), 1440);
    const now = new Date();
    const since = new Date(now.getTime() - minutes * 60 * 1000);

    const bucket = (req.query.bucket || 'minute').toLowerCase();
    const dateExpr =
      bucket === 'day'
        ? { $dateTrunc: { date: '$timestamp', unit: 'day' } }
        : bucket === 'hour'
        ? { $dateTrunc: { date: '$timestamp', unit: 'hour' } }
        : { $dateTrunc: { date: '$timestamp', unit: 'minute' } };

    const agg = await Event.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: dateExpr,
          count: { $count: {} },
          avgValue: { $avg: '$value' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(agg.map(a => ({
      bucket: a._id,
      count: a.count,
      avgValue: a.avgValue
    })));
  } catch (err) {
    next(err);
  }
});

export default router;
