require('dotenv').config();
function selectDbServiceRandomly() {
    // Generate a random number between 0 (inclusive) and 1 (exclusive)
    const randomValue = Math.random();
    let response = {
        dbServiceAddress : process.env.URL_TENANT_DB_SERVICE1,
        serviceNumber: 1
    }
    // Use a threshold (e.g., 0.5) to determine if it should be 1 or 2
    let number =  randomValue < 0.5 ? 1 : 2;
    if(number === 2 && process.env.URL_TENANT_DB_SERVICE2) {  // not to send undefined.
        response.dbServiceAddress = process.env.URL_TENANT_DB_SERVICE2;
        response.serviceNumber = 2;
    }
    return response;
  }

  module.exports = selectDbServiceRandomly;