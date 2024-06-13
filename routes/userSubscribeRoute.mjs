import express from 'express';
import  subscribe  from '../controllers/userSubscribeController.mjs'

const router = express.Router();

// router.get('/role-list', RoleController.getRoles );
router.post('/add', subscribe.add );
router.get('/by-date', subscribe.getSubscribersByDate);
router.put('/edit/:id/', subscribe.update );
router.put('/unsubscribe', subscribe.unsubscribeUser );
router.get('/get',  subscribe.getAll );
router.get('/:id', subscribe.getById );

export default router;