const express = require('express');
const router = express.Router();
const {getAllBooks, getBookById, createBook, updateBook, deleteBook} = require('../controllers/booksController');
const {bookValidaton}   = require('../validators/booksValidator');

router.get('/', getAllBooks);
router.get('/:id', getBookById);

router.post('/', bookValidaton, createBook);
router.put('/:id', bookValidaton, updateBook);
router.delete('/:id', deleteBook);


module.exports = router;