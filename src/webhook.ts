import axios from "axios";

export class Webhook {
    private url: string;

    public constructor(url: string) {
        this.url = url;
    }

    public async send(data: any) {
        let sended: boolean = false;
        let dataModel: any = { 
            content: 'New content',
            embeds: [
                { 
                    title: data.title,
                    type: 'rich',
                    description: data.description,
                    url: data.link 
                }
            ]
        };

        while (!sended) {
            try {
                await axios.post(this.url, dataModel);
                sended = true;
            } catch (err) {
                await this.sleep(2000);
            }
        }
    }

    private sleep(ms: number) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      
}