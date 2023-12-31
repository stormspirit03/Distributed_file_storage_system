const express = require('express');
const router = express.Router();
const fileController = require('../controller/file.controller.js');
const verifyJwt = require('../../middlewares/jwt.js');
const checkFileAccess = require('../../middlewares/checkFileAccess.middleware.js');

// Define routes for file-related operations
router.post('/save-metadata', fileController.saveFileMetadata); // secured with x-api-key
router.get('/check-access/:hash/:versionId', verifyJwt, fileController.checkFileAccess);
router.get('/all', verifyJwt, fileController.getUserFiles);
router.get('/by-type', verifyJwt, fileController.getUserFilesByType);
router.get('/storage-usage', verifyJwt, fileController.getStorageUsageByUser);
router.get('/all-versions/:hash', verifyJwt, checkFileAccess, fileController.getAllFileVersions);
router.put('/set-current/:hash/:versionId', verifyJwt, checkFileAccess, fileController.fileToSetCurrent);

module.exports = router;
