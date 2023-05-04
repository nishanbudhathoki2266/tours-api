const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../Models/tourModel');

// For knowing about environment variables
// for knowing the directory of our environment variables
dotenv.config({ path: `${__dirname}/../../config.env` })


// Making a db connection string by replacing password template with the real
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD.replace('@', '%40'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(DB, {
      autoIndex: true
    })
    console.log("Database Connection Successful!");

    const importData = async () => {
      try {
        await Tour.create(tours);
        console.log("Data successfully loaded");
      }
      catch (err) {
        console.log(err);
      }
    }

    importData()

    const deleteData = async () => {
      try {
        await Tour.deleteMany();
        console.log("Data successfully deleted");
      }
      catch (err) {
        console.log(err);
      }
    }
    // deleteData()

    // if (process.argv[2] === '--import') {
    //   importData();
    //   // Aggressive way of exiting the application
    //   process.exit();
    // }
    // if (process.argv[2] === '--delete') {
    //   deleteData();
    //   process.exit();
    // }


  }

  catch (error) {
    console.log("Something went wrong while connecting to the database!", err);
  }
}


connectDb()






