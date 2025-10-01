
// MongoDB queries
import { MongoClient } from 'mongodb';
const uri = 'mongodb://localhost:27017'; // Change if your MongoDB runs elsewhere
const client = new MongoClient(uri);

async function runQueries() {
    try {
        await client.connect();
        const db = client.db('plp_bookstore'); 
        const books = db.collection('books');

        // Find all books in a specific genre
        const fantasyBooks = await books.find({ genre: 'Fantasy' }).toArray();
        console.log('Fantasy Books:', fantasyBooks);

        // Find books published after 1950
        const booksAfter1950 = await books.find({ published_year: { $gt: 1950 } }).toArray();
        console.log('Books published after 1950:', booksAfter1950);

        // Find books by a specific author
        const coelhoBooks = await books.find({ author: 'Paulo Coelho' }).toArray();
        console.log('Books by Paulo Coelho:', coelhoBooks);

        // Update the price of a specific book
        const updateResult = await books.updateOne(
            { title: 'The Great Gatsby' },
            { $set: { price: 10.0 } }
        );
        console.log('Update Result:', updateResult);

        // Delete a book by its title
        const deleteResult = await books.deleteOne({ title: 'Animal Farm' });
        console.log('Delete Result:', deleteResult);

        // Find books that are both in stock and published after 2010
        const advancedBooks = await books.find({
            $and: [
                { in_stock: true },
                { published_year: { $gt: 2010 } }
            ]
        }).toArray();
        console.log('In-stock books published after 2010:', advancedBooks);

        // Use projection to return only the title, author, and price fields
        const projectedBooks = await books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray();
        console.log('Projected Books:', projectedBooks);

         // Books sorted by price (ascending)
    const booksAsc = await books.find().sort({ price: 1 }).toArray();
    console.log('Books sorted by price (ascending):', booksAsc);

    // Books sorted by price (descending)
    const booksDesc = await books.find().sort({ price: -1 }).toArray();
    console.log('Books sorted by price (descending):', booksDesc);

    // Pagination: First five books
    const firstFiveBooks = await books.find().limit(5).toArray();
    console.log('First five books:', firstFiveBooks);

    // Pagination: Skip five and get next five
    const nextFiveBooks = await books.find().skip(5).limit(5).toArray();
    console.log('Next five books:', nextFiveBooks);

    // Aggregation: Average price of books by genre
    const avgPriceByGenre = await books.aggregate([
        {
            $group: {
                _id: "$genre",
                average_price: { $avg: "$price" }
            }
        }
    ]).toArray();
    console.log('Average price by genre:', avgPriceByGenre);

    // Aggregation: Author with the most books
    const authorWithMostBooks = await books.aggregate([
        {
            $group: {
                _id: "$author",
                book_count: { $sum: 1 }
            }
        },
        { $sort: { book_count: -1 } },
        { $limit: 1 }
    ]).toArray();
    console.log('Author with most books:', authorWithMostBooks);

    // Aggregation: Group books by publication decade and count them
    const booksByDecade = await books.aggregate([
        {
            $group: {
                _id: {
                    $subtract: ["$published_year", { $mod: ["$published_year", 10] }]
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]).toArray();
    console.log('Books grouped by decade:', booksByDecade);

    // Create an index on the title field for faster searches
    const indexResult = await books.createIndex({ title: 1 });
    console.log('Index created on title:', indexResult);


    // Create a compound index on author and published_year
    const compoundIndexResult = await books.createIndex({ author: 1, published_year: 1 });
    console.log('Compound index created on author and published_year:', compoundIndexResult);

    // Use the explain() method to demonstrate performance improvement with your indexes
    const explainStats = await books.find({ author: "J.R.R. Tolkien", published_year: { $gt: 1950 } }).explain("executionStats");
    console.log('Explain stats for indexed query:', explainStats);


    } catch (err) {
        console.error('Error running queries:', err);
    } finally {
        await client.close();
    }
}

runQueries();

// Implement sorting to display books by price (both ascending and descending)
// Ascending and Descending
// Add these queries inside the async function


// Add the following code inside your runQueries async function:

   


