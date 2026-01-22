const {validationResult} = require('express-validator');
const {findAll, findById, create, update, remove} = require('../models/Books');
const db  = require('../db');

const getAllBooks = async (req, res) => {
    try {
        const books = await findAll();
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Failed to get books" });
    }
};

const getBookById = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await findById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ error: "Failed to get book by ID" });
    } 
};

const createBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: errors.array() 
        });
    }
    try {
        const {title, author, publishedYear, genre, quantity} = req.body;
        
        const newBook = {
            title: title,
            author: author,
            publishedYear: parseInt(publishedYear),
            genre: genre,
            initialQuantity: parseInt(quantity),
            currentQuantity: parseInt(quantity), 
            available: parseInt(quantity) > 0
        };

        const bookId = await create(newBook);
        res.status(201).json({ id: bookId});
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ error: "Failed to create book" });
        
    }
};


const updateBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: errors.array() 
        });
    }
    try {
        const id = req.params.id;
        const {title, author, publishedYear, genre, quantity} = req.body;

        const book= await findById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        const updatedData = {};
        if (title) updatedData.title = title;
        if (author) updatedData.author = author;
        if (publishedYear) updatedData.publishedYear = parseInt(publishedYear);
        if (genre) updatedData.genre = genre;
        if (quantity){
            updatedData.initialQuantity = parseInt(quantity);
            const quantityDiff = parseInt(quantity) - book.initialQuantity;
            updatedData.currentQuantity = book.currentQuantity + quantityDiff;
            updatedData.available = updatedData.currentQuantity > 0;    
        }
        const updatedBook = await update(id, updatedData);
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ error: "Failed to update book" });
    } 
};

const deleteBook = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await findById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        await remove(id);
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ error: "Failed to delete book" });
    }
};

const borrowBook = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const userEmail = req.user.email;

        const book = await findById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        if (book.currentQuantity <= 0) {
            return res.status(400).json({ error: "Book is currently unavailable" });
        }   

        const updatedData = {
            currentQuantity: book.currentQuantity - 1,
            available: (book.currentQuantity - 1) > 0
        };
        await update(id, updatedData);
        await db.collection('history').add({
            bookId: id,
            bookTitle: book.title,
            userId: userId,
            userEmail: userEmail,
            action: 'borrowed',
            date: new Date()
        });
        res.status(200).json({ message: "Book borrowed successfully" });
    } catch (error) {
        console.error("Error borrowing book:", error);
        res.status(500).json({ error: "Failed to borrow book" });
    }
};
const returnBook = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const userEmail = req.user.email;

        const book = await findById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        if (book.currentQuantity >= book.initialQuantity) {
            return res.status(400).json({ error: "All copies of this book are already returned" });
        }
        const updatedData = {
            currentQuantity: book.currentQuantity + 1,
            available: true
        };
        await update(id, updatedData);
        await db.collection('history').add({
            bookId: id,
            bookTitle: book.title,
            userId: userId,
            userEmail: userEmail,
            action: 'returned',
            date: new Date()
        });
        res.status(200).json({ message: "Book returned successfully" });
    } catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ error: "Failed to return book" });
    }
};

const getUserHistory = async (req, res) => {
    try {
        const userId = req.user.userId; 

        const snapshot = await db.collection('history')
            .where('userId', '==', userId)
            .orderBy('date', 'desc')
            .get();

        const history = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleString('ro-RO') : doc.data().date
        }));

        res.status(200).json(history);
    } catch (error) {
        console.error("Eroare Backend History:", error);
        res.status(500).json({ error: "Eroare la preluarea istoricului." });
    }
};
module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    getUserHistory
};