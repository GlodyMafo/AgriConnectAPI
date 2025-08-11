const mongodb = require('../config/database.js');
const Product = require('../models/products.js');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().collection('products').find();
    const products = await result.toArray();
    res.setHeader('content-type', 'application/json');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};


const getSingle = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection('products').find({ _id: productId });
    const products = await result.toArray();
    if (!products[0]) {
      return res.status(404).json({ message: 'product not found' });
    }
    res.setHeader('content-type', 'application/json');
    res.status(200).json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};



const createProduct = async (req, res) => {
  try {

    const farmer = req.user._id;

    const farmerId = new ObjectId(farmer);


    const product = new Product(
      req.body.name,
      req.body.description,
      req.body.quantity,
      req.body.price,
      req.body.category,
      req.body.location,
      req.body.availableFrom,
      farmerId
    );

    const response = await mongodb.getDatabase().collection('products').insertOne(product);

    if (response.acknowledged) {
      res.status(201).json({ message: 'product created successfully', productId: response.insertedId });
    } else {
      res.status(500).json({ message: `Can't create the product, some error occurred` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);

    const product = new Product(
      req.body.name,
      req.body.description,
      req.body.quantity,
      req.body.price,
      req.body.category,
      req.body.location,
      req.body.availableFrom,
      // req.user._id 
    );

    const response = await mongodb.getDatabase().collection('products').replaceOne({ _id: productId }, product);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'product not found or no changes applied' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection('products').deleteOne({ _id: productId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createProduct,
  updateProduct,
  deleteProduct
};
