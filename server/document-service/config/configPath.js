async function configPaths() {
    process.env.SCHEMA_BASE_PATH = __dirname + '/../schemas/';
    process.env.MODULES_BASE_PATH = __dirname + '/../';
}

module.exports = { configPaths }