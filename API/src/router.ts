import {Router, json} from 'express';
import morgan from 'morgan';
import {userMiddleware} from './middleware/user/user';
import cookieParser from 'cookie-parser';
import {storageMiddleware} from './middleware/storage/storage';
import sessionRouter from './controllers/profile';
import redactorRouter from './controllers/redactor';
import selectionRouter from './controllers/selection';

const router = Router();
router.use(
  '/',
  morgan('combined'),
  cookieParser(),
  userMiddleware,
  storageMiddleware
);

router.use('/session', sessionRouter);
router.use('/redactor', redactorRouter);
router.use('/selection', selectionRouter);

router.use('/', json(), (req, res) => {
  res.end('OK');
});

export default router;
