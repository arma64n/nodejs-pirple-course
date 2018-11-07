const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Create HTTP server
const server = http.createServer((req, res) => {

    // Get the requested url
    const requestedUrl = url.parse(req.url, true)

    // Get the trimmed url
    const trimmedUrl = requestedUrl.pathname.replace(/^\/+|\/+$/g, '')

    // Get the query string 
    const queryString = requestedUrl.query

    // Get the headers
    const headers = req.headers

    // Get the method type
    const method = req.method.toUpperCase()

    // Get the payload
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Check if requested handler exist
        const chosenHandler = router[trimmedUrl] || handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            requestedUrl,
            queryString,
            method,
            headers,
            'payload' : buffer
        };
    
        // Route the request to correct handler
        chosenHandler(data, (statusCode, payload) => {

            // Use the code returned from handler or use default
            let code = statusCode || 200;

            let returned = payload || {};

            const returnedString = JSON.stringify(returned);


            //Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(code);
            res.end(returnedString);
            console.log(`Returned payload ${returnedString} with code ${code}`)
        });
    });
});

// Listen to the server
server.listen(3000, () => {
    console.log('The server on port 3000 is now ON')
});

// Define all handlers
const handlers = {}

// Hello handler
handlers.hello = (data, callback) => {
    callback(201, {'message': 'Hello from Node.js'})
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

// Define the router
const router = {
    'hello': handlers.hello
};