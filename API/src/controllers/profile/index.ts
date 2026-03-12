import {Router} from 'express';
import {ProfileModel} from '../../orm/Profile';

const router = Router();
router.get('/', async (req, res) => {
  res.json({
    status: 200,
    data: {
      id: req.userId,
    },
  });
});
export default router;
