import { Router } from 'express';

import { auth, requireRole } from '../../middlewares/auth.js';
import { backofficeAdminRouter } from './admin.js';

const backofficeRouter = Router();

// All backoffice routes require authentication and the backoffice role
backofficeRouter.use(auth(), requireRole('backoffice'));

backofficeRouter.use('/admin', backofficeAdminRouter);

backofficeAdminRouter.get('/hello', (req, res) => {
  res.send('Hello from backoffice route');
});

export { backofficeRouter };
