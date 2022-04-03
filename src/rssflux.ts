import RssFeedEmitter from 'rss-feed-emitter';

/*
 * Define an RSS flux with source url and a refresh time
 */
export class RSSFlux {
    //private static feeder = new RssFeedEmitter();
    
    private static feeder = new RssFeedEmitter();
    private url: string;
    private eventName: string;

    /*
     * Constructor
     *
     * @param {string} source url of rss flux
     * @param {number} refrshTime time between each refresh, 2000 by default
     */
    constructor(url: string, refreshTime: number = 2000) {
        this.url = url;
        this.eventName = getRandomString();

        RSSFlux.feeder.add({
            url: this.url,
            refresh: refreshTime,
            eventName: this.eventName
        })
    }

    /*
     * onUpdate
     *
     * @param {Function} callback function which will be execute on update
     */
    public onUpdate(callback: Function) {
        RSSFlux.feeder.on(this.eventName, <any>callback);
    }

    /*
     * removeOnUpate
     *
     * @param {Function} callback function which will be remove if it exists
     */
    public removeOnUpate(callback: Function) {
        RSSFlux.feeder.removeListener(this.eventName, <any>callback);
    }
}

function getRandomString(): string {
    let str = '';

    for (let i=0; i<100; i++) {
        str += (Math.random() * 250).toString();
    }

    return str;
}