const Tour = require('./../Models/tourModel');



// 2 -> Route handlers 
// Tours 
exports.getAllTours = async (req, res) => {
    try {

        const queryObj = { ...req.query };
        // Excluding these fields as all the fields come into the query params while using
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // The find method is a query method that returns the document while awaiting.. so we are collectively awaiting all the queries below
        const query = Tour.find(queryObj)

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
