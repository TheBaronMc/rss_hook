import axios from "axios";

export class Webhook {
    private url: string;

    public constructor(url: string) {
        this.url = url;
    }

    public async send(data: any) {
        let d: any = { content: 'New article', embeds: [{ title: data.title, type: 'rich', description: data.description, url: data.link }] };

        try {
            let response = await axios.post(this.url, d);
            console.log(`${data.title}: posted`);
        } catch (err) {
            console.log(`${data.title}: error`)
            await this.sleep(2000);
            await this.send(data)
        }       
    }

    private sleep(ms: number) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      
}