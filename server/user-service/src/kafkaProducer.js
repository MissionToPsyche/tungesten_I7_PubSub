const { Kafka } = require('kafkajs');
const protobuf = require('protobufjs');

// Assuming you have loaded and compiled your .proto file with protobufjs
const root = protobuf.loadSync("your_protobuf_definition.proto");
const UserMessage = root.lookupType("yourpackage.UserMessage");

const kafka = new Kafka({ clientId: 'app', brokers: ['localhost:9092'] });
const producer = kafka.producer();

const sendMessage = async (userData) => {
    await producer.connect();
    const messageBuffer = UserMessage.encode(userData).finish(); // Serialize using Protobuf
    await producer.send({
        topic: 'user-topic',
        messages: [{ value: messageBuffer }],
    });
    await producer.disconnect();
};


sendMessage(userData).catch(console.error);
