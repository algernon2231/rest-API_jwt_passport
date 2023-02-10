import express from 'express'
import { authJWT, authLocal } from '../../services/auth.services.js';
import * as postController from './post.controller.js';

const postRoute = express.Router();

postRoute.post('/', authJWT, postController.createPost);
postRoute.get('/:id', authJWT, postController.getPostById);
postRoute.get('/', authJWT, postController.getPostsList);
postRoute.patch('/:id', authJWT, postController.updatePost);
postRoute.delete('/:id', authJWT, postController.delPost);
postRoute.get(`/:id/favorite`, authJWT, postController.favoritePost)


export default postRoute;