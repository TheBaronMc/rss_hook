const { log } = require('console');
const https = require('https');

/*
 * Abstract class to handle rss flux on update
 */
class RSSHandler {

    /*
    * This method will be excuted on each update on the flux
    */
    action(item) {}

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
        let re = new RegExp('^(?:(?:http|https):\/\/)([a-zA-Z.0-9]*)(\/*[a-zA-Z0-9.\/\\_-]*)$');
        let match = this.webhook.match(re);
        
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
        const data = JSON.stringify(this.setOutcomingData(item))

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
            console.log(`statusCode: ${res.statusCode}`);

            res.on('data', d => {
                //process.stdout.write(d);
                d = JSON.parse(d)
                if (res.statusCode == 429) { // 429 : Too Many Request
                    setTimeout(() => {this.action(item);}, d.retry_after);
                }
            });
        });
        
            req.on('error', error => {
            console.error(error);
        });
        
        req.write(data);
        req.end();
    }
}

module.exports = { RSSHandler: RSSHandler, RSSHandlerDefault: RSSHandlerDefault }