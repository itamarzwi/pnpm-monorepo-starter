import { Router } from 'express';

import { auth } from '../middlewares/auth.js';
import { backofficeRouter } from './backoffice/index.js';

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

apiRouter.use('/backoffice', backofficeRouter);

apiRouter.get('/me', auth(), (req, res) => {
  res.json(req.user);
});

export { apiRouter };
