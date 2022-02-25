import { RSSFluxUnknown, WebhookUnknown } from "./exceptions";
import { RSSFlux } from "./rssflux";
import { Webhook } from "./webhook";

export class RSSHandler {
    private data = new Map<RSSFlux, Webhook[]>();

    constructor() {

    }

    /*
     * pair
     *
     * Pair an RSS flux with a webhook
     * 
     * @param {RSSFlux} flux
     * @param {Webhook} webhook
     */
    public pair(flux: RSSFlux, webhook: Webhook) {
        let webhook_list = this.data.get(flux)
        if (webhook_list === undefined)
            webhook_list = new Array<Webhook>();
        
        webhook_list.push(webhook);

        this.data.set(flux, webhook_list);

        function f(): Function {
            function g(data: string) {
                webhook.send(data).then(() => {});
            }
            return g;
        }

        flux.onUpdate(f())
    }

    public unpair(flux: RSSFlux, webhook: Webhook) {
        let webhook_list: Webhook[] | undefined = this.data.get(flux);

        if (webhook_list === undefined) 
            throw new RSSFluxUnknown();
        
        if (!webhook_list.includes(webhook))
            throw new WebhookUnknown();

        flux.onUpdate((data: any) => {});
        this.data.set(
            flux, 
            webhook_list.filter(value => value != webhook)
        );
    }

    public unpairAllFrom(flux: RSSFlux) {
        let webhook_list: Webhook[] | undefined = this.data.get(flux);

        if (webhook_list === undefined) 
            throw new RSSFluxUnknown();

        for (let webhook of webhook_list) {
            this.unpair(flux, webhook);
        }
    }

    public unpairAll() {
        for (let flux of this.data.keys()) {
            this.unpairAllFrom(flux);
        }
    }

}