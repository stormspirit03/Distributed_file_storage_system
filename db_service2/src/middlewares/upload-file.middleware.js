const multer = require('multer');
const path = require('path');

// const generateFileMetadata = require('./fileMetadata');
// const destination = path.resolve(__dirname, '..//..//z_database');
const destination = '/D:/dev/capstone/db_service2/z_database/';

let uploadedFilename ;





const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    uploadedFilename = `${uniqueSuffix}-${file.originalname}`;
    cb(null, uploadedFilename);
  }
});

const upload = multer({ storage: storage });

function uploadFile(req, res, next) {
  try { 
        
        upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).send('Multer error.');
        } else if (err) {
          return res.status(500).send(err);
        }
        next();
      });
  } catch (error) {
    res.status(500).send('failed to upload the file.');
  }
  }
  

module.exports = uploadFile;




  const handleFileUpload = async (req, res, next) => {
    try {
      const filePath = req.file.path;
  
      const fileData = await fs.readFile(filePath, 'utf-8');
      await writeFileAsync(req.file.address, fileData);
  
      const metadata = { /* your metadata object */ };
      await storeMetadata(req.file.address, metadata);
  
      await fs.unlink(filePath);
  
      res.status(200).send('File uploaded, metadata stored, and file deleted successfully.');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
  module.exports = uploadFile;




