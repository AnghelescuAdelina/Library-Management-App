const db = require('../db');
const { faker } = require('@faker-js/faker');

function generateRandomBook() {
    const quantity=faker.number.int({ min: 0, max: 20 });
    return {
        title: faker.book.title(),
        author: faker.book.author(),
        publishedYear: faker.number.int({ min: 1900, max: 2024 }),
        genre: faker.book.genre(),
        initialQuantity: quantity,
        currentQuantity: quantity,
        available: true,
        createdAt: new Date().toISOString()
    };
    
}

async function seedBooks(numBooks = 50) {
    try{
        console.log(`Starting to seed ${numBooks} books...`);
        const booksCollection = db.collection('books');
        const books =[];
        for (let i = 0; i < numBooks; i++) {
            books.push(generateRandomBook());
        }

        const promises = books.map(book => booksCollection.add(book));
        await Promise.all(promises);
        console.log(`Successfully seeded ${numBooks} books.`);

    }catch (error){
        console.error(`Error seeding books: ${error}`);
    }
}

if (require.main === module) {
    const numBooks = process.argv[2] ? parseInt(process.argv[2]) : 50;

    seedBooks(numBooks).then(() => {
        console.log('Seeding completed.');
        process.exit(0);
    }).catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    });
}