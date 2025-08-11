const express = require('express');
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews');


const isAuthenticated = (req, res, next) => {
  if (req.user && req.user._id) return next();
  return res.status(401).json({ message: "Unauthorized" });
};


router.post('/', isAuthenticated, createReview);
router.get('/', isAuthenticated, getAllReviews);
router.get('/:id', isAuthenticated, getSingleReview);
router.put('/:id', isAuthenticated, updateReview);
router.delete('/:id', isAuthenticated, deleteReview);

module.exports = router;
