const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    })
    return newObj;
}

// users
exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
})

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) return (next(new AppError("You might not be logged in!", 404)))

    // Send response 
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.updateMe = catchAsync(async (req, res, next) => {
    // Create error if use posts password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError("This route is not for password updates. Please use /updateMyPassword", 400))
    }

    // Update the user documents
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) return (next(new AppError("Can't find user associated with that ID!", 404)))

    // Send response 
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.createUser = catchAsync(async (req, res) => {
    const newUser = await User.create(req.body);

    // Response
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
})

exports.updateUser = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) return new AppError("No user found associated with that ID!", 404)

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})


exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return next(new AppError("No user found associated with that id!", 404));

    res.status(204).json({
        status: 'success',
        data: null
    })
})