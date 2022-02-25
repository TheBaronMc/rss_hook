import { ArgumentParser } from 'argparse';
import { stat, readFileSync } from 'fs';

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

parameters['webhooks'].forEach((wh: any) => {
    let webhook: Webhook = new Webhook(wh.url);

    wh['flux'].forEach((fx: any) => {
        rss_handler.pair(
            new RSSFlux(fx.url),
            webhook
        )
    });
});