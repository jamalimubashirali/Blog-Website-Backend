import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js'
import postRoutes from './src/routes/postRoutes.js'
import { errorHandler } from './src/middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  );
}).catch((error) => console.log(error));