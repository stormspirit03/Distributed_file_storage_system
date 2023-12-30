const multer = require('multer');
const generateFileMetadata = require('./fileMetadata');
const destination = '../../z_database';



const storage = multer.diskStorage({
  destination: destination,
  filename: function (req, file, cb) {
    // Extract metadata from the request
    const { originalname } = file;
    const { type } = req.body;

    // Get user ID from token (replace getUserIdFromToken with your actual function)
    const userId = getUserIdFromToken(req.token);

    // Create a dynamic filename based on metadata
    const dynamicFilename = `${userId}_${type}_${originalname}`;

    cb(null, dynamicFilename);
  },
});
const upload = multer({ storage: storage });


function uploadFile(req, res, next) {
  // Use the configured multer instance for file upload
  upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).send('Multer error.');
    } else if (err) {
      return res.status(500).send('An unknown error occurred.');
    }

    // Continue to the next middleware or route handler
    next();
  });
}

module.exports = uploadFile;




