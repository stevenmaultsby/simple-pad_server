import express, {Router} from 'express';
import createOrUpdate from './createOrUpdate';
import getRoot from './getRoot';
const router = Router();

router.get('/', getRoot);

router.post(
  '/',
  express.json({
    limit: '1024kb',
  }),
  createOrUpdate
);

export default router;
