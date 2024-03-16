const { readAVSCAsync, SchemaType } = require('@kafkajs/confluent-schema-registry');
const { producer, registry } = require('./kafkaConfig');

async function publishLog(topic, schemaFileName, logEntry) {
    await producer.connect();
    const schemaPath = process.env.SCHEMA_BASE_PATH + schemaFileName
    // Read the AVSC schema file
    const avroSchema = await readAVSCAsync(schemaPath);
    const { id: schemaId } = await registry.register({ type: SchemaType.AVRO, schema: JSON.stringify(avroSchema) });
    const encodedLog = await registry.encode(schemaId, logEntry);

    await producer.send({
        topic,
        messages: [{ value: encodedLog }],
    });
    await producer.disconnect();
}

module.exports = { publishLog };