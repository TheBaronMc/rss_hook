/*
 * Define an RSS flux with source url and a refresh time
 */
class RSSFlux {
    #refreshTime = 2000;
    #source = '';

    /*
     * Returns the refresh time
     *
     * @return {number} refresh time
     */
    getRefreshTime() {
        return this.#refreshTime;
    }

    /*
     * Returns the source url
     *
     * @return {string} source url
     */
    getSource() {
        return this.#source;
    }

    /*
     * Constructor
     *
     * @param {string} source url of rss flux
     * @param {number} refrshTime time between each refresh, 2000 by default
     */
    constructor(source, refreshTime = 2000) {
        this.#source = source;
        this.#refreshTime = refreshTime;
    }
}

module.exports = { RSSFlux: RSSFlux }