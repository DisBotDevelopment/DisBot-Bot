import * as Sentry from "@sentry/node";
import colors from "colors";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder, Interaction,
    MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize,
    TextDisplayBuilder,
    WebhookClient
} from "discord.js";
import {convertToEmojiPng} from "./emojis.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import {Logger} from "../main/logger.js";
import {Config} from "../main/config.js";

colors.enable();

export async function errorHandler(interaction: Interaction, client: any, error: Error) {
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
            components: [
                new ContainerBuilder()
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent([
                                        `## ${await convertToEmojiPng("error", client.user?.id)} An error occurred while processing your interaction.`,
                                        `-# You can click the button below to report this issue to the developers.`
                                    ].join("\n"))
                            )
                            .setButtonAccessory(new ButtonBuilder()
                                .setCustomId("report-error")
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("Report Error")
                                .setEmoji("<:error:1366426689961459893>"))
                    )
                    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent([
                                        `> ### ${await convertToEmojiPng("info", client.user?.id)} What will happen if you do it.`,
                                        `> -# You will share you public user ID`,
                                        `> -# You will send an Error stack trace`,
                                        `> -# You will send Interaction related data`,
                                        `> -# \"Public Database Id's\" like uuids of you setup and or a not sensitive ID`,
                                        `> -# You will send a contact for the devs to contact you!`,
                                    ].join("\n"))
                            )
                            .setButtonAccessory(new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setURL("https://doc.xyzhub.link/s/disbot/doc/troubleshooting-8PWsSMRNvH")
                                .setLabel("Read More")
                                .setEmoji("<:link:1321941111090057248>"))
                    )


            ],
            flags: MessageFlags.IsComponentsV2,
        })

        const collector = interaction.channel?.createMessageComponentCollector({
            filter: (i: {
                customId: string;
                user: { id: any; };
            }) => i.customId === "report-error" && i.user.id === interaction.user.id,
            time: 60000,
        });

        collector?.on("collect", async (i: { deferUpdate: () => any; }) => {
            await i.deferUpdate()

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
                withComponents: true,
                flags: MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(
                                    [
                                        `<:error:1366430438444236911> **Error Report**`,
                                        `> **User:** ***\`${interaction.user.username}\`*** (\`${interaction.user.id}\`)`,
                                        `> **Error:** \`${error.name}\``,
                                        `>  - \`${error.message}\``,
                                        `> **Interaction Id**: \`${interaction.id}\``,
                                        `> **Interaction Type:** \`${interaction.type == 2 ? "Application Command" : interaction.type == 3 ? "Message Component" : interaction.type == 5 ? "Modal Submit" : "Unknown"}\``,
                                        `> **Interaction Name/ID:** \`${interactionName}\``,
                                        `> **Timestamp**:  <t:${Math.floor(new Date().getTime() / 1000)}:F>`
                                    ].join("\n")
                                )
                        ),
                    new TextDisplayBuilder()
                        .setContent([
                            `||\`\`\`ts\n${error.stack}\n\`\`\`||`
                        ].join("\n"))
                ],
                allowedMentions: {
                    parse: []
                },
                username: "DisBot Bug Reporter",
                avatarURL:
                    client.user?.displayAvatarURL(),
                appliedTags:
                    ["1366430372484878537", "1366430599811694622"],
                threadName:
                    `Bug Report - ${interaction.user.tag} (${interaction.user.id}) - Interaction`,
            })
            ;

            await interaction.editReply({
                components: [
                    new ContainerBuilder()
                        .addSectionComponents(
                            new SectionBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder()
                                        .setContent([
                                            `## ${await convertToEmojiPng("check", client.user?.id)} Successfully sent your Error Report to the Discord!`,
                                        ].join("\n"))
                                )
                                .setButtonAccessory(new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setURL("https://disbot.app/discord")
                                    .setLabel("Join our Discord")
                                    .setEmoji("<:discord_cube:1325896195083604080>"))
                        )

                ],
                flags: MessageFlags.IsComponentsV2,
            });
        });
    }

}