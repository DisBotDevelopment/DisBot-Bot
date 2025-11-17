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
import {Config, configStartup} from "./config.js";

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
            )
            this.webhook.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
                withComponents: true,
                files: [attachment],
                isWebhook: true
            }).catch(console.error);
        } catch (err) {
            console.error("Error: ", err);
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

await configStartup();
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
        new DiscordTransport({webhookUrl: Config.Logging.BotLogger})
    ],
});
