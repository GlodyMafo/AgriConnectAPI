const mongodb = require('../config/database.js');
const { getSingle } = require('./orders.js');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
  try {
    const query = {};
    if (req.query.productId) {
      query.productId = new ObjectId(req.query.productId);
    }

    const reviews = await mongodb.getDatabase()
      .collection('reviews')
      .find(query)
      .toArray();

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};




const getSingle = async (req, res) => {
  try {
    const reviewId = new ObjectId(req.params.id);
    const review = await mongodb.getDatabase()
      .collection('reviews')
      .findOne({ _id: reviewId });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch review", error: error.message });
  }
};



const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!productId || !rating) {
      return res.status(400).json({ message: "productId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be between 1 and 5" });
    }

    const review = {
      productId: new ObjectId(productId),
      userId: new ObjectId(userId),
      rating: Number(rating),
      comment: comment || '',
      createdAt: new Date()
    };

    const response = await mongodb.getDatabase()
      .collection('reviews')
      .insertOne(review);

    res.status(201).json({ message: "Review created", reviewId: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Failed to create review", error: error.message });
  }
};



const updateReview = async (req, res) => {
  try {
    const reviewId = new ObjectId(req.params.id);
    const { rating, comment } = req.body;

    const updateData = {};
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "rating must be between 1 and 5" });
      }
      updateData.rating = Number(rating);
    }
    if (comment !== undefined) {
      updateData.comment = comment;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const response = await mongodb.getDatabase()
      .collection('reviews')
      .updateOne({ _id: reviewId }, { $set: updateData });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review", error: error.message });
  }
};


const deleteReview = async (req, res) => {
  try {
    const reviewId = new ObjectId(req.params.id);

    const response = await mongodb.getDatabase()
      .collection('reviews')
      .deleteOne({ _id: reviewId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error: error.message });
  }
};

module.exports = {
  createReview,
  getAll,
  getSingle,
  updateReview,
  deleteReview
};
