import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
} from "../controllers/postConroller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    upload.fields([
      {
        name: "featuredImage",
        maxCount: 1,
      },
    ]),
    createPost
  )
  .get(getPosts);

router
  .route("/:slug")
  .patch(
    protect,
    upload.fields([
      {
        name: "featuredImage",
        maxCount: 1,
      },
    ]),
    updatePost
  )
  .delete(protect, deletePost)
  .get(getPost);

export default router;
