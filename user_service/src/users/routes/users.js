const router = require('express').Router();
const verifyJwt = require('../../middlewares/jwt/verifyJwt');
const authController = require('../controller/auth');



router.post('/register',authController.userRegister);
router.post('/login',authController.userLogin);




module.exports= router;
