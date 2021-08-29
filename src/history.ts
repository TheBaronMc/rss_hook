import { openSync, appendFileSync, closeSync, readFileSync, stat, mkdir } from 'fs';

/*
 * Stored names of the pushed articles
 */
export class History {

    private HIST_PATH:string = './history';

    constructor() {
        stat(this.HIST_PATH, (err, stats) => {
            if (err) {
                mkdir(this.HIST_PATH, () => {});
            }
        });
    }

    /*
     * Add an entry to an history
     * @param   {String}    key history
     * @param   {String}    val entry
     */
    public add(key, val) {
        let fd = openSync(`${this.HIST_PATH}/${key}`, 'a');
        appendFileSync(fd, `${val}\n`, 'utf8');
        closeSync(fd);
    }

    /*
     * Get an history
     * @param   {String}    key history name
     */
    public get(key:string): string[]|undefined {
        try {
            return readFileSync(`${this.HIST_PATH}/${key}`, { encoding: 'utf-8' }).split('\n');
        } catch (err) {
            return undefined;
        }
    }

    /*
     * Says if an article is already loged in the history
     * @param   {String}    key
     * @param   {String}    val
     */
    public exist(key:string, val:string): boolean {
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