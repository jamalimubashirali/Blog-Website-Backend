import express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts
} from '../controllers/postConroller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createPost)
  .get(getPosts);

router.route('/:slug')
  .put(protect, updatePost)
  .delete(protect, deletePost)
  .get(getPost);

export default router;