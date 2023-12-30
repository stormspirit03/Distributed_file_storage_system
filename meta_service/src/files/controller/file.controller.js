// fileController.js
require('dotenv').config();
const mongoose = require('mongoose');
const FileMetadata = require('../models/file'); // Replace with your actual model

async function saveFileMetadata(req, res) {
  try {
    console.log(`inside save metadata of meta-serive...`)
    if (req.headers['x-api-key'] === process.env.API_KEY_META_SERVICE) {
      let sharedAccessIds;
      if (req.body.access === 'shared') {
        console.log('req.body.sharedAccessIds:', req.body.sharedAccessIds)
        sharedAccessIds = req.body.sharedAccessIds
      }
      else {
        sharedAccessIds = [];
      };
      const {
        filename,
        prefix,
        userId,
        path,
        type,
        size,
        access,
        url,
        hash,
        version,
        versionId,
        service,
      } = req.body;

      // Create a new instance of the model with the provided data
      const newFileMetadata = new FileMetadata({
        filename,
        prefix,
        userId,
        path,
        type,
        size,
        access,
        sharedAccessIds,
        url,
        hash,
        version,
        versionId,
        service,
      });
      // Save the metadata to the database

      await newFileMetadata.save();
      console.log('File metadata saved successfully.');
      // set the version of file to current.
      await setCurrentVersion(versionId);
      console.log('Upddated File version...');
      res.status(201).json({ message: 'File metadata saved successfully.' });
    } else {
      res.status(401).send('meta-api-key is not provided or invalid');
    }
  } catch (error) {
    console.error('Error saving file metadata:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function checkFileAccess(req, res) {
  try {
    let access = false;
    const userId = req.user.id;
    const hash = req.params.hash;
    const versionId = req.params.versionId;
    const file = await FileMetadata.findOne({ hash, versionId });
    // console.log({userId, hash})
    // console.log('file',file);
    if (file && file.access[0]) {
      if (file.userId === userId || file.access[0] === 'public') access = true
      else if (file.access[0] === 'private' && file.userId === userId) access = true// file userid and reqsting user id same then grant access.
      else if (file.access[0] === 'shared' && file.sharedAccessIds.includes(userId)) access = true
      res.status(200).send(access);
    }
    else {
      console.log(access);
      res.status(200).send(access);
    }

  } catch (error) {
    console.log('Failed to check file access.', error);
    res.status(500).send('Failed to check the file access.');
  }
}


async function getAllFileVersions(req, res) {
  const hash = req.params.hash;

  try {
    // Call the function to get all file versions
    const versions = await getAllFileVersionsByHash(hash);

    res.status(200).json(versions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function fileToSetCurrent(req, res) {
  const versionId = req.params.versionId;

  try {
    // Call the function to set the current version
    const result = await setCurrentVersion(versionId);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message || 'File not found' });
  }
}

async function getUserFiles(req, res) {
  try {
    let time = Date.now();
    const userId = req.user.id
    const prefixes = await FileMetadata.distinct('prefix', { userId });

    const folderStructure = {};

    for (const prefix of prefixes) {
      const files = await FileMetadata.find({ userId, prefix });
      folderStructure[prefix] = files.map(file => ({
        filename: file.filename,
        prefix: file.prefix,
        userId: file.userId,
        path: file.path,
        type: file.type,
        size: file.size,
        access: file.access,
        version: file.version,
        url: file.url,
      }));
    }
    time = Date.now() - time;
    console.log('time required..', time);
    res.json(folderStructure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getUserFilesByType(req, res) {
  try {
    const userId = req.user.id;
    const prefixes = await FileMetadata.distinct('prefix', { userId });

    const fileStructure = {};

    for (const prefix of prefixes) {
      const files = await FileMetadata.find({ userId, prefix });

      for (const file of files) {
        const fileType = file.type || 'Other'; // Use 'Other' if type is undefined
        if (!fileStructure[fileType]) {
          fileStructure[fileType] = [];
        }

        fileStructure[fileType].push({
          filename: file.filename,
          prefix: file.prefix,
          userId: file.userId,
          path: file.path,
          type: fileType,
          size_in_mb: file.size_in_mb,
          access: file.access,
          version: file.version,
          url: file.url,
        });
      }
    }

    res.json(fileStructure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getStorageUsageByUser(req, res) {
  try {
    const userId = req.user.id;
    const prefixes = await FileMetadata.distinct('prefix', { userId });

    const storageUsage = {};
    // for total usage across all the folders.
    let totalUsage = 0;
    // for each folder i.e prefix 
    if (prefixes) {
      for (const prefix of prefixes) {
        const files = await FileMetadata.find({ userId, prefix });
        // console.log(files);
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        totalUsage += totalUsage + totalSize;
        storageUsage[prefix] = {
          size: totalSize.toFixed(2),
          filesCount: files.length,
        };
      }
    }
    storageUsage['Total Usage'] = totalUsage;
    res.json(storageUsage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
// -------------------- helper functions ----------
async function setCurrentVersion(versionId) {
  try {
    // Find the file by versionId and update its version to 'current'
    const res1 = await FileMetadata.findOneAndUpdate(
      { versionId },
      { $set: { version: 'current' } },
      { new: true }
    );

    if (!res1) {
      // No file found with the specified versionId
      res.status(400).send('File not found for the given versionId.');
    }

    // Find all other files with the same hash and make them 'other' (excluding the given versionId)
    const res2 = await FileMetadata.updateMany(
      { hash: res1.hash, version: 'current', versionId: { $ne: versionId } },
      { $set: { version: 'other' } }
    );

    return { message: 'Version set successfully for hash ', res1 };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to get all file versions based on hash
async function getAllFileVersionsByHash(hash) {
  try {
    // Find all files with the given hash and select versionId and version fields
    const versionIds = await FileMetadata.find({ hash }).select('hash versionId version ');
    return versionIds;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


module.exports = {
  saveFileMetadata,
  checkFileAccess,
  getUserFiles,
  getUserFilesByType,
  getStorageUsageByUser,
  getAllFileVersions,
  fileToSetCurrent
};


