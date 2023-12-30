const FileMetadata = require("../models/files.model");
const fs = require('fs/promises');
const Path = require('path');
const metaService = require('../../meta_service/meta_service.controller');
const createHash = require("../../util/createHash.util");
const { checkFileAccess } = require("../../meta_service/checkFileAccess");


async function saveFileMetadata(req, res) {
  try {
    const userId = req.user.id;
    let { sharedAccessIds } = req.file;
    const { filename, type, path, uploadDate, access, size, prefix, service, version, } = req.file;
    if (access != 'shared') sharedAccessIds = [];
    const hash = await createHash(prefix, userId, filename);
    const fileMetadata = {
      filename,
      prefix,
      userId,
      path,
      type,
      size,
      service,
      access,
      sharedAccessIds,
      hash,
      uploadDate,
      version,
      versionId: Date.now(),
      url: `http://localhost:${service}/file/download/:${encodeURI(path)}/:${hash}`
    }

    await metaService.savefilemetadata(fileMetadata);
    fileMetadata['encoded-path'] = encodeURIComponent(path);
    res.status(201).send(fileMetadata);
  } catch (error) {
    console.log(error);
    await unlinkFile(req.file.path); // unlink from updated path.
    res.status(500).send('failed to upload and save the file metadata')
  }
}

async function downloadFile(req, res) {
  try {
    const token = req.headers.authorization;
    const filehash = req.params.filehash;
    const filePath = req.params.filepath;
    const fileVersionId = req.params.versionId
    // check file access.
    const userAccess = await checkFileAccess(filehash, fileVersionId, token);
    console.log("userAccess", userAccess);
    if (userAccess) {
      // Check if the file exists
      try {
        await fs.access(filePath)
        // Use res.download() to initiate the file download
        res.download(filePath);
      } catch (error) {
        throw error
      }
    }
    else {
      res.status(403).send('Either you have entered invalid file parameters or you do not have the access to the file you are looking for. ');
    }
  } catch (error) {
    if (error.code === 'MISSING_BOTH_PARAMETERS') {
      res.status(400).send('Both filehash and versionId are required.');
    } else if (error.code === 'MISSING_FILEHASH') {
      res.status(400).send('filehash is required.');
    } else if (error.code === 'MISSING_VERSION_ID') {
      res.status(400).send('versionId is required.');
    } else if (error.code === 'ENOENT') {
      res.status(400).send('No such file or directory exists. Check if the "filepath" parameter is encoded.');
    } else {
      console.error('Unexpected error:', error);
      res.status(500).send('Failed to download the file.');
    }
  }
}
async function unlinkFile(path) {
  try {
    // Use fs.unlink from fs/promises for a promise-based API
    await fs.unlink(path);
    console.log('File unlinked successfully');
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err; // Rethrow the error to handle it in the calling function
  }
}

module.exports = {
  saveFileMetadata,
  unlinkFile,
  downloadFile
};