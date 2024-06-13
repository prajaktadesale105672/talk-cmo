import express from 'express';
import RoleController from '../controllers/RoleController.mjs';

const router = express.Router();

router.get('/list', RoleController.getRoles );
router.post('/add', RoleController.addRole );
router.put('/edit/:id', RoleController.editRole);
router.get('/get_role/:roleId',RoleController.roleInfo)

export default router;
