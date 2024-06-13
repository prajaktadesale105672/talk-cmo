
import express from 'express';
const router = express.Router();
import userRoutes from './userRoutes.mjs'
import postRoutes from  './postRoutes.mjs'
import categoryRoutes from  './categoryRoutes.mjs'
import roleRoutes from "./roleRoutes.mjs"
import permissionRoutes from "./permissionRoute.mjs"
import handoverRoute from "./handoverRoute.mjs"
import contactUs from './contactUsRoutes.mjs'
import usersubscribe from './userSubscribeRoute.mjs';
import authorRoute from "./authorRoutes.mjs"
import dashboardRoute from "./dashboardRoute.mjs"
import advertisementRoute from "./advertisementRoute.mjs"
import urlRedirectRoute from "./urlRedirectRoute.mjs"

router.use('/users', userRoutes);
router.use('/post', postRoutes);
router.use('/category', categoryRoutes);
router.use('/roles',  roleRoutes);
router.use('/role-permissions', permissionRoutes);
router.use('/handover', handoverRoute );
router.use('/author', authorRoute );
router.use('/contact', contactUs );
router.use('/subscribe', usersubscribe);
router.use('/dashboard', dashboardRoute );
router.use('/advertisement', advertisementRoute );
router.use('/url_redirect', urlRedirectRoute );



export default router;
