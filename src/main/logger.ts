import winston from "winston";
import Transport from "winston-transport";
import {
    WebhookClient,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextDisplayBuilder,
    ContainerBuilder,
    MessageFlags,
    AttachmentBuilder,
    FileBuilder
} from "discord.js";
import color from "colors";
import {randomUUID} from "crypto";
import {Config} from "./config.js";

color.enable();

class DiscordTransport extends Transport {
    private webhook: WebhookClient;

    constructor(opts: { webhookUrl: string } & Transport.TransportStreamOptions) {
        super(opts);
        this.webhook = new WebhookClient({url: opts.webhookUrl});
    }

    async log(info: any, callback: () => void) {
        try {

            const uuid = randomUUID();

            // const data = await database.disBot.findFirst({
            //     where: {
            //         GetConf: "config"
            //     }
            // });
            // if (data) {
            //     if (data.Logs.length >= 1000) {
            //         data.Logs.forEach(async (log) => {
            //             if (log.UUID === uuid) return;
            //             const logDate = new Date(log.Timestamp as string);
            //             const now = new Date();
            //             const diff = now.getTime() - logDate.getTime();
            //             if (diff > ms("10m")) {
            //                 await database.disBot.update(
            //                     {
            //                         where: { GetConf: "config", },
            //                         data: {
            //                             Logs: {
            //                                 set: data.Logs.filter((f) => f.UUID != log.UUID)
            //                             }
            //                         }
            //                     }
            //                 );
            //             }
            //         });
            //     }
            // }

            // await database.disBot.update(
            //     {
            //         where: { GetConf: "config", },
            //         data: {
            //             Logs: {
            //                 push: {
            //                     UUID: uuid.toString(),
            //                     GuildId: info.guildId ? info.guildId : "0",
            //                     UserId: info.userId ? info.userId : "0",
            //                     ChannelId: info.channelId ? info.channelId : "0",
            //                     MessageId: info.messageId ? info.messageId : "0",
            //                     Timestamp: info.timestamp ? info.timestamp : new Date().toISOString(),
            //                     Level: info.level ? info.level : "info",
            //                     Label: info.label ? info.label : "General",
            //                     Message: info.message ? info.message : "No message provided",
            //                     BotType: Config.BotType.toString() || "Unknown",
            //                     Action: info.action
            //                 }
            //             }
            //         }
            //     })

            const logUrl = `https://logs.disbot.app/log/${uuid}`;
            const emoji = this.getEmoji(info.level);

            let truncatedMessage = "";
            if (info.message.length > 2000) {
                truncatedMessage = `... (Message truncated, original length: ${info.message.length})`;
            } else {
                truncatedMessage = info.message;
            }

            const attachment = new AttachmentBuilder(Buffer.from(info.message, "utf-8"))
                .setName(`log-${uuid}.txt`);

            const container = new ContainerBuilder()
            container.addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent([
                        `${emoji} **${info.label}**:`,
                        `> ${truncatedMessage}`,
                        ``,
                        `**Level:** ${info.level.toUpperCase()}`,
                        `**Timestamp:** <t:${Math.floor(new Date(info.timestamp).getTime() / 1000)}:R>`,
                        `**Bot Type:** ${Config.BotType.toString() || "Unknown"}`,
                        `**Action:** ${info.action}`,
                    ].join("\n"))
            ).addActionRowComponents(
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("View Log")
                            .setStyle(ButtonStyle.Link)
                            .setURL(logUrl)
                    )
            )
            this.webhook.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
                withComponents: true,
                files: [attachment],
                isWebhook: true
            }).catch(console.error);
        } catch (err) {
            console.error("Fehler beim Discord Logging:", err);
        } finally {
            callback();
        }
    }

    private getEmoji(level: string): string {
        switch (level) {
            case "error":
                return "<:error:1366430438444236911>";
            case "warn":
                return "<:warning:1391060310864957584>";
            case "info":
                return "<:info:1260322428140130365>";
            case "debug":
                return "<:bug:1391060490280763433>";
            default:
                return "";
        }
    }
}

export const Logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        winston.format.printf(({level, message, timestamp}) => {
            const colorizedLevel = level === "error" ? color.red(level.toUpperCase()) :
                level === "warn" ? color.yellow(level.toUpperCase()) :
                    level === "info" ? color.green(level.toUpperCase()) :
                        level === "debug" ? color.blue(level.toUpperCase()) :
                            color.white(level.toUpperCase());

            const formattedTimestamp = `${timestamp}`.gray;
            return `${formattedTimestamp}  [${colorizedLevel}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        // TODO: Fix DiscordExporter
        // new DiscordTransport({webhookUrl: Config.Logging.BotLogger})
    ],
});
