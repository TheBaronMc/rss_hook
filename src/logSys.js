const { appendFile } = require('fs');

const LOG_PATH = './log';

function log(message) {
    let date = new Date();
    let filePath = `${LOG_PATH}/${date.getDate()}-${date.getMonth() + 1}-${date.getUTCFullYear()}.txt`;
    let messageTime = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] `;
    appendFile(filePath, messageTime+message+'\n', (err) => {
        if (err) {
            appendFile('./error.txt', `${messageTime}${err.prototype.name} : ${err.prototype.message}\n`);
            throw err;
        }
    });
}

module.exports = { log };