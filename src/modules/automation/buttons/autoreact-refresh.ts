import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    TextDisplayBuilder
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "autoreact-refresh",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not cached.");

        const toggleData = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild?.id,
            }
        });
        const autoreactData = await database.autoReacts.findMany({
            where: {
                GuildId: interaction.guild?.id,
            }
        })

        let channels = []
        let emojis = []
        autoreactData.map((data) => {
            channels.push(data.ChannelId)
            emojis.push(data.Emoji)
        })

        await interaction.update({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder()
                    .setContent([`## ${await convertToEmojiPng("smileplus", client.user?.id)} Autoreact`,
                        ``,
                        `### **Manage all autoreact**`,
                        `> Toggle the automation on or off`,
                        `> Add Channel and Emoji to the automation`,
                        `> Remove Channel and Emoji from the automation`,
                        `### **Data**`,
                        `> *Channels*: ${channels.map((r) => r ? `<#${r}>` : "N/A")}`,
                        `> *Emojis*: ${emojis.map((r) => r ? r : "N/A")}`,
                        `> -# This list is from all the channels and emojis in the database`,
                        `> *Toggle*: ${toggleData?.AutoreactEnabled ? `${await convertToEmojiPng("toggleon", client.user.id)} Enabled` : `${await convertToEmojiPng("toggleoff", client.user.id)} Disabled`} `,
                        ``].join("\n"))).addActionRowComponents(
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("autoreact-toggle")
                            .setLabel(toggleData?.AutopublishEnabled ? "Disable" : "Enable")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(toggleData?.AutopublishEnabled ? "<:toggleon:1301864515838672908>" : "<:toggleoff:1301864526848987196>"),
                        new ButtonBuilder()
                            .setCustomId("autoreact-refresh")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:refresh:1260140823106813953>"),
                    ),
                ).addActionRowComponents(
                    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId("autoreact-add")
                            .setPlaceholder("Add Channel to the automation")
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setDisabled(false)
                    )).addActionRowComponents(
                    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId("autoreact-remove")
                            .setPlaceholder("Remove Channel from the automation")
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setDisabled(false)
                    ))
            ],
        })
    }
};
