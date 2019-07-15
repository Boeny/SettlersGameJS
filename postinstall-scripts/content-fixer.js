const fs = require('fs')


function fixFile(path, wrongContent, correctContent) {
    let data;
    try {
        data = fs.readFileSync(path, { encoding: 'utf8' });
    } catch (err) {
        return console.log(`Error while reading file: ${err.toString()}`);
    }
    data = data.replace(wrongContent, correctContent);
    try {
        fs.writeFileSync(path, data);
    } catch (err) {
        return console.log(`Error while writing file: ${err.toString()}`);
    }
    console.log(`File ${path} was successfully written!`);
}

exports.default = fixFile;
