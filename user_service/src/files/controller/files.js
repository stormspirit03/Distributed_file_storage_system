const axios = require ('axios');
require('dotenv').config();





async function createTenantDatabaseFolder(tenantId, dbServiceAddress){
    try {
        const apiUrl = dbServiceAddress;
        const data = { tenantId };
        let response = await axios.post(apiUrl, data);
        console.log(response.data);
    } catch (error) {
        console.log(error);
        throw(`failed to create DB for user ${tenantId} `);
    }
}


module.exports = createTenantDatabaseFolder;