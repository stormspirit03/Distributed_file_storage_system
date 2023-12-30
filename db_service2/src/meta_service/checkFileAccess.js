const axios = require('axios');
require('dotenv').config();

async function checkFileAccess(filehash, versionId, token) {
    try {
        console.log('filehash: ', filehash, ' versionId: ', versionId);
        if (filehash === (undefined || ':filehash') && versionId === (undefined || ':versionId')) {
            const error = new Error('Both filehash and versionId are not provided.');
            error.code = 'MISSING_BOTH_PARAMETERS';
            throw error;
        } else if (filehash === (undefined || ':filehash')) {
            const error = new Error('filehash is not provided.');
            error.code = 'MISSING_FILEHASH';
            throw error;
        } else if (versionId === (undefined || ':versionId')) {
            const error = new Error('versionId is not provided.');
            error.code = 'MISSING_VERSION_ID';
            throw error;
        }
        const url = `${process.env.META_SERVICE_URI}/file/check-access/${filehash}/${versionId}`;
        const headers = {
            Authorization: token
        }
        const access = await axios.get(url, { headers });
        return access.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { checkFileAccess };