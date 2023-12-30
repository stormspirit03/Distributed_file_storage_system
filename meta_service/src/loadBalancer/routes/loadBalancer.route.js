
const Router = require("express").Router();
const verifyJwt = require("../../middlewares/jwt");
const loadBalancer = require("../controllers/loadBalancer.controller");


Router.get('/service-url', loadBalancer);

module.exports = Router;