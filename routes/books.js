const express = require("express");
const fs = require("fs");
const path = require("path");

const booksRouter = express.Router();

// Path to data files
const booksFilePath = path.join(__dirname, "../data/books.json");
const usersFilePath = path.join(__dirname, "../data/users.json");

// Helper function to read books data
const readBooksData = () => {
    const data = fs.readFileSync(booksFilePath, "utf8");
    return JSON.parse(data);
};

// Helper function to write books data
const writeBooksData = (data) => {
    fs.writeFileSync(booksFilePath, JSON.stringify(data, null, 4));
};

// Helper function to read users data
const readUsersData = () => {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
};

// Helper function to write users data
const writeUsersData = (data) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 4));
};

/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: None
 */
booksRouter.get("/", (req, res) => {
    try {
        const booksData = readBooksData();
        res.status(200).json({
            success: true,
            data: booksData.books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error reading books data"
        });
    }
});

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get a book by ID
 * Access: Public
 * Parameters: id
 */
booksRouter.get("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const booksData = readBooksData();
        const book = booksData.books.find((each) => each.id === id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with id ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error reading book data"
        });
    }
});

/**
 * Route: /books
 * Method: POST
 * Description: Add a new book
 * Access: Public
 * Parameters: None
 */
booksRouter.post("/", (req, res) => {
    try {
        const { id, name, author, genre, price, publisher } = req.body;

        if (!id || !name || !author || !genre || !price || !publisher) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const booksData = readBooksData();

        // Check if book already exists
        const existingBook = booksData.books.find((each) => each.id === id);
        if (existingBook) {
            return res.status(400).json({
                success: false,
                message: `Book already exists with id ${id}`
            });
        }

        // Add new book
        const newBook = {
            id,
            name,
            author,
            genre,
            price,
            publisher
        };

        booksData.books.push(newBook);
        writeBooksData(booksData);

        res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: newBook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding book"
        });
    }
});

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update a book by ID
 * Access: Public
 * Parameters: id
 */
booksRouter.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, author, genre, price, publisher } = req.body;

        const booksData = readBooksData();
        const book = booksData.books.find((each) => each.id === id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with id ${id}`
            });
        }

        // Update book details
        if (name) book.name = name;
        if (author) book.author = author;
        if (genre) book.genre = genre;
        if (price) book.price = price;
        if (publisher) book.publisher = publisher;

        writeBooksData(booksData);

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating book"
        });
    }
});

/**
 * Route: /books/:id
 * Method: DELETE
 * Description: Delete a book by ID
 * Access: Public
 * Parameters: id
 */
booksRouter.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;

        const booksData = readBooksData();
        const bookIndex = booksData.books.findIndex((each) => each.id === id);

        if (bookIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `Book not found with id ${id}`
            });
        }

        // Check if book is issued to any user
        const usersData = readUsersData();
        const userWithBook = usersData.users.find((user) => user.issuedBook === id);

        if (userWithBook) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete book. It is currently issued to user ${userWithBook.name} ${userWithBook.surname}`
            });
        }

        // Remove book
        booksData.books.splice(bookIndex, 1);
        writeBooksData(booksData);

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting book"
        });
    }
});

/**
 * Route: /books/issue/:bookId
 * Method: POST
 * Description: Issue a book to a user
 * Access: Public
 * Parameters: bookId
 * Body: userId, issuedDate, returnDate
 */
booksRouter.post("/issue/:bookId", (req, res) => {
    try {
        const { bookId } = req.params;
        const { userId, issuedDate, returnDate } = req.body;

        if (!userId || !issuedDate || !returnDate) {
            return res.status(400).json({
                success: false,
                message: "userId, issuedDate, and returnDate are required"
            });
        }

        const booksData = readBooksData();
        const usersData = readUsersData();

        const book = booksData.books.find((each) => each.id === bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with id ${bookId}`
            });
        }

        const user = usersData.users.find((each) => each.id === userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id ${userId}`
            });
        }

        // Check if user already has a book issued
        if (user.issuedBook) {
            return res.status(400).json({
                success: false,
                message: `User ${user.name} ${user.surname} already has a book issued`
            });
        }

        // Check if book is already issued
        const userWithBook = usersData.users.find((u) => u.issuedBook === bookId);
        if (userWithBook) {
            return res.status(400).json({
                success: false,
                message: `Book is already issued to ${userWithBook.name} ${userWithBook.surname}`
            });
        }

        // Issue the book
        user.issuedBook = bookId;
        user.issuedDate = issuedDate;
        user.returnDate = returnDate;

        writeUsersData(usersData);

        res.status(200).json({
            success: true,
            message: `Book "${book.name}" issued to ${user.name} ${user.surname} successfully`,
            data: {
                user: user,
                book: book
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error issuing book"
        });
    }
});

/**
 * Route: /books/return/:bookId
 * Method: POST
 * Description: Return a book from a user
 * Access: Public
 * Parameters: bookId
 * Body: userId
 */
booksRouter.post("/return/:bookId", (req, res) => {
    try {
        const { bookId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const booksData = readBooksData();
        const usersData = readUsersData();

        const book = booksData.books.find((each) => each.id === bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with id ${bookId}`
            });
        }

        const user = usersData.users.find((each) => each.id === userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id ${userId}`
            });
        }

        // Check if user has this book issued
        if (user.issuedBook !== bookId) {
            return res.status(400).json({
                success: false,
                message: `User ${user.name} ${user.surname} does not have this book issued`
            });
        }

        // Return the book
        delete user.issuedBook;
        delete user.issuedDate;
        delete user.returnDate;

        writeUsersData(usersData);

        res.status(200).json({
            success: true,
            message: `Book "${book.name}" returned by ${user.name} ${user.surname} successfully`,
            data: {
                user: user,
                book: book
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error returning book"
        });
    }
});

/**
 * Route: /books/issued
 * Method: GET
 * Description: Get all issued books with user details
 * Access: Public
 * Parameters: None
 */
booksRouter.get("/issued/all", (req, res) => {
    try {
        const usersData = readUsersData();
        const booksData = readBooksData();

        const issuedBooks = usersData.users
            .filter((user) => user.issuedBook)
            .map((user) => {
                const book = booksData.books.find((b) => b.id === user.issuedBook);
                return {
                    user: {
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                        email: user.email
                    },
                    book: book,
                    issuedDate: user.issuedDate,
                    returnDate: user.returnDate
                };
            });

        res.status(200).json({
            success: true,
            data: issuedBooks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error reading issued books data"
        });
    }
});

/**
 * Route: /books/available
 * Method: GET
 * Description: Get all available books (not issued)
 * Access: Public
 * Parameters: None
 */
booksRouter.get("/available/all", (req, res) => {
    try {
        const booksData = readBooksData();
        const usersData = readUsersData();

        const issuedBookIds = usersData.users
            .filter((user) => user.issuedBook)
            .map((user) => user.issuedBook);

        const availableBooks = booksData.books.filter((book) => !issuedBookIds.includes(book.id));

        res.status(200).json({
            success: true,
            data: availableBooks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error reading available books data"
        });
    }
});

module.exports = booksRouter;