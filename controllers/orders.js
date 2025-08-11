const mongodb = require('../config/database.js');
// const Order = require('../models/orders.js');
const ObjectId = require('mongodb').ObjectId;



const createOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    const buyerId = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }


    // Products
    const productIds = items.map(i => new ObjectId(i.productId));
    const products = await mongodb.getDatabase()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    if (products.length !== items.length) {
      return res.status(400).json({ message: "One or more products not found" });
    }


    // Price
    let totalPrice = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      if (item.quantity > product.quantity) {
        throw new Error(`Not enough stock for product ${product.name}`);
      }
      const total = product.price * item.quantity;
      totalPrice += total;
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total
      };
    });

    const order = {
      buyerId: new ObjectId(buyerId),
      status: "pending",
      totalPrice,
      createdAt: new Date(),
      items: orderItems
    };

    const response = await mongodb.getDatabase()
      .collection('orders')
      .insertOne(order);

    res.status(201).json({ message: 'Order created', orderId: response.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const getAll = async (req, res) => {
  try {
    const orders = await mongodb.getDatabase()
      .collection('orders')
      .find()
      .toArray();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getSingle = async (req, res) => {
  try {
    const orderId = new ObjectId(req.params.id);
    const order = await mongodb.getDatabase()
      .collection('orders')
      .findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const updateOrder = async (req, res) => {
  try {
    const orderId = new ObjectId(req.params.id);
    const updateData = {};

    if (req.body.status) {
      const allowedStatus = ["pending", "paid", "shipped", "delivered", "cancelled"];
      if (!allowedStatus.includes(req.body.status.toLowerCase())) {
        return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatus.join(", ")}` });
      }
      updateData.status = req.body.status.toLowerCase();
    }

    const response = await mongodb.getDatabase()
      .collection('orders')
      .updateOne({ _id: orderId }, { $set: updateData });

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const deleteOrder = async (req, res) => {
  try {
    const orderId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase()
      .collection('orders')
      .deleteOne({ _id: orderId });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getAll,
  getSingle,
  updateOrder,
  deleteOrder
};
