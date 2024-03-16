const { kafka, registry } = require('./kafkaConfig');
const { EventEmitter } = require('events');

const messageEventEmitter = new EventEmitter();

async function startConsumer({ groupId, topics, eventName }) {
    const consumer = kafka.consumer({ groupId });

    await consumer.connect();
    for (let topic of topics) {
        await consumer.subscribe({ topic, fromBeginning: true });
    }

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const decodedValue = await registry.decode(message.value);
                messageEventEmitter.emit(eventName, decodedValue, topic, partition);
            } catch (e) {
                console.error('Error decoding message', e);
            }
        },
    });
}

module.exports = { startConsumer };