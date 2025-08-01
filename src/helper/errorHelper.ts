import * as Sentry from "@sentry/node";
import colors from "colors";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, WebhookClient} from "discord.js";
import {convertToEmojiPng} from "./emojis.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import {Logger} from "../main/logger.js";
import {Config} from "../main/config.js";

colors.enable();

export async function errorHandler(interaction: any, client: any, error: Error) {
    Logger?.error({
        timestamp: new Date().toISOString(),
        level: "error",
        label: "InteractionHandler",
        message: `Error handling interaction: ${error instanceof Error ? error.message : String(error)}`,
        botType: Config.BotType.toString() || "Unknown",
        action: LoggingAction.Interaction,
    });
    Sentry.captureException(error);
    if (interaction.isRepliable()) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        });


        await interaction.editReply({
            content: `## ${await convertToEmojiPng("error", client.user?.id)} An error occurred while processing your interaction.\n-# You can click the button below to report this issue to the developers.`,
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("report-error")
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Report Error")
                        .setEmoji("<:error:1366426689961459893>")
                ),
            ],
            flags: MessageFlags.Ephemeral,
        });

        const collector = interaction.channel?.createMessageComponentCollector({
            filter: (i: {
                customId: string;
                user: { id: any; };
            }) => i.customId === "report-error" && i.user.id === interaction.user.id,
            time: 60000,
        });

        collector?.on("collect", async (i: { deferUpdate: () => any; }) => {
            await i.deferUpdate();

            let interactionName = "Unknown";
            if (interaction.isCommand() || interaction.isContextMenuCommand()) {
                interactionName = interaction.commandName;
            } else if (interaction.isButton()) {
                interactionName = interaction.customId;
            } else if (interaction.isModalSubmit()) {
                interactionName = interaction.customId;
            } else if (interaction.isAnySelectMenu()) {
                interactionName = interaction.customId;
            }

            const webHookClient = new WebhookClient({
                url: Config.Logging.ErrorWebhook as string,
            });

            if (!client.user) throw new Error("Client user is not defined");
            await webHookClient.send({
                content: `-# <:error:1366430438444236911> **Bug Report Submitted**`,
                embeds: [
                    {
                        author: {
                            name: `${interaction.user.tag} (${interaction.user.id})`,
                            icon_url: interaction.user.displayAvatarURL(),
                        },
                        color: 0x2B2D31,
                        description: [
                            `<:error:1366430438444236911> **Error Report**`,
                            `> **User:** ***\`${interaction.user.username}\`*** (\`${interaction.user.id}\`)`,
                            `> **Error:** \`${error.name}\``,
                            `>  - \`${error.message}\``,
                            `> **Interaction Type:** \`${interaction.type == 2 ? "Application Command" : interaction.type == 4 ? "ApplicationCommandAutocomplete" : interaction.type == 3 ? "Message Component" : interaction.type == 5 ? "Modal Submit" : interaction.type == 1 ? "Ping" : "Unknown"}\``,
                            `> **Interaction Name/ID:** \`${interactionName}\``,
                        ].join("\n"),
                        timestamp: new Date().toISOString(),
                    },
                    {
                        author: {
                            name: `${client.user.tag} (${client.user.id})`,
                            icon_url: client.user.displayAvatarURL(),
                        },
                        color: 0x2B2D31,
                        description: [
                            `||\`\`\`ts\n${error.stack}\n\`\`\`||`,
                        ].join("\n"),
                        timestamp: new Date().toISOString(),
                    },
                ],
                allowedMentions: {parse: []},
                username: "DisBot Bug Reporter",
                avatarURL: client.user?.displayAvatarURL(),
                appliedTags: ["1366430372484878537", "1366430599811694622"],
                threadName: `Bug Report - ${interaction.user.tag} (${interaction.user.id}) - Interaction`,
            });

            await interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user?.id)} Your error report has been sent to the developers. Thank you for your help!`,
                components: [],
                embeds: [],
            });
        });
    }

}