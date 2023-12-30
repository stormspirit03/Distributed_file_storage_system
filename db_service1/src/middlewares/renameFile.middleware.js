const fs = require('fs/promises');
const Path = require('path');
const metaService = require('../files/controllers/file.controller');
require('dotenv').config();

// This function renames the file and validate the inpputs.
async function renameFile(req, res, next) {
  try {
    if (req.file) {
      const sharedAccessIds = parseArrayField(req.body.sharedAccessIds); // to receive valid sharedIds field.
      const { originalname } = req.file;
      req.file.filename = originalname;

      if (!req.body.prefix) {
        throw createError('FILE_PREFIX_MISSING', 'File prefix is missing.');
      } else if (!req.body.access || !['public', 'private', 'shared'].includes(req.body.access)) {
        throw createError('INVALID_ACCESS', 'Invalid or missing access parameter in the request body.');
      } else if (req.body.access === 'shared' && (!sharedAccessIds || !Array.isArray(sharedAccessIds))) {
        throw createError('SHARED_ACCESS_IDS_MISSING', 'sharedAccessIds must be provided as an array of userids.');
      } else if (!req.body.version || !['current', 'other'].includes(req.body.version)) {
        throw createError('INVALID_VERSION', 'Invalid or missing version parameter in the request body.');
      }
      req.file["type"] = Path.extname(originalname);
      req.file["prefix"] = req.body.prefix;
      req.file["access"] = req.body.access;
      req.file["sharedAccessIds"] = sharedAccessIds;
      req.file["userId"] = req.user.id;
      req.file["version"] = req.body.version;
      req.file["service"] = process.env.PORT;

      next();
    }
    else {
      res.status(400).send('Please select the file to upload.')
    }
  } catch (error) {
    handleErrors(error, res);
    await metaService.unlinkFile(req.file.path);
  }
}

function createError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function handleErrors(error, res) {
  const errorMessages = {
    FILE_PREFIX_MISSING: `File 'prefix' is missing. 'prefix' is path of the directory, where your file will be stored'`,
    INVALID_ACCESS: `Invalid or missing 'access' parameter in the request body. 'access' can only be 'public', 'private' or 'shared'`,
    SHARED_ACCESS_IDS_MISSING: `'sharedAccessIds' must be provided as an array of strings when access is shared.`,
    INVALID_ARRAY_FORMAT: `Invalid array format. 'sharedAccessIds' must be a valid JSON array of userIds or an empty string.`,
    INVALID_VERSION: `Invalid or missing file 'version' parameter in the request body. 'version' can only be 'current' or 'other'.`
  };
  if (error.code in errorMessages) {
    console.error(`${error.code}: ${error.message}`);
    res.status(400).json({ error: errorMessages[error.code] });
  } else {
    console.error('Error renaming file:', error);
    res.status(500).send('Failed to rename the file. Kindly contact the support team at support@airtribe.live');
  }
}

function parseArrayField(input) {
  try {
    // Attempt to parse the string as JSON
    const parsedArray = JSON.parse(input);

    // Check if the parsed result is an array
    if (Array.isArray(parsedArray)) {
      return parsedArray;
    } else if (input.trim() === '') {
      // If the input is an empty string, return an empty array
      return [];
    } else {
      throw createError('INVALID_ARRAY_FORMAT', 'Invalid array format. Must be a valid JSON array or an empty string.');
    }
  } catch (error) {
    throw createError('INVALID_ARRAY_FORMAT', 'Error parsing array field: ' + error.message);
  }
}

module.exports = renameFile;