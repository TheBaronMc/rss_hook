const RssFeedEmitter = require('rss-feed-emitter');

const { RSSFlux } = require('./src/rssflux');
const { RSSHandler, RSSHandlerDefault} = require('./src/rsshandler');

const parameters = require('./parameters.json');

const feeder = new RssFeedEmitter();

parameters.forEach((info) => {
    let flux = new RSSFlux(info.flux, info.refreshTime);
    let handler = new RSSHandlerDefault(info.webhook, flux, info.event);

    feeder.add({ url: flux.getSource(), refresh: flux.getRefreshTime(), eventName: handler.getEventName() });
    feeder.on(handler.getEventName(), handler.action.bind(handler));
});