const axios = require('axios');
require('dotenv').config();

async function savefilemetadata(metadata) {
  try {
    const meta_service_uri = `${process.env.META_SERVICE_URI}/file/save-metadata`;
    const response = await axios.post(meta_service_uri, metadata, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY_META_SERVICE
      }
    });
    console.log(response.data);
  } catch (error) {
    throw error.message ? error.message : error;
  }
}

module.exports = {
  savefilemetadata
};
