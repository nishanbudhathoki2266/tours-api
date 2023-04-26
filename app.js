const fs = require("fs");
const express = require("express");
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1-> Middlewares 
if (process.env.NODE_ENV === 'development') { // Only use the logging of morgan if the environment is development
  app.use(morgan('dev'));
}

app.use(express.json());

// middlewares for serving static files
app.use(express.static(`${__dirname}/public`));

// Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
