const Review = require('./../Models/reviewModel');
// const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllReviews = catchAsync(async (req, res, next) => {

    // const features = new APIFeatures(Review.find(), req.query).filter().limitFields().pagniate().sort();
    // const reviews = await features.query;
    // For getting all the reviews of a specific tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews,
        }
    })
})

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) return (next(new AppError("Can't find review associated with that ID!", 404)))

    // Send response 
    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
})

exports.createReview = catchAsync(async (req, res, next) => {

    // Allowing nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    // Response
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })


})

exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!review) return new AppError("No review found associated with that ID!", 404)

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
})

exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) return next(new AppError("No review found associated with that id!", 404));

    res.status(204).json({
        status: 'success',
        data: null
    })
})