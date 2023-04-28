const Tour = require('./../Models/tourModel');



// 2 -> Route handlers 
// Tours 
exports.getAllTours = async (req, res) => {
    try {

        const queryObj = { ...req.query };
        // Excluding these fields as all the fields come into the query params while using
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        // The find method is a query method that returns the document while awaiting.. so we are collectively awaiting all the queries below
        let query = Tour.find(JSON.parse(queryStr))

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        }
        else {
            query = query.sort('-createdAt')
        }

        // Field limiting 
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        }
        else {
            query = query.select('-__v');
        }

        // Pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip > numTours) throw new Error('This page does not exist!')
        }

        const tours = await query;

        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours,
            },
        });
    }
    catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)

        res.status(200).json({
            status: "success",
            data: {
                tour,
            },
        })
    }
    catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
}

exports.createTour = async (req, res) => {

    try {
        const newTour = await Tour.create(req.body)

        res.status(201).json({
            stauts: "success",
            data: {
                tour: newTour
            }
        }
        );
    }
    catch (err) {
        res.status(201).json({
            stauts: "success",
            message: err
        })
    }
}

exports.updateTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.status(200).json({
            stauts: 'success',
            data: {
                tour
            }
        })
    }
    catch (err) {

        res.status(404).json({
            stauts: "fail",
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            stauts: 'success',
            data: null
        })
    }
    catch (err) {
        res.status(404).json(
            {
                stauts: 'fail',
                message: err
            }
        )
    }
}
