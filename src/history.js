const fs = require('fs');

const HIST_PATH = './history';

/*
 * Know if a file exists or not in the history path
 * @param   {String}    fileName
 * @return  {boolean}
 */
function exist_file(fileName) {
    try {
        fs.accessSync(`${HIST_PATH}/${fileName}`, fs.constants.R_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function create_file(key) {
    fs.promises.open(`${HIST_PATH}/${key}`, 'w').then((file) => {file.close()}, (r) => {});
}

class History {

    constructor() {
        fs.stat(HIST_PATH, (err, stats) => {
            if (err) {
                fs.mkdir(HIST_PATH, () => {});
            }
        });
    }

    /*
     * Add an entry to an history
     * @param   {String}    key history
     * @param   {String}    val entry
     */
    add(key, val) {
        let fd = fs.openSync(`${HIST_PATH}/${key}`, 'a');
        fs.appendFileSync(fd, `${val}\n`, 'utf8');
        fs.closeSync(fd);
    }

    /*
     * Get an history
     * @param   {String}    key history name
     */
    get(key) {
        try {
            return fs.readFileSync(`${HIST_PATH}/${key}`, { encoding: 'utf-8' }).split('\n');
        } catch (err) {
            return undefined;
        }
    }

    /*
     * Says if an article is already loged in the history
     * @param   {String}    key
     * @param   {String}    val
     */
    exist(key, val) {
        let hist = this.get(key);
        if (hist) {
            for (let article of hist) {
                if (val===article) {
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = { History }