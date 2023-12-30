const Jwt = require('jsonwebtoken');


async function createJwtToken(user){
   try {
    let token = Jwt.sign({
        name: user.fullName,
        email:user.email,
        id: user.id,
        dbServiceNumber: user.dbServiceNumber,
        role:user.role,
    }, process.env.API_SECRET, {
        expiresIn: 999999
    });
    return token
   } catch (error) {
    console.log(error);
    throw('failed to create JWT token...')
   }
}


module.exports = createJwtToken;