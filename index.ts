import * as dotenv from "dotenv";
const { App } = require('@slack/bolt');
//import { App } from "@slack/bolt";

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
    await app.event('app_mention', async (event: Event) => {
        const result = await app.client.channels.info({
            token: event.context.botToken,
            channel: event.event.channel
        });
        event.say(`Hello world, <@${event.event.user}>! This team is ${result.channel.name}. <#${event.event.channel}>`);
    });
})();