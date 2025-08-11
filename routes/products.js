const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const productsController = require('../controllers/products.js');
const {isAuthenticated} = require ('../middleware/authenticate.js')

// Validation error Middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET all 
router.get('/', productsController.getAll);

// GET single 
router.get('/:id', productsController.getSingle);

// POST 
router.post(
  '/',
    isAuthenticated,
  [
    check('name').notEmpty().withMessage('Title is required'),
    check('description').notEmpty().withMessage('Description is required'),
    check('quantity').notEmpty().withMessage('Location is required'),
    check('location').notEmpty().withMessage('Location is required'),
    check('category').notEmpty().withMessage('Location is required'),
    check('price').notEmpty().withMessage('Location is required'),

  ],
  validate,
  productsController.createProduct
);

// PUT 
router.put(
  '/:id',
     isAuthenticated,
  [
    check('title').optional().notEmpty().withMessage('Title cannot be empty'),
    check('description').optional().notEmpty().withMessage('Description cannot be empty'),
    check('location').optional().notEmpty().withMessage('Location cannot be empty'),
    check('date').optional().isISO8601().withMessage('Date must be a valid ISO8601 date'),
    check('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
    check('ticketPrice').optional().isFloat({ min: 0 }).withMessage('Ticket price must be a positive number or zero'),
    check('organizer').optional().notEmpty().withMessage('Organizer cannot be empty')
  ],
  validate,
  productsController.updateProduct
);

// DELETE 
router.delete('/:id',
  isAuthenticated, 
  productsController.deleteProduct);

module.exports = router;
