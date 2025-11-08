// server/src/index.js
// ---------------------------------------------------
// MindsEye Server Entry Point
// Node.js + Express + MongoDB (Atlas-ready)
// ---------------------------------------------------

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import healthRouter from './routes/health.js';
import eventsRouter from './routes/events.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// ---------------------------------------------------
// App initialization
// ---------------------------------------------------
const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ---------------------------------------------------
// Routes
// ---------------------------------------------------
app.use('/health', healthRouter);
app.use('/events', eventsRouter);

// ---------------------------------------------------
// Error Handling
// ---------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------
// Start Server
// ---------------------------------------------------
const PORT = process.env.PORT || 4000;

// Connect to MongoDB, then start listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 MindsEye server running on port ${PORT}`);
  });
});
