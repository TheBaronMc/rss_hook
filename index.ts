import { ArgumentParser } from 'argparse';
import { readFileSync } from 'fs';

import { RSSFlux } from './src/rssflux';
import { RSSHandler } from './src/rsshandler';
import { Webhook } from './src/webhook';

const parser = new ArgumentParser({
    description: 'RSS Hook'
  });

parser.add_argument('-f', '--conf_file', { 
    help:'path to parameters.json',
    default: './parameters.json'
});

let args = parser.parse_args();
let parameters = JSON.parse(readFileSync(args.conf_file, {encoding:'utf-8'}));

const rss_handler = new RSSHandler();

let flux: Map<string,RSSFlux> = new Map<string,RSSFlux>();

for (let f of parameters['flux']) {
    flux.set(f.name, new RSSFlux(f.url, f.refreshTime));
}

for (let wh of parameters['webhooks']) {
    let webhook = new Webhook(wh.url);
    for (let fluxName of wh.flux) {
        if (!flux.has(fluxName))
            throw new Error(`Flux ${fluxName} doesn't exist`);
        
        rss_handler.pair(<RSSFlux>flux.get(fluxName), webhook)
    }
}