const axios = require('axios');
require('dotenv').config();
const crypto = require('crypto');

let db_service1_url = process.env.DB_SERVICE1_URL;
let db_service2_url = process.env.DB_SERVICE2_URL;
let response1;
let response2;

async function loadBalancer(req, res) {
  let time = Date.now();
  try {
    if (req.headers['x-api-key'] === process.env.API_KEY_META_SERVICE) {
      // check 1st db service
      try {
        let config = {
          headers: {
            'x-api-key': process.env.API_KEY_DB_SERVICE1
          }
        };
        response1 = await axios.get(`${db_service1_url}/service/status`, config);
      } catch (error) {
        console.error('Error in 1st db service request:', error.message, 'Status code:', error.response?.status);
        throw error;
      }

      // check 2nd db service
      try {
        let config = {
          headers: {
            'x-api-key': process.env.API_KEY_DB_SERVICE2
          }
        };
        response2 = await axios.get(`${db_service2_url}/service/status`, config);
      } catch (error) {
        console.error('Error in 2nd db service request:', error.message, 'Status code:', error.response?.status);
        throw error;
      }

      if (response1 || response2) {
        console.log('response1:', response1.data, 'response2:', response2.data);
        const bestService = chooseBestService(response1.data, response2.data);
        console.log('time for status request...', Date.now() - time);
        res.status(200).send(bestService);
      }
    } else {
      res.status(401).send('meta-api-key is invalid or not provided');
    }
  } catch (error) {
    console.error('Error in loadBalancer:', error.message, 'Status code:', error.response?.status);
    const randomValue = crypto.randomInt(2); // Generates a random integer between 0 and 1
    res.status(500).send(randomValue === 0 ? db_service1_url : db_service2_url);
  }
}

function chooseBestService(response1, response2) {
  try {
    // Check if both responses are not free
    if (!response1.free && !response2.free) {
      // Choose the one with lower totalPayload
      return response1.totalPayload < response2.totalPayload ? db_service1_url : db_service2_url;
    }

    // Check if response1 is free
    if (response1.free && !response2.free) {
      return db_service1_url;
    }

    // Check if response2 is free
    if (!response1.free && response2.free) {
      console.log('inside  !1, 2');
      return db_service2_url;
    }

    const randomValue = crypto.randomInt(2); // Generates a random integer between 0 and 1
    return randomValue === 0 ? db_service1_url : db_service2_url;
  } catch (error) {
    throw error;
  }
}

module.exports = loadBalancer;
