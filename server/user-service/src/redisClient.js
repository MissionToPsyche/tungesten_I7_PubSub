const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
    // If you're using a Redis server that requires credentials or a different host, specify them here
    // host: 'localhost',
    // port: 6379,
    // password: 'yourpassword',
});

client.on('error', function (error) {
    console.error(`Redis error: ${error}`);
});

// Promisify the get function to use async/await
const getAsync = promisify(client.get).bind(client);

module.exports = {
    client,
    getAsync,
};
