const Jwt = require('jsonwebtoken');
const User = require('../users/models/users');

require('dotenv').config();
async function verifyJwt(req, res, next) {
    let time = Date.now(); // currently taking 25 
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1] // remove Bearer keyword from auth token
            Jwt.verify(token, process.env.API_SECRET, async (err, decodedValue) => {
                try {
                    if (!err) {
                        const user = await User.findOne({ _id: decodedValue.id });
                        if (user) { // [{}]
                            const sanitizedUser = {
                                id: user.id,
                                fullName: user.fullName,
                                email: user.email,
                                role: user.role,
                                created: user.created,
                                updated: user.updated,
                                // Add other fields as needed, excluding the 'password'
                            };
                            req.user = sanitizedUser;
                        }
                        time = Date.now() - time;
                        console.log('jwt verify time', time);
                        next();
                    } else {
                        console.log(err);
                        req.user = undefined;
                        res.status(500).send(err);

                    }


                } catch (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
            });
        } else {
            req.user = undefined;
            res.message = 'Authorization header not found';
            res.status(500).send(res.message);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

module.exports = verifyJwt;