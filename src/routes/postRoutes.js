import express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createPost)
  .get(getPosts);

router.route('/:slug')
  .put(protect, updatePost)
  .delete(protect, deletePost)
  .get(getPost);

export default router;