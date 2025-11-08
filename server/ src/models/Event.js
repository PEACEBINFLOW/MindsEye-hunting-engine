// server/src/models/Event.js
// ---------------------------------------------------
// Event Model - stores time-labeled data for MindsEye
// ---------------------------------------------------

import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    type: { type: String, required: true, index: true },
    source: { type: String, required: true, index: true },
    value: { type: Number, default: null },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Useful indexes for time-based and tag queries
EventSchema.index({ timestamp: -1 });
EventSchema.index({ tags: 1 });

export const Event = mongoose.model('Event', EventSchema);
