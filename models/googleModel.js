const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  }
 
}, {timestamps: true});

const Google = mongoose.model('Google', googleSchema);

module.exports = Google;
