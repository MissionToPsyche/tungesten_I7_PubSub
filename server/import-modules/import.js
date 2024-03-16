const fs = require('fs');
const path = require('path');

function importModules(pathToFolder) {
    const directoryPath = path.join(process.env.MODULES_BASE_PATH, pathToFolder);

    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
        if (file.match(/\.js$/)) {
            const fileExports = require(path.join(directoryPath, file));
            if (typeof fileExports === 'object' && fileExports !== null) {
                Object.keys(fileExports).forEach((exportName) => {
                    // Assign each export to the global object
                    global[exportName] = fileExports[exportName];
                });
            } else {
                // For single default exports
                const moduleName = file.split('.').slice(0, -1).join('.');
                global[moduleName] = fileExports;
            }
        }
    });
}

module.exports = importModules