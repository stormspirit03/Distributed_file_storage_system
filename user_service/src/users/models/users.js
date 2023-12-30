
const mongoose = require('mongoose');


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
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

userSchema.options.toJSON = {
  transform: function (doc, ret) {
    delete ret.password;
  },
};
//                          modelname, schema, collectionName(optional)
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
