const { kafka, registry } = require('./kafkaConfig');
const { EventEmitter } = require('events');

async function startConsumer({ groupId, topics, eventName, isRegistryDecode = true, messageEventEmitter }) {
    const consumer = kafka.consumer({ groupId });

    await consumer.connect();
    for (let topic of topics) {
        await consumer.subscribe({ topic, fromBeginning: true });
    }

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                let decodedValue;
                if (isRegistryDecode === true) {
                    decodedValue = await registry.decode(message.value);
                }
                else {
                    decodedValue = JSON.parse(message.value.toString());
                }
                messageEventEmitter.emit(eventName, decodedValue, topic, partition);
            } catch (e) {
                console.error('Error decoding message', e);
            }
        },
    });
}

module.exports = { startConsumer };