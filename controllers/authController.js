const jwt = require('jsonwebtoken');
const User = require('./../Models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    // Only taking the things that are just required to sign up the user. things like roles and all are neglected as anyone can be an admin while signing up
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password exist 
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }

    // check if user exists and pw is correct
    // Again selecting in the user result as it was unselected before in the schema
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})