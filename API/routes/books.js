const express = require('express');
const router = express.Router();
const {getAllBooks, getBookById, createBook, updateBook, deleteBook, borrowBook, returnBook, getUserHistory} = require('../controllers/booksController');
const {bookValidaton}   = require('../validators/booksValidator');
const { validateToken, isAdmin } = require('../middleware/auth');
//Public routes
router.get('/', getAllBooks);
router.get('/history', validateToken, getUserHistory);

router.get('/:id', getBookById);

//Protected routes
router.post('/', validateToken, isAdmin, bookValidaton, createBook);
router.put('/:id', validateToken, isAdmin, bookValidaton, updateBook);
router.delete('/:id', validateToken, isAdmin, deleteBook);


router.post('/:id/borrow', validateToken, borrowBook);
router.post('/:id/return', validateToken, returnBook);

module.exports = router;