import { appendFile, stat, mkdir } from 'fs';
import { stdout, stderr } from 'process';

const LOG_PATH:string = './logs';
const ERR_PATH:string = './errors';

function numToString(num:number): string {
    let str = num.toString();
    if (str.length < 2) {
        return '0'+ str;
    } else {
        return str;
    }   
}

function getFileIn(path:string): string {
    let date = new Date();
    return `${path}/${numToString(date.getDate())}-${numToString(date.getMonth()+1)}-${numToString(date.getUTCFullYear())}.txt`;
}

function getDateMessage(): string{
    let date = new Date();
    return `[${numToString(date.getHours())}:${numToString(date.getMinutes())}:${numToString(date.getSeconds())}]`;
}

function createDir(path:string) {
    stat(path, (err, stats) => {
        if (err) {
            mkdir(path, { recursive: true }, (err) => {
                stderr.write(`Error while creating the following directory : ${path}`);
            });
        }
    });
}

export function err(error:Error) {
    let str = `${getDateMessage()} ${error.name} : ${error.message}\n`;

    createDir(ERR_PATH);

    appendFile(getFileIn(ERR_PATH), str, (e) => {
        stderr.write(str);
    });
}

export function log(message:string) {
    let str = `${getDateMessage()} ${message}\n`;

    createDir(LOG_PATH);

    appendFile(getFileIn(LOG_PATH), str, (error) => {
        stdout.write(str);
        if (error)
        err(error);
    });
}
