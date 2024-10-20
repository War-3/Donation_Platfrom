const { check, validationResult } = require('express-validator');

// Validate Registrstion
const validateRegistration = [
  
    check('firstName')
      .notEmpty().withMessage('First Name is required'),
      check('lastName')
      .notEmpty().withMessage('Last Name is required'),
    
    check('email')
      .isEmail().withMessage('Invalid email format')
      .notEmpty().withMessage('Email is required'),
    
    check('password')
      .isLength({ min: 8 }).withMessage('Minimum of 8 characters required for password')
      .notEmpty().withMessage('Password is required'),
  
  
    (req, res, next) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      next();
    }
  ];
  
  module.exports = { validateRegistration }