const { Kafka, logLevel } = require('kafkajs');
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry');

const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },
    logLevel: logLevel.ERROR,
});

const producer = kafka.producer();

const registry = new SchemaRegistry({
    host: process.env.SCHEMA_REGISTRY_URL,
    auth: {
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },
});

module.exports = { producer, kafka, registry };
