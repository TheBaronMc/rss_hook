import RssFeedEmitter from 'rss-feed-emitter';

/*
 * Define an RSS flux with source url and a refresh time
 */
export class RSSFlux {
    private static feeder = new RssFeedEmitter();
    private url: string = '';
    private eventName: string = '';
    private refreshTime: number = 2000;

    /*
     * Constructor
     *
     * @param {string} source url of rss flux
     * @param {number} refrshTime time between each refresh, 2000 by default
     */
    constructor(url: string, refreshTime: number = 2000) {
        this.url = url;
        this.refreshTime = refreshTime;
        this.eventName = this.randomEventName();

        this.addToFeeder((data:any) => {});
    }

    /*
     * onUpdate
     *
     * @param {Function} f function which will be execute on update
     */
    public onUpdate(f: Function) {
        this.removeFromFeeder();
        this.addToFeeder(f);
    }

    private addToFeeder(f: Function) {
        RSSFlux.feeder.add({
            url: this.url,
            refresh: this.refreshTime,
            eventName: this.eventName
        });

        RSSFlux.feeder.on(this.eventName, (data:any) => { f(data) });
    }

    private removeFromFeeder() {
        RSSFlux.feeder.remove(this.url);
    }

    private randomEventName(): string {
        let eventName = '';

        for (let i=0; i<100; i++) {
            eventName += (Math.random() * 250).toString();
        }

        return eventName;
    }
}