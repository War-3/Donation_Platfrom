const { check, validationResult } = require('express-validator');


// Validate Login
const validateLogin = [
  
    check('email')
      .isEmail().withMessage('Invalid email format')
      .notEmpty().withMessage('Email is required'),
    
    check('password')
      .isLength({ min: 8 }).withMessage('Minimum of eight characters required for password')
      .notEmpty().withMessage('Password is required'),
  
  
      (req, res, next) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        next();
      }
  ]
  
  module.exports = { validateLogin }