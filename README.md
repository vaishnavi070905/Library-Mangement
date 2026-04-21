# Library-Mangement

    This is a libary management API Backend for the management of users and the books


## /users
GET: get all the list of users in the system
POST: Create/register a new user

## /users{id}
GET : Get a user by their ID
PUT : Updating a user by their ID
DELETE : Deleting a user by their ID(check if the user still has an issued book)  && (is there any fine to be collected)

## /users/subscription-details{id}
GET : Get a user subscription details by their ID
    >> Date of Subscription
    >> Valid till?
    >> Fine if any?

## /books
GET : Get all the books in the system
POST : Add a new book in the system

## /books{id}
GET: Get a book by its ID
PUT : Update a book by its ID
DELETE : Delete a book by its ID

## /books/issued
GET : Get all the issued books

## /books/issued/withFine
GET : Get alll issued books with their fine amount

### Subscription Types
    >> Basic (1 Month)
    >> Standard (6 Months)
    >> Premium (12 Months)

>> If a user missed the renewal date, then user should be collected with $100
>> If a user misses his subscription then user is expected to pay $100
>> If a user misses both renewal & subscription, then the collected amount should be $200.


## Commands:
npm init
npm i express
npm i nodemon --save-dev

npm run dev

To restore node module and package-lock.json --> npm i / npm install