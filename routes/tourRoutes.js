const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// Param middleware -> middleware that runs only when a param is present 

router.param('id', (req, res, next, val) => {
    console.log(val);
    next();
})


router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;