const router = require('express').Router();
const verifyJwt = require('../../middlewares/jwt/verifyJwt');
const authController = require('../controller/auth');
// const getUserDbServiceId = require('../controller/users');





router.post('/register',authController.userRegister);
router.post('/login',authController.userLogin);
// router.post('/user-db-service-id',verifyJwt, getUserDbServiceId);  // now token holds dbServiceId




module.exports= router;
