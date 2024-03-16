const { startConsumer } = require('./kafkaConsumer');
const { publishLog } = require('./kafkaPublisher');

module.exports = { startConsumer, publishLog }