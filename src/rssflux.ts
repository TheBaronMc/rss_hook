import RssFeedEmitter from 'rss-feed-emitter';

/*
 * Define an RSS flux with source url and a refresh time
 */
export class RSSFlux {
    //private static feeder = new RssFeedEmitter();
    private feeder = new RssFeedEmitter();
    private url: string = '';
    private eventName: string = '';
    private refreshTime: number = 2000;
    private callback: any;

    /*
     * Constructor
     *
     * @param {string} source url of rss flux
     * @param {number} refrshTime time between each refresh, 2000 by default
     */
    constructor(url: string, refreshTime: number = 2000) {
        this.url = url;
        this.refreshTime = refreshTime;
        this.eventName = getRandomString();

        //this.callback = (data:any) => {};
        //this.addToFeeder(this.callback);
    }

    /*
     * onUpdate
     *
     * @param {Function} f function which will be execute on update
     */
    public onUpdate(f: Function) {
        this.callback = f;
        this.removeFromFeeder();
        this.addToFeeder(this.callback);
    }

    private addToFeeder(f: Function) {
        this.feeder.add({
            url: this.url,
            refresh: this.refreshTime,
            eventName: this.eventName
        });

        this.feeder.on(this.eventName, (data:any) => { f(data) });
    }

    private removeFromFeeder() {
        //RSSFlux.feeder.remove(this.url);
        this.feeder.removeListener(this.eventName, this.callback)
        console.log(this.callback);
        
        
        
        //RSSFlux.feeder.removeAllListeners(this.eventName);
    }
}

function getRandomString(): string {
    let str = '';

    for (let i=0; i<100; i++) {
        str += (Math.random() * 250).toString();
    }

    return str;
}