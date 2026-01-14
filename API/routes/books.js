const express = require('express');
const router = express.Router();
const {getAllBooks, getBookById, createBook, updateBook, deleteBook} = require('../controllers/booksController');
const {bookValidaton}   = require('../validators/booksValidator');
const { validateToken } = require('../middleware/auth');
//Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

//Protected routes
router.post('/', validateToken, bookValidaton, createBook);
router.put('/:id', validateToken, bookValidaton, updateBook);
router.delete('/:id', validateToken, deleteBook);


module.exports = router;