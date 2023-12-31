const FileMetadata = require("../files/models/file");


/**
 * Checks if a user has access to a file based on the file's access settings and the user's ID.
 * 
 * @param {Object} req - The HTTP request object containing the user ID and the file hash.
 * @param {Object} res - The HTTP response object used to send status codes and messages.
 * @param {Function} next - The function to call if the user has access to the file.
 * @returns {void}
 */
const checkFileAccess = async (req, res, next) => {
  try {
    let access = false;
    const userId = req.user.id;
    const hash = req.params.hash;
    const file = await FileMetadata.findOne({ hash });

    if (file && file.access[0]) {
      if (file.userId === userId || file.access[0] === 'public') {
        access = true;
      } else if (file.access[0] === 'private' && file.userId === userId) {
        access = true; // File user ID and requesting user ID are the same, grant access.
      } else if (file.access[0] === 'shared' && file.sharedAccessIds.includes(userId)) {
        access = true;
      }
      if (access) {
        next(); // Continue to the next middleware or route handler
      } else {
        res.status(403).send('Access denied.');
      }
    } else {
      console.log('inside else ', file);
      res.status(404).send('file not found');
    }
  } catch (error) {
    console.error('Failed to check file access.', error);
    res.status(500).send('Failed to check the file access.');
  }
};

module.exports = checkFileAccess;
