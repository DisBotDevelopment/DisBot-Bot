import {Webhook, WebhookPayload} from "@top-gg/sdk";
import bodyParser from "body-parser";
import {EmbedBuilder, WebhookClient} from "discord.js";
import express, {Request, Response} from "express";
import {ExtendedClient} from "../../types/client.js";
import {Logger} from "../../main/logger.js";
import {LoggingAction} from "../../enums/loggingTypes.js";
import {database} from "../../main/database.js";
import {Config} from "../../main/config.js";

export async function vote(client: ExtendedClient) {
    const app = express();
    app.use(bodyParser.json());

    const webhook = new Webhook(Config.Other.Vote.TopggToken);
    app.post(
        "/webhook",
        webhook.listener(async (vote: WebhookPayload) => {
            const data = await database.users.findFirst({
                where: {
                    UserId: vote.user
                }
            });


            let gvotes = data?.GloablVotes as number;
            gvotes = gvotes + 1;
            let votes = data?.Votes;
            votes = (votes as number) + 1;

            await database.users.update(
                {
                    where: {UserId: vote.user},
                    data: {Votes: votes, GloablVotes: gvotes}
                }
            );

            const bots = data?.CustomerBots;

            if ((data?.Votes as number) >= 10) {
                await database.users.update(
                    {
                        where: {UserId: vote.user},
                        data: {Votes: 0, CustomerBots: (bots as number) + 1, GloablVotes: gvotes}
                    }
                );
            }

            const webhook = new WebhookClient({
                url: "https://discord.com/api/webhooks/1231322811964854292/fLN_e9cNkywg3Hdoi25AKEUL_KDbeKFYTtgNhiwGmHmVa14CWNuF9iSbNAYNFmISD8r3",
            });
            const user = await client.users.fetch(vote.user);

            webhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            [
                                `## <:megaphone:1326158885517525126> **Thank you for voting!**`,
                                ``,
                                `> **Huge thanks for voting for us on <:Badge_Topgg:1191467866722140161> Top.gg!**`,
                                `> You get a Vote Point for voting! See your stats below:`,
                                `## Stats:`,
                                `> <:stats:1362413038468333768> **Total Votes:** \`${data?.GloablVotes}\``,
                                `> <:user:1259432940383768647> **User:** ${user.tag} (\`${user.id}\`)`,
                                `> <:timer:1321939051921801308> **Vote again**: [\`Click Here\`](https://top.gg/bot/1063079377975377960)`,
                            ].join("\n")
                        )
                        .setThumbnail(user.displayAvatarURL({extension: "gif"}))
                        .setColor("#2B2D31"),
                ],
            });
        })
    );

    app.post(
        "/dcbotlist",
        async (req: Request, res: Response) => {
            if (req.headers["authorization"] !== Config.Other.Vote.DcBotListSecret) {
                res.status(403).send("Unauthorized");
                return;
            }
            const vote = req.body
            const data = await database.users.findFirst({
                where: {
                    UserId: vote.id
                }
            });


            let gvotes = data?.GloablVotes as number;
            gvotes = gvotes + 1;


            let votes = data?.Votes;
            votes = (votes as number) + 1;

            await database.users.update(
                {
                    where: {UserId: vote.id},
                    data: {Votes: votes, GloablVotes: gvotes}
                }
            );

            const bots = data?.CustomerBots;

            if ((data?.Votes as number) >= 10) {
                await database.users.update(
                    {
                        where: {UserId: vote.id},
                        data: {Votes: 0, CustomerBots: (bots as number) + 1, GloablVotes: gvotes}
                    }
                );
            }

            const webhook = new WebhookClient({
                url: "https://discord.com/api/webhooks/1231322811964854292/fLN_e9cNkywg3Hdoi25AKEUL_KDbeKFYTtgNhiwGmHmVa14CWNuF9iSbNAYNFmISD8r3",
            });
            const user = await client.users.fetch(vote.id);

            webhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            [
                                `## <:megaphone:1326158885517525126> **Thank you for voting!**`,
                                ``,
                                `> **Huge thanks for voting for us on <:discordbotlist:1362413787474432092> Discord Bot List!**`,
                                `> You get a Vote Point for voting! See your stats below:`,
                                `## Stats:`,
                                `> <:stats:1362413038468333768> **Total Votes:** \`${data?.GloablVotes}\``,
                                `> <:user:1259432940383768647> **User:** ${user.tag} (\`${user.id}\`)`,
                                `> <:timer:1321939051921801308> **Vote again**: [\`Click Here\`](https://discordbotlist.com/bots/disbot)`,
                            ].join("\n")
                        )
                        .setThumbnail(user.displayAvatarURL({extension: "gif"}))
                        .setColor("#2B2D31"),
                ],
            });

            res.status(200).send("Success");
        })


    app.listen(Config.Other.Vote.VotePort, () => {
        Logger.info({
            timestamp: new Date().toISOString(),
            level: "info",
            label: "VoteAPI",
            message: `Vote API is running on port ${Config.Other.Vote.VotePort}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });
    });
}
