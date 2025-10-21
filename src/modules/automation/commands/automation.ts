import {
    ActionRowBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    ContainerBuilder,
    EmbedBuilder,
    InteractionContextType,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    TextDisplayBuilder
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {PermissionType} from "../../../enums/permissionType.js";

export default {
    interactionName: "automation",
    interactionDescription: "Automation",
    options: {
        once: false,
        permission: PermissionType.Automation,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
        userPermissions: [PermissionFlagsBits.ManageChannels],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    data: new SlashCommandBuilder()
        .setName("automations")
        .setDescription("Manage all automations")
        .setDescriptionLocalizations({
            de: "Automatisierungen verwalten",
        })
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    help: {
        name: 'Automation',
        description: 'Manage all automations',
        usage: '/automation',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/automation'
    },

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});
        if (!client.user) throw new Error("Client user is not defined");
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("automation-select")
                .setPlaceholder("Select an automation")
                .addOptions(
                    {
                        label: "AutoRoles",
                        value: "guildAutoRoles",
                        description: "Automatically assign roles to new members",
                        emoji: "<:packageplus:1362545377030701167>",
                    },
                    {
                        label: "AutoPublish",
                        value: "autopublish",
                        description: "Automatically publish messages in announcement channels",
                        emoji: "<:megaphone:1362545380557848689>",
                    },
                    {
                        label: "AutoReact",
                        value: "autoreact",
                        description: "Automatically react to messages",
                        emoji: "<:smileplus:1362545378075082853>",
                    }, {
                        label: "AutoDelete",
                        value: "autodelete",
                        description: "Automatically delete messages",
                        emoji: "<:trash:1259432932234367069>",
                    },
                )
        )
        interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent([
                            `## ${await convertToEmojiToPng("workflow")} Automation`,
                            ``,
                            `**Manage all automations**`,
                            `> ${await convertToEmojiToPng("packageplus")} AutoRoles - Automatically assign roles to new members`,
                            `> ${await convertToEmojiToPng("megaphone")} AutoPublish - Automatically publish messages in announcement channels`,
                            `> ${await convertToEmojiToPng("smileplus")} AutoReact - Automatically react to messages`,
                            `> ${await convertToEmojiToPng("error")} AutoDelete - Automatically delete messages \`NEW\``,
                            ``
                        ].join("\n"))
                    )
                    .addActionRowComponents(row)
            ],
        });
    }
};
