const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

// For knowing about environment variables

// for knowing the directory of our environment variables
dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<PASSOWRD>', process.env.DATABASE_PASSWORD);

console.log(DB);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("App running on port", port);
});