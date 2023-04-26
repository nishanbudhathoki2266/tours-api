
const fs = require('fs');
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// 2 -> Route handlers 
// Tours 
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
}

exports.getTour = (req, res) => {
    const tour = tours.find((tour) => tour.id === +req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            tour,
        },
    })
}

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = { ...req.body, id: newId };
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                stauts: "success",
                data: {
                    tour: newTour,
                },
            });
        }
    );

}

exports.updateTour = (req, res) => {
    res.status(200).json({
        stauts: 'success',
        data: {
            tour: '<Updated tour here>'
        }
    })
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        stauts: 'success',
        data: null
    })
}
