const express = require('express');
const router = express.Router();
require('dotenv').config();
const userHandler = require('./src/users/routes/users');
const connectToDatabase = require('../user_service/src/db/userDbConnection');
const app = express();
const jsonParser = express.json();
const urlParser = express.urlencoded({ extended: false });

const PORT = process.env.PORT;
console.log(PORT);

app.use(jsonParser);
app.use(router);
app.use('/user', userHandler);

app.get('/', (req, res) => {
    res.status(200).send('Hi there , I can hear you :)')
})

function startServer() {
    return new Promise((resolve, reject) => {
        app.listen(PORT, (error) => {
            if (error) {
                console.log('failet to start the server...');
                reject("failed to start the server");
            }
            else {
                console.log(`server is running on PORT ${PORT}...`);
                resolve("server is running..")
            }
        })

    })
}

startServer().then(() => {
    connectToDatabase();
}).catch((error) => {
    console.log(error);
})

