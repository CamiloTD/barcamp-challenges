let fs = require('fs');
let path = require('path');
let utils = require('util');
let [ read, write ] = [utils.promisify(fs.readFile), utils.promisify(fs.writeFile)];

exports.save = (name, data) => write(path.join(__dirname, name + '.json'), JSON.stringify(data));
exports.load = async (name, data) => {
    try {
        return JSON.parse(await read(path.join(__dirname, name + '.json')));
    } catch (exc) {
        return {};
    }
}