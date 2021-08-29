// IMPORT TS
import { ArgumentParser } from "argparse";
import { stat, readFileSync } from 'fs';

import { RSSFlux } from './src/rssflux';
import { RSSHandlerDefault} from './src/rsshandler'

// IMPORTS JS
const RssFeedEmitter = require('rss-feed-emitter');

// FUNCTION
function checkExist(path) {
    stat(path, (err, stats) => {
        if (err) {
            throw err;
        }

        if (stats.isDirectory()) {
            throw new Error(`${path} has to be a file.`);
        }
    });
}


// PROG
var parameters;

const parser = new ArgumentParser({
    description: 'RSS Hook'
  });

parser.add_argument('-f', '--conf_file', { help:'path to parameters.json'});

let args = parser.parse_args();

if (args.conf_file) {
    checkExist(args.conf_file);
    parameters = JSON.parse(readFileSync(args.conf_file, {encoding:'utf-8'}));
} else {
    checkExist('./parameters.json');
    parameters = JSON.parse(readFileSync('./parameters.json', {encoding:'utf-8'}));
}

const feeder = new RssFeedEmitter();

parameters.forEach((info) => {
    let flux = new RSSFlux(info.flux, info.refreshTime);
    let handler = new RSSHandlerDefault(info.webhook, flux, info.event);

    feeder.add({ url: flux.getSource(), refresh: flux.getRefreshTime(), eventName: handler.getEventName() });
    feeder.on(handler.getEventName(), handler.action.bind(handler));
});