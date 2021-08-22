// IMPORT
const RssFeedEmitter = require('rss-feed-emitter');
const { ArgumentParser } = require('argparse');
const { stat, readFileSync } = require('fs');

const { RSSFlux } = require('./src/rssflux');
const { RSSHandler, RSSHandlerDefault} = require('./src/rsshandler');
const { info } = require('console');

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

args = parser.parse_args();

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