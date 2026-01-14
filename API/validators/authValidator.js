const { body } = require('express-validator')

const authValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail()
        .custom((value) => {
            if (!value.endsWith('@gmail.com')){
                throw new Error('Register only with google accounts');
            }
            return true
        }),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password should have a minimum of 8 chars')
        .trim()
]

module.exports = { authValidation }