import colors from "colors";
import {
    ActionRowBuilder, AnySelectMenuInteraction,
    ButtonBuilder, ButtonInteraction,
    ButtonStyle, ChatInputCommandInteraction,
    ContainerBuilder, ContextMenuCommandInteraction, Interaction,
    MessageFlags, ModalSubmitInteraction, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize,
    TextDisplayBuilder,
    WebhookClient
} from "discord.js";
import {convertToEmojiToPng} from "./emojis.js";
import {LoggingAction} from "../enums/loggingTypes.js";
import {Logger} from "../main/logger.js";
import {Config} from "../main/config.js";
import {Octokit} from "@octokit/core"

colors.enable();

export async function errorHandler(interaction: ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction | ChatInputCommandInteraction | ContextMenuCommandInteraction, client: any, error: Error, customMessage?: string, customDescription?: string) {
    Logger?.error({
        timestamp: new Date().toISOString(),
        level: "error",
        label: "InteractionHandler",
        message: `Error handling interaction: ${error instanceof Error ? error.message : String(error)}`,
        botType: Config.BotType.toString() || "Unknown",
        action: LoggingAction.Interaction,
    });

    if (!interaction.deferred) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        })
    }

    await interaction.editReply({
        components: [
            new ContainerBuilder()
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent([
                                    `### ${await convertToEmojiToPng("error")} ${customMessage ? customMessage : "Process and Action Failed"}`,
                                    customDescription
                                ].join("\n"))
                        )
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setCustomId("report-error")
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("Report Error")
                                .setEmoji("<:error:1366426689961459893>")
                        )
                )
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent([
                            `||\`\`\`${error as Error}\`\`\`||`
                        ].join("\n"))
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setSpacing(SeparatorSpacingSize.Small)
                        .setDivider(true)
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent([
                                    `## ${await convertToEmojiToPng("error")} Follow this Steps!`,
                                    `-# **Steps you can do**`,
                                    `-# - Check your Action or Input.`,
                                    `-# - Check the Error Message and the Error Details below.`,
                                    `-# - Check Github and Discord for this problem.`,
                                    `-# - If there is no problem from you side and on Github or Discord then click \"Report Error\"`,
                                    `-# - Thanks for your Report - You will see a message with the Reports Liked.`,
                                ].join("\n"))
                        )
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setURL("https://doc.xyzhub.link/s/disbot/doc/troubleshooting-8PWsSMRNvH")
                                .setLabel("Read More")
                                .setEmoji("<:outline:1438974310042697909>")
                        )
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

        const issue = await exportToGithubIssues(
            `Bug Report - ${interaction.user.tag} (${interaction.user.id}) - Interaction`,
            [
                `## Error Report:`,
                `> **User:** ***\`${interaction.user.username}\`*** (\`${interaction.user.id}\`)`,
                `> **Error:** \`${error.name}\``,
                `>  - \`${error.message}\``,
                `> **Interaction Id**: \`${interaction.id}\``,
                `> **Interaction Type:** \`${interaction.type == 2 ? "Application Command" : interaction.type == 3 ? "Message Component" : interaction.type == 5 ? "Modal Submit" : "Unknown"}\``,
                `> **Interaction Name/ID:** \`${interactionName}\``,
                ``,
                `## Error Stack Trace:`,
                ``,
                `\`\`\`ts\n${error.stack}\n\`\`\``,
            ].join("\n")
        )

        if (!client.user) throw new Error("Client user is not defined");
        const message = await webHookClient.send({
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

        await interaction.editReply({
            components: [
                new ContainerBuilder()
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent([
                                        `## ${await convertToEmojiToPng("check")} Successfully sent your Error Report to the Discord!\n-# View your Bug Report on the Discord\n-# - https://discord.com/channels/1084507523492626522/${message.channel_id}/${message.id}\n-# View your Bug Report on the GitHub\n-# - ${issue}`,
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


async function exportToGithubIssues(title: string, message: string) {
    if (!Config.Logging.GitHubAPIToken) return

    const octokit = new Octokit({
        auth: Config.Logging.GitHubAPIToken
    })

    const issue = await octokit.request('POST /repos/DisBotDevelopment/DisBot-Bot/issues', {
        owner: 'DisBotDevelopment',
        repo: 'DisBot-Bot',
        title: String(title),
        body: String(message),
        assignees: [
            'xyzjesper'
        ],
        labels: [
            'Automation', "Bug-Report"
        ],
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    return issue.url
}

export async function errorSetupForNodeJs() {

    // Unhandled Rejection Event
    process.on("unhandledRejection", async (reason, promise) => {
        Logger.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "UnhandledRejection",
            message: `Unhandled Rejection at: ${promise}, reason: ${reason}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });
    });

    // Uncaught Exception Event
    process.on("uncaughtException", async (err) => {
        Logger.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "UncaughtException",
            message: `Uncaught Exception: \n${err}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });
    });

    // AggregateError Handling
    process.on("uncaughtException", (error) => {
        Logger.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "AggregateError",
            message: `AggregateError: \n${error}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });
    });

    // Uncaught Exception Monitor Event
    process.on("uncaughtExceptionMonitor", async (err, origin) => {
        Logger.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "UncaughtExceptionMonitor",
            message: `Uncaught Exception Monitor: \n${err}\nOrigin: ${origin}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other,
        });
    });
}