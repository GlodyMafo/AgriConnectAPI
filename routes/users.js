const express = require('express');
const { body, param } = require('express-validator');
const usersController = require('../controllers/users.js');
// const {protect} = require ('../middleware/authenticate.js')

const router = express.Router();

// Validation rules
const userValidationRules = [
  body('firstName').isString().notEmpty().withMessage('First name is required'),
  body('lastName').isString().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required')
];

const idValidationRule = [
  param('id').isMongoId().withMessage('Invalid user ID')
];

// Routes
router.get('/', usersController.getAll);
router.get('/:id', idValidationRule, usersController.getSingle);
router.post('/', 
    // isAuthenticated , 
    userValidationRules, usersController.createUser);
router.put('/:id',
    // isAuthenticated,
     [...idValidationRule, ...userValidationRules], usersController.updateUser);
router.delete('/:id',
    // isAuthenticated,
     idValidationRule, usersController.deleteUser);

module.exports = router;
