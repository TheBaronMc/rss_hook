const https = require('https');

const logSys = require('./logSys');

const { History } = require('./history');


function getHostname(url) {
    let re = new RegExp('^(?:(?:http|https):\/\/)([a-zA-Z.0-9]*)(\/*[a-zA-Z0-9.\/\\_-]*)$');
    return url.match(re);
}

/*
 * Abstract class to handle rss flux on update
 */
class RSSHandler {

    /*
    * This method will be excuted on each update on the flux
    */
    action(item) { }

    /*
     * Returns the flux attached to this handler
     *
     * @return {RSSFlux} rssFlux
     */
    getFlux() {
        return this.rssFlux;
    }

    /*
     * Returns the event name attached to this handler
     *
     * @return {string} eventName
     */
    getEventName() {
        return this.eventName;
    }

    /*
     * Constructor
     *
     * @param {string} webhook webhook url
     * @param {RSSFlux} rssFlux rss flux to handle
     * @param {string} eventName
     */
    constructor(webhook, rssFlux, eventName = 'new-item') {
        this.webhook = webhook;
        this.rssFlux = rssFlux;
        this.eventName = eventName;

        // Get hostname and path from webhook url
        let match = getHostname(this.webhook);

        if (match) {
            this.webhookHostname = match[1];

            if (match[2] != '') {
                this.webhookPath = match[2];
            } else {
                this.webhookPath = '/';
            }
        } else {
            throw new Error(`There is a problem with webhook url : ${this.webhook}`);
        }
    }
}

/*
 * Default handler
 */
class RSSHandlerDefault extends RSSHandler {

    setOutcomingData(item) {
        return { content: 'New article', embeds: [{ title: item.title, type: 'rich', description: item.description, url: item.link }] };
    }

    action(item) {
        const data = JSON.stringify(this.setOutcomingData(item));

        if (this.history.exist(getHostname(this.getFlux().getSource())[1], item.title)) {
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
            logSys.log(`${this.getFlux().getSource()}, ${item.title}, status ${res.statusCode}`);

            if (res.statusCode < 299) {
                // Put it into history
                this.history.add(getHostname(this.getFlux().getSource())[1], item.title);
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

    constructor(webhook, rssFlux, eventName = 'new-item') {
        super(webhook, rssFlux, eventName);
        this.history = new History();
    }
}

module.exports = { RSSHandler: RSSHandler, RSSHandlerDefault: RSSHandlerDefault }