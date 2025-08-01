import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    TextDisplayBuilder
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "autopublish-refresh",

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
        const autoPublishData = await database.autoPublish.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        });

        await interaction.update({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent([
                        `## ${await convertToEmojiPng("megaphone", client.user?.id)} AutoPublish`,
                        ``,
                        `### **Manage all autopublish**`,
                        `> Toggle the automation on or off`,
                        `> Add Channels to the automation`,
                        `> Remove Channels from the automation`,
                        `### **Data**`,
                        `> *Channels*: ${autoPublishData?.Channels.map((channel) => ` <#${channel}> `).join(", ") || "None"}`,
                        `> *Toggle*: ${toggleData?.AutorolesEnabled ? `${await convertToEmojiPng("toggleon", client.user.id)} Enabled` : `${await convertToEmojiPng("toggleoff", client.user.id)} Disabled`}`,
                        ``
                    ].join("\n"))
                ).addActionRowComponents(
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("autopublish-toggle")
                            .setLabel(toggleData?.AutopublishEnabled ? "Disable" : "Enable")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(toggleData?.AutopublishEnabled ? "<:toggleon:1301864515838672908>" : "<:toggleoff:1301864526848987196>"),
                        new ButtonBuilder()
                            .setCustomId("autopublish-refresh")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:refresh:1260140823106813953>"),
                    )).addActionRowComponents(
                    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId("autopublish-add")
                            .setPlaceholder("Add Channel to the automation")
                            .setMinValues(1)
                            .setMaxValues(25)
                            .setChannelTypes(ChannelType.GuildAnnouncement)
                            .setDisabled(false)
                    )).addActionRowComponents(
                    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId("autopublish-remove")
                            .setPlaceholder("Remove Channel from the automation")
                            .setMinValues(1)
                            .setMaxValues(25)
                            .setChannelTypes(ChannelType.GuildAnnouncement)
                            .setDisabled(false)
                    ))
            ]
            ,
        })
    }
};
