const express = require('express');
const router = express.Router();
const {isAuthenticated} = require ('../middleware/authenticate.js');
const reviewsController = require ('../controllers/reviews');


router.post('/', isAuthenticated, reviewsController.createReview);
router.get('/', isAuthenticated, reviewsController.getAll);
router.get('/:id', isAuthenticated, reviewsController.getSingle);
router.put('/:id', isAuthenticated, reviewsController.updateReview);
router.delete('/:id', isAuthenticated, reviewsController.deleteReview);

module.exports = router;
