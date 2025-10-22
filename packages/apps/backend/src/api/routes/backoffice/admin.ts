import { Router } from 'express';

import { requireRole } from '../../middlewares/auth.js';

const backofficeAdminRouter = Router();

// All backoffice admin routes require the admin role
backofficeAdminRouter.use(requireRole('admin'));

backofficeAdminRouter.get('/hello', (req, res) => {
  res.send('Hello from admin backoffice route');
});

export { backofficeAdminRouter };
