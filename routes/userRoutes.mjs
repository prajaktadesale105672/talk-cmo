// routes/userRoutes.js

import express from 'express';

const router = express.Router();
import UserController from '../controllers/UserController.mjs';
import verifyUser from '../middleware/verifyUser.mjs';
// const UserController = require('../controllers/UserController');
// import MainController from '../controllers/MainController';

// // User registration route
// router.post('/register', UserController.register);

// // User login route
// router.post('/login', UserController.login);

// Get all users route
router.get('/get', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.get('/filter', UserController.userFilter);
router.get('/filter1', UserController.userFilter1);
router.post('/login', UserController.userLogin);
router.post('/logout', UserController.userLogout);
router.post('/addUser',verifyUser, UserController.userAdd);
router.post('/register', UserController.createUser);
router.post('/forget-password', UserController.forgetPassword);
router.put('/reset-password', UserController.resetPassword);
router.put('/edit/:id', UserController.updateUser);



export default router;
