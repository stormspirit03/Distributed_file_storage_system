
const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.USER_MONGO_URI;
const connection = mongoose.createConnection(mongoUri);

/** consists:
 * fullName,
 * email,
 * password,
 * preferences,
 * created,
 * updated
 * */
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    unique: [true, 'Account with this email already exists, try login.'],
    lowercase: true,
    trim: true,
    required: [true, 'Email is required.'],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email address.'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Add more roles as needed
    default: 'user'
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  dbServiceNumber: {
    type: Number,
    required: [true, "DB service number can not be empty or undefined."]
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});


//modelname, schema, collectionName(optional)
const User = connection.model('User', userSchema, 'users');

module.exports = User;
