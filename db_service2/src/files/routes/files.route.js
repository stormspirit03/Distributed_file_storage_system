// const express = ('express');
const Router = require('express').Router();


const renameFile = require('../../middlewares/renameFile.middleware');
const uploadFile = require('../../middlewares/upload-file.middleware');
const metaService = require('../controllers/file.controller');
const verifyJwt = require('../../middlewares/verifyJwt');

Router.post('/upload',verifyJwt,uploadFile,renameFile, metaService.saveFileMetadata);//, 
Router.get(`/download/:filepath?/:filehash?/:versionId?`,verifyJwt,metaService.downloadFile)


module.exports = Router;