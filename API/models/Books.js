const db = require('../db');

const booksCollection = db.collection('books');

const findAll = async () => {
    const snapshot = await booksCollection.get();
    const books = [];
    snapshot.forEach(doc => {
        books.push({ 
            id: doc.id, 
            ...doc.data() 
        });
    });
    return books;
};

const findById = async (id) => {
    const doc = await booksCollection.doc(id).get();
    if (!doc.exists) {
        return null;
    }

    return { 
        id: doc.id, 
        ...doc.data()
     };
};

const create = async (bookData) => {
    const docRef = await booksCollection.add(bookData);
    const newDoc = await docRef.get();
};

const update = async (id, updateData) => {
    const docRef = booksCollection.doc(id);
    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    return { 
        id: updatedDoc.id, 
        ...updatedDoc.data()
    };
};

const remove = async (id) => {
    const docRef = booksCollection.doc(id);
    await docRef.delete();
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};