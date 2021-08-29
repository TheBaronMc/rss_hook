/*
 * Define an RSS flux with source url and a refresh time
 */
export class RSSFlux {
    private refreshTime:number = 2000;
    private source:string = '';

    /*
     * Constructor
     *
     * @param {string} source url of rss flux
     * @param {number} refrshTime time between each refresh, 2000 by default
     */
    constructor(source:string, refreshTime:number = 2000) {
        this.source = source;
        this.refreshTime = refreshTime;
    }

    /*
     * Returns the refresh time
     *
     * @return {number} refresh time
     */
    getRefreshTime() {
        return this.refreshTime;
    }

    /*
     * Returns the source url
     *
     * @return {string} source url
     */
    getSource(): string {
        return new String(this.source).slice();
    }
}