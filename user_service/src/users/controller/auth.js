var bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const User = require('../models/users');
const createJwtToken = require('../../middlewares/jwt/createJwt');

// const redisClient = require('../../db/redis');

const userRegister = async (req, res) => {
    try {
        const {
            fullName,
            email,
        } = req.body;
        const password = bcrypt.hashSync(req.body.password, 8);
        // create user object
        const user = new User({
            fullName,
            email,
            password,
        });
        await user.save();
        res.status(200).send('Registration successful. ');
    } catch (error) {
        console.log('User registration failed.', error);
        if (error.code === 11000) {
            res.status(400).json({ error: 'Email already exists.' });
        } else {
            res.status(500).send(error.message)
        }
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid creadentials'
            })
        }
        let token = await createJwtToken(user);
        // console.log(`token: ${token}`);
        let returnObject = {
            user: {
                userId: user._id,
                email: user.email,
                fullName: user.fullName
            },
            message: 'Login Successful',
            accessToken: token
        }

        return res.status(200).send(returnObject);
    } catch (error) {
        console.log("login error", error);
        res.status(500).send(error);

    }
}
module.exports = {
    userRegister,
    userLogin
};
