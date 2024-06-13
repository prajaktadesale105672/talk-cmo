import express from 'express';
import permissionController from '../controllers/permissionController.mjs'

const router = express.Router();

// router.get('/role-list', RoleController.getRoles );
router.post('/add', permissionController.addpermission );
router.put('/edit/:id/:module_name', permissionController.editpermission );
router.get('/check_permissions', permissionController.getPermissions );
router.get('/:id', permissionController.rolewisePermission );
router.put('/udpate',permissionController.updateRolePerm)


export default router;