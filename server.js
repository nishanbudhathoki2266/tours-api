// For knowing about environment variables
const dotenv = require('dotenv');


// for knowing the directory of our environment variables
dotenv.config({ path: './config.env' })

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("App running on port", port);
});