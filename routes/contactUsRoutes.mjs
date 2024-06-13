import express from 'express';
import contactUs  from '../controllers/contactUsController.mjs'

const router = express.Router();

// router.get('/role-list', RoleController.getRoles );
router.post('/add', contactUs.add );
router.put('/edit/:id/', contactUs.update );
router.get('/get',  contactUs.getContactList );
router.get('/:id', contactUs.getById );
 
export default router;