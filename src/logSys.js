const { appendFile, stat, mkdir } = require('fs');
const { stdout, stderr } = require('process');

const LOG_PATH = './logs';
const ERR_PATH = './errors';

function numToString(num) {
    let str = num.toString();
    if (str.length < 2) {
        return '0'+ str;
    } else {
        return str;
    }   
}

function getFileIn(path) {
    let date = new Date();
    return `${path}/${numToString(date.getDate())}-${numToString(date.getMonth()+1)}-${numToString(date.getUTCFullYear())}.txt`;
}

function getDateMessage() {
    let date = new Date();
    return `[${numToString(date.getHours())}:${numToString(date.getMinutes())}:${numToString(date.getSeconds())}]`;
}

function createDir(path) {
    stat(path, (err, stats) => {
        if (err) {
            mkdir(path, { recursive: true }, (err) => {
                stderr.write(`Error while creating the following directory : ${path}`);
            });
        }
    });
}

function err(error) {
    let str = `${getDateMessage()} ${error.name} : ${error.message}\n`;

    createDir(ERR_PATH);

    appendFile(getFileIn(ERR_PATH), str, (e) => {
        stderr.write(str);
    });
}

function log(message) {
    let str = `${getDateMessage()} ${message}\n`;

    createDir(LOG_PATH);

    appendFile(getFileIn(LOG_PATH), str, (error) => {
        stdout.write(str);
        if (error)
        err(error);
    });
}

module.exports = { log, err };