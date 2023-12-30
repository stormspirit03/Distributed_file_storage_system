require('dotenv').config();
const {createClient} = require('redis');


    const redisClient = createClient({
            legacyMode: true,
            PORT:  process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
        });

    redisClient.connect();
   

module.exports = redisClient;

   


