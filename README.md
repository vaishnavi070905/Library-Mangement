# Library Management System API

This is a comprehensive library management API backend for managing users, books, subscriptions, and book issuing/returning operations.

## Features

- User management (CRUD operations)
- Book management (CRUD operations)
- Book issuing and returning
- Subscription management
- Fine calculation system
- Data persistence with JSON files

## API Endpoints

### Home
- **GET /** - API information and available endpoints

### Users Management

#### Get Users
- **GET /users** - Get all users in the system
- **GET /users/:id** - Get a specific user by ID
- **GET /users/subscription/:id** - Get user subscription details

#### Create/Update Users
- **POST /users** - Create a new user
  - Body: `{ "id": "string", "name": "string", "surname": "string", "email": "string", "subscriptionType": "string", "subscriptionDate": "string" }`
- **PUT /users/:id** - Update user information
  - Body: `{ "name": "string", "surname": "string", "email": "string", "subscriptionType": "string", "subscriptionDate": "string" }`

#### Delete Users
- **DELETE /users/:id** - Delete a user by ID

### Books Management

#### Get Books
- **GET /books** - Get all books in the system
- **GET /books/:id** - Get a specific book by ID
- **GET /books/issued/all** - Get all issued books with user details
- **GET /books/available/all** - Get all available books (not issued)

#### Create/Update Books
- **POST /books** - Add a new book
  - Body: `{ "id": "string", "name": "string", "author": "string", "genre": "string", "price": "string", "publisher": "string" }`
- **PUT /books/:id** - Update book information
  - Body: `{ "name": "string", "author": "string", "genre": "string", "price": "string", "publisher": "string" }`

#### Delete Books
- **DELETE /books/:id** - Delete a book by ID (only if not issued)

#### Book Issuing/Returning
- **POST /books/issue/:bookId** - Issue a book to a user
  - Body: `{ "userId": "string", "issuedDate": "string", "returnDate": "string" }`
- **POST /books/return/:bookId** - Return a book from a user
  - Body: `{ "userId": "string" }`

## Subscription Types

- **Basic** (1 Month)
- **Standard** (6 Months)
- **Premium** (12 Months)

## Fine System

- If a user misses the renewal date: $100 fine
- If a user misses subscription: $100 fine
- If a user misses both renewal & subscription: $200 fine

## Data Structure

### User Object
```json
{
  "id": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "subscriptionType": "Basic|Standard|Premium",
  "subscriptionDate": "string",
  "issuedBook": "string (optional)",
  "issuedDate": "string (optional)",
  "returnDate": "string (optional)"
}
```

### Book Object
```json
{
  "id": "string",
  "name": "string",
  "author": "string",
  "genre": "string",
  "price": "string",
  "publisher": "string"
}
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Start the production server:
   ```bash
   npm start
   ```

4. Run API tests (make sure server is running):
   ```bash
   npm test
   ```

The server will run on `http://localhost:8081`

## Dependencies

- **express**: Web framework for Node.js
- **nodemon**: Development dependency for auto-restarting the server

## File Structure

```
Library-Mangement/
├── index.js              # Main server file
├── routes/
│   ├── users.js         # User-related routes
│   └── books.js         # Book-related routes
├── data/
│   ├── users.json       # User data storage
│   └── books.json       # Book data storage
├── package.json         # Project dependencies
└── README.md           # This file
```

## Error Handling

The API includes comprehensive error handling:
- 400: Bad Request (missing required fields)
- 404: Not Found (user/book not found)
- 500: Internal Server Error

All responses follow a consistent format:
```json
{
  "success": true|false,
  "message": "string",
  "data": "object (optional)"
}
```

npm run dev

To restore node module and package-lock.json --> npm i / npm install