// server/src/routes/health.js
// ---------------------------------------------------
// Health Check Route
// ---------------------------------------------------

import { Router } from 'express';
const router = Router();

router.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'mindseye-server' });
});

export default router;
