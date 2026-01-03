const express = require('express');
const router = express.Router();
const {getAllBooks, getBookById, createBook, updateBook, deleteBook} = require('../controllers/booksController');
const {bookValidaton}   = require('../validators/booksValidator');

//Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

//Protected routes
router.post('/', bookValidaton, createBook);
router.put('/:id', bookValidaton, updateBook);
router.delete('/:id', deleteBook);


module.exports = router;