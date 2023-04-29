const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down!");
  //   Code 1 stands for uncaught exception
  process.exit(1);
});

// For knowing about environment variables
// for knowing the directory of our environment variables
dotenv.config({ path: "./config.env" });

// First you need to read environment files and then only run app
const app = require("./app");

// Making a db connection string by replacing password template with the real
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD.replace("@", "%40")
);

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(DB, {
      autoIndex: true,
    });
    console.log("Database Connection Successful!");
  } catch (error) {
    console.log("Something went wrong while connecting to the database!", err);
  }
};

connectDb();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("App running on port", port);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down!");
  server.close(() => {
    //   Code 1 stands for uncaught exception
    process.exit(1);
  });
});
