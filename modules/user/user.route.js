import express from 'express'
import { authLocal } from '../../services/auth.services.js';
import * as userController from './user.controller.js';

const userRoute = express.Router();

userRoute.post('/signup', userController.signUp);
userRoute.post('/login', authLocal, userController.login);

export default userRoute;