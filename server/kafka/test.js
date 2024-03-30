require('dotenv').config(); // Assuming you're using dotenv to manage your environment variables
const { startConsumer } = require('./kafkaConsumer');
const { EventEmitter } = require('events');
// Setup your consumer configuration
const groupId = 'consumer-id'; // Example: 'my-consumer-group'
const topics = ['users']; // Example: ['user-updates']
const eventName = 'YOUR_EVENT_NAME'; // Example: 'message-received'
const messageEventEmitter = new EventEmitter();

// Function to handle the received message event
function handleMessage(decodedValue, topic, partition) {
    console.log(`Received message from topic "${topic}" partition ${partition}:`, decodedValue);
}

// Start the consumer
async function run() {
    try {
        await startConsumer({ groupId, topics, eventName, isRegistryDecode: false, messageEventEmitter });

        // Listen to the message event
        messageEventEmitter.on(eventName, handleMessage);

        console.log(`Consumer started. Subscribed to topics: ${topics.join(', ')}`);
    } catch (error) {
        console.error('Error starting the consumer:', error);
    }
}

run();
