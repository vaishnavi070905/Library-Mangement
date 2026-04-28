const express = require("express");
const fs = require("fs");
const path = require("path");

const usersRouter = express.Router();

// Path to users data file
const usersFilePath = path.join(__dirname, "../data/users.json");
const booksFilePath = path.join(__dirname, "../data/books.json");

// Helper function to read users data
const readUsersData = () => {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
};

// Helper function to write users data
const writeUsersData = (data) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 4));
};

// Helper function to read books data
const readBooksData = () => {
    const data = fs.readFileSync(booksFilePath, "utf8");
    return JSON.parse(data);
};

// Helper function to write books data
const writeBooksData = (data) => {
    fs.writeFileSync(booksFilePath, JSON.stringify(data, null, 4));
};

/**
 * Route: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters: None
 */
usersRouter.get("/", (req, res) => {
    try {
        const usersData = readUsersData();
        res.status(200).json({
            success: true,
            data: usersData.users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error reading users data"
        });
    }
});

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get a user by ID
 * Access: Public
 * Parameters: id
 */
usersRouter.get("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const usersData = readUsersData();
        const user = usersData.users.find((each) => each.id === id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error reading user data"
        });
    }
});

/**
 * Route: /users
 * Method: POST
 * Description: Create a new user
 * Access: Public
 * Parameters: None
 */
usersRouter.post("/", (req, res) => {
    try {
        const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;

        if (!id || !name || !surname || !email || !subscriptionType || !subscriptionDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const usersData = readUsersData();

        // Check if user already exists
        const existingUser = usersData.users.find((each) => each.id === id);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `User already exists with id ${id}`
            });
        }

        // Add new user
        const newUser = {
            id,
            name,
            surname,
            email,
            subscriptionType,
            subscriptionDate
        };

        usersData.users.push(newUser);
        writeUsersData(usersData);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating user"
        });
    }
});

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Update a user by ID
 * Access: Public
 * Parameters: id
 */
usersRouter.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { name, surname, email, subscriptionType, subscriptionDate } = req.body;

        const usersData = readUsersData();
        const user = usersData.users.find((each) => each.id === id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id ${id}`
            });
        }

        // Update user details
        if (name) user.name = name;
        if (surname) user.surname = surname;
        if (email) user.email = email;
        if (subscriptionType) user.subscriptionType = subscriptionType;
        if (subscriptionDate) user.subscriptionDate = subscriptionDate;

        writeUsersData(usersData);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user"
        });
    }
});

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Delete a user by ID
 * Access: Public
 * Parameters: id
 */
usersRouter.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;

        const usersData = readUsersData();
        const userIndex = usersData.users.findIndex((each) => each.id === id);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: `User not found with id ${id}`
            });
        }

        // Remove user
        usersData.users.splice(userIndex, 1);
        writeUsersData(usersData);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user"
        });
    }
});

/**
 * Route: /users/subscription/:id
 * Method: GET
 * Description: Get user subscription details
 * Access: Public
 * Parameters: id
 */
usersRouter.get("/subscription/:id", (req, res) => {
    try {
        const { id } = req.params;
        const usersData = readUsersData();
        const user = usersData.users.find((each) => each.id === id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User not found with id ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                subscriptionType: user.subscriptionType,
                subscriptionDate: user.subscriptionDate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error reading subscription data"
        });
    }
});

module.exports = usersRouter;