import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';

// @desc    Create new post
const createPost = asyncHandler(async (req, res) => {
  const { title, slug, content , status } = req.body;

  if(!(title && slug && content )){
    res.status(400).json({
      message : "Please add all the required fields"
    })
  }

  const file = req.files?.featuredImage[0].path;

  if(!file){
    res.status(400).json({
      message : "Please add the featuredImage"
    });
  }

  const featuredImage = await uploadOnCloudinary(file).catch((error) => {
    res.status(500).json({
      message : "Server error, failed to upload the file on cloudinary"
    })
    throw new Error(`An error occured during the upload of the on the cloudnary`)
  });
  
  const post = await Post.create({
    title,
    slug,
    content,
    featuredImage : featuredImage?.url,
    status,
    userId: req.user._id
  });

  res.status(201).json(post);
});

// @desc    Update post
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    return res.status(404);
    throw new Error('Post not found');
  }

  if(req.files?.featuredImage){
    const publicId = post?.featuredImage.split('/').pop().split('.')[0];

    const response = await deleteFromCloudinary(publicId);

    if(!response){
      return res.status(500).json({
        message : "Error updating the file"
      });
    }

    const featuredImage = await uploadOnCloudinary(req.files?.featuredImage[0].path);
  
    const updatedPost = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      {...req.body , featuredImage : featuredImage.url},
      { new: true }
    );
  
    return res.json(updatedPost);
  } else {
    const updatedPost = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      {...req.body},
      { new: true }
    );
    
    return res.json(updatedPost);
  }
});

// @desc    Delete post
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOneAndDelete({ slug: req.params.slug });
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const publicId = post?.featuredImage.split('/').pop().split('.')[0];
  const response = await deleteFromCloudinary(publicId);

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