/* eslint-disable no-console */
import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();
console.log('router created');

router.post('/users', userController.createUser);
console.log('create user function created');
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);

export default router;
