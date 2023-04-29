const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");

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