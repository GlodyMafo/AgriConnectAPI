const mongodb = require('../config/database.js');
const ObjectId = require('mongodb').ObjectId;



const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('orders').find();
    const orders = await result.toArray();
    res.setHeader('content-type', 'application/json');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};



const getSingle = async (req, res) => {
  try {
    const orderId= new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('orders').find({ _id: orderId});
    const orders = await result.toArray();
    if (!orders[0]) {
      return res.status(404).json({ message: 'order not found' });
    }
    res.setHeader('content-type', 'application/json');
    res.status(200).json(orders[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};



const createOrder = async (req, res) => {
  try {
     const order = {
      name: req.body.name,
      description: req.body.description,
      quantity: parseInt(req.body.quantity),
      price: parseFloat(req.body.price),
      category: req.body.category,
      location:req.body.location,
      availableFrom: new Date(req.body.availableFrom),
      farmerId: req.body.id, 
      createdAt: new Date()
    };

    const response = await mongodb.getDatabase().db().collection('orders').insertOne(order);

    if (response.acknowledged) {
      res.status(201).json({ message: 'order created successfully', orderId: response.insertedId });
    } else {
      res.status(500).json({ message: `Can't create the order, some error occurred` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};



const updateOrder = async (req, res) => {
  try {
    const orderId= new ObjectId(req.params.id);

    const order = {
       name: req.body.name,
      description: req.body.description,
      quantity: parseInt(req.body.quantity),
      price: parseFloat(req.body.price),
      category: req.body.category,
      location:req.body.location,
      availableFrom: new Date(req.body.availableFrom),
      farmerId: req.body.id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response = await mongodb.getDatabase().db().collection('orders').replaceOne({ _id: orderId}, order);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'order not found or no changes applied' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};



const deleteOrder = async (req, res) => {
  try {
    const orderId= new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('orders').deleteOne({ _id: orderId});

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createOrder,
  updateOrder,
  deleteOrder
};
