const express = require('express');

const Router = express.Router();
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const fileHandler = require('./src/files/routes/files.route');
const serviceStatus = require('./src/util/serviceStatus.util');
const utilRouter = require('./src/util/routes/util.routes');
const connectToDatabase = require('./src/db/userDbConnection');
const User = require('./src/users/models/users');

const app = express();
const jsonParser = express.json();
const PORT = process.env.PORT;



app.use(jsonParser);
app.use(Router);
// Apply rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    trustProxy: true, // trust headers set by proxy
    message: 'Hold on champ !! too many requests from this IP, please try again later.',
  });
  
  app.use(limiter);
// total data in processing..
app.use(serviceStatus.sentry);

app.use('/service', utilRouter);
app.use('/file',fileHandler);
app.get('/', (req,res)=>{
    res.status(200).send('Hi there , I can hear you :)  - from db server 2')
})


function startServer(){
    return new Promise((resolve, reject)=>{
            app.listen(PORT,(error)=>{
                if(error){
                    console.log('failet to start the server...');
                    reject("failed to start the server");
                }
                else{
                    console.log(`server is running on PORT ${PORT}...`);
                    resolve("server is running..")
                }
            })
        
    })
}

startServer().then(()=>{
    connectToDatabase();
}).catch((error)=>{
    console.log(error);
})