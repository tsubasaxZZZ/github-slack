import * as dotenv from "dotenv";
import { App } from "@slack/bolt";

dotenv.config({ path: `${__dirname}/.env` });
const app = new App(
    {
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    }
);
type Event = {
    event: {
        type: string,
        user: string,
        channel: string,
        tab: string,
    },
    say: (message: string) => void,
    context: { botToken: string }
};

(async () => {
    await app.start(process.env.PORT || 3000);
    await app.event('app_mention', async (event) => {
        const result = await app.client.channels.info({
            token: event.context.botToken,
            channel: event.event.channel
        });
        const channel_name = (result.channel as any).name
        console.log(channel_name);
        event.say(`Hello world, <@${event.event.user}>! This team is ${channel_name}. <#${event.event.channel}>`);
    });
})();