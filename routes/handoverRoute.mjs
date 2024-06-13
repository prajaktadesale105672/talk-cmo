import express from 'express';
import handoverController from '../controllers/handoverController.mjs'
import authMiddleware  from "../middleware/authenticate.mjs"
const router = express.Router();

router.get('/', handoverController.get);
router.post('/add',  authMiddleware.authorizeRole('Admin'), handoverController.add );
router.put('/update/:id', handoverController.update);
router.get('/:role', handoverController.getByRole);
export default router;
