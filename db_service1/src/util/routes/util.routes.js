require('dotenv').config();
const Router = require("express").Router();

const serviceStatus = require("../serviceStatus.util");

Router.get('/status', (req, res) => {
  try {
    if (req.headers['x-api-key'] === process.env.API_KEY_DB_SERVICE2) {
      res.status(200).send(serviceStatus.stats);
    } else {
      res.status(401).send('x-api-key is invalid or not provided.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to get service stats.');
  }
});

module.exports = Router;
