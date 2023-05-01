const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1-> Middlewares
// Helmet
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === "development") {
  // Only use the logging of morgan if the environment is development
  app.use(morgan("dev"));
}

// Limit request for the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
})

// Implemented for all the routes starting from '/api'
app.use('/api', limiter);

// Body Parser, reading data from the body into req.body
// limit limits the size of the body 
app.use(express.json({ limit: '10kb' }));

// Data sanitization agains NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Avoid parameter pollution - should be used at last because it clears query string
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

// middlewares for serving static files
app.use(express.static(`${__dirname}/public`));

// Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
