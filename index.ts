import * as dotenv from "dotenv";
import { App } from "@slack/bolt";
import * as ga from "./githubapi";

dotenv.config({ path: `${__dirname}/.env` });
const app = new App(
    {
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET
    }
);

(async () => {
    await app.start(process.env.PORT || 3000);
    await app.command('/todo', async ({ command, ack, say, context }) => {
        ack();

        if (!command.text) {
            await app.client.chat.postEphemeral({
                token: context.botToken,
                channel: command.channel_name,
                user: command.user_id,
                text: `Sorry <@${command.user_id}>, you aren't registered in Acme. Please post in <#${command.channel_id}> for assistance.`
            });
        } else {
            const [data, errors] = await ga.createGitHubIssue({ author: "tsubasaxZZZ", repositoryName: "daily-tasks", title: `${command.text}`, body: "", labelName: `${command.channel_name}` });
            console.log(data);
            say(`Hi <@${command.user_id}>, I added to todo! : ${command.text}`);
        }
    });

    await app.event('app_mention', async (response) => {
        const result = await app.client.channels.info({
            token: response.context.botToken,
            channel: response.event.channel
        });
        const channel_name = (result.channel as any).name
        console.log(channel_name);
        console.log(response);

        response.say(`${response.event.text}`);

        //        response.say(`Hello world, <@${response.event.user}>! This team is ${channel_name}. <#${response.event.channel}>`);
    });
})();