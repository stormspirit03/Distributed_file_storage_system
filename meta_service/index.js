const express = require('express');

const Router = express.Router();
require('dotenv').config();
const fileHandler =  require('./src/files/routes/file.route');
const connectToDatabase = require('./src/db/userDbConnection');
const loadBalancer = require('./src/loadBalancer/routes/loadBalancer.route');
const app = express();
const jsonParser = express.json();
const urlParser = express.urlencoded({extended:false});


const PORT = process.env.PORT;


app.use(jsonParser);
app.use(Router);
app.use('/file',fileHandler);
app.use('/loadbalancer',loadBalancer);

app.get('/', (req,res)=>{
    res.status(200).send('Hi there , I can hear you :)  - from db server 1')
})



function startServer(){
    return new Promise((resolve, reject)=>{
        app.listen(PORT,(error)=>{
            if(error){
                console.log('failet to start the server...');
                reject('failed to start the server...')
            }
            else{
                console.log(`server is running on PORT ${PORT}...`);
                resolve(`server is running on PORT ${PORT}...`);
            }
        })
    })
}


startServer().then(()=>{
    connectToDatabase();
}).catch((error)=>{
    console.log(error);
})

