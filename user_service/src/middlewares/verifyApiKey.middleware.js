require(dotenv).config();

// process.env.API_KEY_USER_SERIVCE,process.env.API_KEY_DB_SERVICE1, 
//     process.env.API_KEY_DB_SERVICE2,
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  // Check if the API key is valid
  if (validApiKeys.includes(apiKey=== process.env.API_KEY_USER_SERIVCE)) {
    next(); // API key is valid, continue to the next middleware or route handler
  } else {
    res.status(401).json({ error: 'Unauthorized' }); // Invalid API key
  }
};

module.exports = apiKeyMiddleware;
