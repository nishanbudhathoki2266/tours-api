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

exports.getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        msg: 'This route is not yet defined!'
    })
}

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        msg: 'This route is not yet defined!'
    })
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        msg: 'This route is not yet defined!'
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        msg: 'This route is not yet defined!'
    })
}