import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type : String,
    required : true
  },
  status: {
    type: String,
    enum: ['draft', 'active'],
    default: 'draft'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export default mongoose.model('Post', postSchema);