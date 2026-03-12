import express, {Router} from 'express';
import create from './create';
const router = Router();

router.post(
  '/',
  express.json({
    limit: '100kb',
  }),
  create
);

export default router;
