import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  
  res.cookie('jwt' , token , {
    httpOnly : true,
    sameSite : 'strict',
    maxAge : 24 * 60 * 60 * 1000,
  })

  res.status(201).json({
    name : user.name,
    email : user.email,
  });
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.cookie('jwt' , token , {
      httpOnly : true,
      sameSite : 'strict',
      maxAge : 24 * 60 * 60 * 1000
    })
    res.json({
      user : {
        name : user.name,
        email : user.email,
        id : user._id
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

const logout = asyncHandler( async (req , res) => {
    res.cookie('jwt' , '' , {
      httpOnly : true,
      expires : new Date(0)
    })

    res.status(200).json(
      {
        messsage : "Successfully Logged Out"
      }
    );
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export { register, login, getMe , logout };