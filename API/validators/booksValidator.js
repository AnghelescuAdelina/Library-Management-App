const {body } = require('express-validator');

const bookValidaton = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ min:1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('author')
        .notEmpty()
        .withMessage('Author is required')
        .trim()
        .isLength({ min:1, max: 100 })
        .withMessage('Author must be between 1 and 100 characters'),
    body('publishedYear')
        .notEmpty()
        .withMessage('Published year is required')
        .isNumeric()
        .withMessage('Published year must be a number')
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage('Published year must be a valid year'),
    body('genre')
        .notEmpty()
        .withMessage('Genre is required')
        .trim()
        .isLength({ min:1, max: 50 })
        .withMessage('Genre must be between 1 and 50 characters'),
    body('quantity')
        .notEmpty()
        .isNumeric()
        .withMessage('Quantity is required and must be a number')
        .isInt({ min: 0 })
        .withMessage('Quantity can not be negative')
];

module.exports = {
    bookValidaton
};
