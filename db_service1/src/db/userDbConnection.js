
require('dotenv').config();

const mongoose = require('mongoose');
const mongoURI = process.env.USER_MONGO_URI;
async function connectToDatabase(){
    try {
        await  mongoose.connect(mongoURI);
      } catch (error) {
        console.log(error);
        throw error;
      }
}

module.exports = connectToDatabase;

