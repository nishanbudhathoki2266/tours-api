const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// Param middleware -> middleware that runs only when a param is present 

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;