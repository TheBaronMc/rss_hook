// IMPORT
import * as https from 'https';

import { RSSFlux } from './rssflux';
import { History } from './history';

import * as logSys from './logSys';


function getHostname(url:string) : [string, string] {
    let re = new RegExp('^(?:(?:http|https):\/\/)([a-zA-Z.0-9]*)(\/*[a-zA-Z0-9.\/\\_-]*)$');
    let match = url.match(re)

    if (!match)
        throw new Error(`There is a problem with url : ${url}`);

    return [match[1], match[2]];
}

/*
 * Abstract class to handle rss flux on update
 */
export abstract class RSSHandler {
    // ATTRIBUTS
    protected rssFlux:RSSFlux;
    protected rssFluxHostname:string;
    protected rssFluxPath:string;
    protected webhook:string;
    protected webhookHostname:string;
    protected webhookPath:string;
    protected eventName:string;

    /*
     * Constructor
     *
     * @param {string} webhook webhook url
     * @param {RSSFlux} rssFlux rss flux to handle
     * @param {string} eventName
     */
    constructor(webhook:string, rssFlux:RSSFlux, eventName:string = 'new-item') {
        this.webhook = webhook;
        this.rssFlux = rssFlux;
        this.eventName = eventName;

        // Get hostname and path from url
        [this.webhookHostname, this.webhookPath] = getHostname(this.webhook);
        [this.rssFluxHostname, this.rssFluxPath] = getHostname(this.rssFlux.getSource());
    }

    /*
    * This method will be excuted on each update on the flux
    */
    abstract action(item:any)

    /*
     * Returns the flux attached to this handler
     *
     * @return {RSSFlux} rssFlux
     */
    getFlux(): RSSFlux {
        return this.rssFlux;
    }

    /*
     * Returns the event name attached to this handler
     *
     * @return {string} eventName
     */
    getEventName(): string {
        return this.eventName;
    }
}

/*
 * Default handler
 */
export class RSSHandlerDefault extends RSSHandler {

    private history:History;

    constructor(webhook:string, rssFlux:RSSFlux, eventName:string = 'new-item') {
        super(webhook, rssFlux, eventName);
        this.history = new History();
    }

    private setOutcomingDataFormat(item) {
        return { content: 'New article', embeds: [{ title: item.title, type: 'rich', description: item.description, url: item.link }] };
    }

    action(item) {
        const data = JSON.stringify(this.setOutcomingDataFormat(item));

        // Verify if the article haven't already been pushed
        if (this.history.exist(this.rssFluxHostname, item.title)) {
            return;
        }

        const options = {
            hostname: this.webhookHostname,
            port: 443,
            path: this.webhookPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, res => {
            // log it
            logSys.log(`${this.rssFlux.getSource()}, ${item.title}, status ${res.statusCode}`);

            if (res.statusCode < 299) {
                // Put it into history
                this.history.add(this.rssFluxHostname, item.title);
            }

            res.on('data', d => {
                try {
                    d = JSON.parse(d);
                    if (res.statusCode == 429) { // 429 : Too Many Request
                        setTimeout(() => { this.action(item); }, d.retry_after);
                    }
                } catch (err) {
                    logSys.err(err);
                }
            });
        });

        req.on('error', logSys.err);

        req.write(data);
        req.end();
    }

}