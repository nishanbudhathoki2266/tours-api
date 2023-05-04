const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(reviewController.getAllReviews).post(reviewController.createReview);
router.route('/:id').get(reviewController.getReview).patch(authController.protect, reviewController.updateReview).delete(reviewController.deleteReview)

module.exports = router;