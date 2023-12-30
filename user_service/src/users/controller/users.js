// const redisClient = require("../../db/redis");




// dbServiceId is stored in token ,hence no need to fetch it from db or cache.
/* async function getUserDbServiceId(req,res){
    try {
        const {email} = req.body;
        let redisKey = email
        let userDbServiceId = await redisClient.get(redisKey);
        res.status(200).send(userDbServiceId);
        
        console.log(`sent userDbServiceId for user ${email}, id: ${JSON.stringify(userDbServiceId)}`);
    } catch (error) {
        console.log(error);
        res.status(500).send(`failed to get userDbSeviceId`)
    }
}

module.exports = getUserDbServiceId; */