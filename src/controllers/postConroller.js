import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';

// @desc    Create new post
const createPost = asyncHandler(async (req, res) => {
  const { title, slug, content, featuredImage, status } = req.body;
  
  const post = await Post.create({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId: req.user._id
  });

  res.status(201).json(post);
});

// @desc    Update post
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedPost = await Post.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true }
  );

  res.json(updatedPost);
});

// @desc    Delete post
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await post.remove();
  res.json({ message: 'Post removed' });
});

// @desc    Get single post
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  res.json(post);
});

// @desc    Get all posts
const getPosts = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const posts = await Post.find(query);
  res.json(posts);
});

export { createPost, updatePost, deletePost, getPost, getPosts };