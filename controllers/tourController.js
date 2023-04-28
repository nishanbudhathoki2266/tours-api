const Tour = require('./../Models/tourModel');



// 2 -> Route handlers 
// Tours 

exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryObj = { ...this.queryStr };
        // Excluding these fields as all the fields come into the query params while using
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // Advanced filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        this.query.find(JSON.parse(queryString))

        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }
        else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    limitFields() {
        // Field limiting 
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagniate() {
        // Pagination
        const page = +this.queryStr.page || 1;
        const limit = +this.queryStr.limit || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

}

exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagniate();

        const tours = await features.query;

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


// Aggregation pipeline 
exports.getTourStats = async (req, res, next) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: {
                    avgPrice: 1
                }
            }
        ])

        res.status(200).json({
            stauts: 'success',
            data: {
                stats
            }
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

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = +req.params.year;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' } // Adds a tour name in the array to display for a month
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            // {
            //     $limit: 3 // To get the top 3 busiest month
            // }
        ])

        res.status(200).json({
            stauts: 'success',
            data: {
                plan
            }
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