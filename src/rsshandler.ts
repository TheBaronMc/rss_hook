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
        // Get the webhooks associated with the flux
        let webhook_list = this.data.get(flux)
        if (webhook_list === undefined) // If known the flux is unknown
            webhook_list = new Array<Webhook>();
        
        // Add the webhook to the list
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
        // Check if the flux and the webhook are known
        let webhook_list: Webhook[] | undefined = this.data.get(flux);

        if (webhook_list === undefined) 
            throw new RSSFluxUnknown();
        
        if (!webhook_list.includes(webhook))
            throw new WebhookUnknown();

        // Remove previous onUpdate
        flux.onUpdate((data: any) => {});

        // Remove webhook from the webhooks associated with the flux
        this.data.set(
            flux, 
            webhook_list.filter(value => value != webhook)
        );
    }

    public unpairAllFrom(flux: RSSFlux) {
        // Check if the flux is known
        let webhook_list: Webhook[] | undefined = this.data.get(flux);

        if (webhook_list === undefined) 
            throw new RSSFluxUnknown();

        // unpair for each associated webhook
        for (let webhook of webhook_list) {
            this.unpair(flux, webhook);
        }
    }

    public unpairAll() {
        // For each known flux unpair
        for (let flux of this.data.keys()) {
            this.unpairAllFrom(flux);
        }
    }

}