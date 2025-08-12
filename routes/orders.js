const express = require('express');
const { body, param } = require('express-validator');
const ordersController = require("../controllers/orders.js");
const { isAuthenticated } = require('../middleware/authenticate.js');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.productId')
    .isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const updateOrderValidation = [
  param('id')
    .isMongoId().withMessage('Invalid order ID'),
  body('status')
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
];

const idValidation = [
  param('id')
    .isMongoId().withMessage('Invalid order ID')
];

// Routes
router.get('/', ordersController.getAll);

router.get('/:id', idValidation, ordersController.getSingle);

router.post(
  '/',
  isAuthenticated,
  createOrderValidation,
  ordersController.createOrder
);

router.put(
  '/:id',
  isAuthenticated,
  updateOrderValidation,
  ordersController.updateOrder
);

router.delete(
  '/:id',
  isAuthenticated,
  idValidation,
  ordersController.deleteOrder
);

module.exports = router;
