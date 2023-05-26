const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'History',
    },
  ],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
