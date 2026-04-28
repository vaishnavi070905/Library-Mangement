const http = require('http');

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ status: res.statusCode, data: response });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Test the Library Management System API
async function testAPI() {
    const baseURL = 'http://localhost:8081';

    console.log('🧪 Testing Library Management System API\n');

    try {
        // Test home endpoint
        console.log('1. Testing Home Endpoint:');
        const homeResponse = await makeRequest(baseURL + '/');
        console.log('   Status:', homeResponse.status);
        console.log('   Response:', JSON.stringify(homeResponse.data, null, 2));
        console.log('');

        // Test get all users
        console.log('2. Testing Get All Users:');
        const usersResponse = await makeRequest(baseURL + '/users');
        console.log('   Status:', usersResponse.status);
        console.log('   Users count:', usersResponse.data.data.length);
        console.log('');

        // Test get all books
        console.log('3. Testing Get All Books:');
        const booksResponse = await makeRequest(baseURL + '/books');
        console.log('   Status:', booksResponse.status);
        console.log('   Books count:', booksResponse.data.data.length);
        console.log('');

        // Test get issued books
        console.log('4. Testing Get Issued Books:');
        const issuedResponse = await makeRequest(baseURL + '/books/issued/all');
        console.log('   Status:', issuedResponse.status);
        console.log('   Issued books count:', issuedResponse.data.data.length);
        console.log('');

        // Test get available books
        console.log('5. Testing Get Available Books:');
        const availableResponse = await makeRequest(baseURL + '/books/available/all');
        console.log('   Status:', availableResponse.status);
        console.log('   Available books count:', availableResponse.data.data.length);
        console.log('');

        // Test get specific user
        console.log('6. Testing Get User by ID:');
        const userResponse = await makeRequest(baseURL + '/users/1');
        console.log('   Status:', userResponse.status);
        console.log('   User:', JSON.stringify(userResponse.data.data, null, 2));
        console.log('');

        // Test get specific book
        console.log('7. Testing Get Book by ID:');
        const bookResponse = await makeRequest(baseURL + '/books/1');
        console.log('   Status:', bookResponse.status);
        console.log('   Book:', JSON.stringify(bookResponse.data.data, null, 2));
        console.log('');

        // Test creating a new user
        console.log('8. Testing Create New User:');
        const newUser = {
            id: "6",
            name: "Alice",
            surname: "Wonder",
            email: "alice.wonder@example.com",
            subscriptionType: "Standard",
            subscriptionDate: "04/28/2026"
        };
        const createUserResponse = await makeRequest(baseURL + '/users', 'POST', newUser);
        console.log('   Status:', createUserResponse.status);
        console.log('   Response:', JSON.stringify(createUserResponse.data, null, 2));
        console.log('');

        // Test issuing a book
        console.log('9. Testing Issue Book:');
        const issueData = {
            userId: "6",
            issuedDate: "04/28/2026",
            returnDate: "05/28/2026"
        };
        const issueResponse = await makeRequest(baseURL + '/books/issue/3', 'POST', issueData);
        console.log('   Status:', issueResponse.status);
        console.log('   Response:', JSON.stringify(issueResponse.data, null, 2));
        console.log('');

        console.log('✅ All API tests completed successfully!');

    } catch (error) {
        console.error('❌ Error testing API:', error.message);
    }
}

// Run the tests
testAPI();