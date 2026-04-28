const express = require("express");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

const app = express();
const PORT = 8081;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Library Management System API",
        version: "1.0.0",
        endpoints: {
            users: "/users",
            books: "/books",
            issuedBooks: "/books/issued/all",
            availableBooks: "/books/available/all"
        }
    });
});

app.use("/users", usersRouter);
app.use("/books", booksRouter);

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!"
    });
});

app.listen(PORT, () => {
    console.log(`Library Management System Server is running on http://localhost:${PORT}`);
});
