import "dotenv/config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    RoleSelectMenuBuilder,
    StringSelectMenuInteraction,
    TextDisplayBuilder
} from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";

import { ExtendedClient } from "../../../types/client.js";
import { database } from "../../../main/database.js";

export default {
    id: "automation-select",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {
            if (!client.user) throw new Error("Client user is not defined");

            const toggleData = await database.guildFeatureToggles.findFirst({
                where: {
                    GuildId: interaction.guild.id
                }
            });

            switch (value) {
                case "autoroles": {

                    const autorolesData = await database.autoRoles.findMany({
                        where: {
                            GuildId: interaction.guild?.id,
                        }
                    });

                    const allRoles = autorolesData.map((role) => {
                        return {
                            id: role.RoleId,
                        }
                    })

                    interaction.update({
                        flags: MessageFlags.IsComponentsV2,
                        components: [
                            new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent([
                                `## ${await convertToEmojiPng("packageplus", client.user?.id)} Autoroles`,
                                ``,
                                `### **Manage all autoroles**`,
                                `> Toggle the automation on or off`,
                                `> Add Roles to the automation`,
                                `> Remove Roles from the automation`,
                                `### **Data**`,
                                `> *Roles*: ${allRoles.map((role) => ` <@&${role.id}> `).join(", ") || "None"}`,
                                `> *Toggle*: ${toggleData?.AutorolesEnabled ? `${await convertToEmojiPng("toggleon", client.user.id)} Enabled` : `${await convertToEmojiPng("toggleoff", client.user.id)} Disabled`}`,
                                ``
                            ].join("\n"))).addActionRowComponents(
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("autoroles-toggle")
                                        .setLabel(toggleData?.AutorolesEnabled ? "Disable" : "Enable")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setEmoji(toggleData?.AutorolesEnabled ? "<:toggleon:1301864515838672908>" : "<:toggleoff:1301864526848987196>"),
                                    new ButtonBuilder()
                                        .setCustomId("autoroles-refresh")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setEmoji("<:refresh:1260140823106813953>"),
                                )).addActionRowComponents(
                                    new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                                        new RoleSelectMenuBuilder()
                                            .setCustomId("autoroles-add")
                                            .setPlaceholder("Add Roles to the automation")
                                            .setMinValues(1)
                                            .setMaxValues(25)
                                            .setDisabled(false)
                                    ))
                                .addActionRowComponents(
                                    new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                                        new RoleSelectMenuBuilder()
                                            .setCustomId("autoroles-remove")
                                            .setPlaceholder("Remove Roles to the automation")
                                            .setMinValues(1)
                                            .setMaxValues(25)
                                            .setDisabled(false)
                                    ))
                        ]
                        ,
                    })
                }
                    break;
                case "autopublish": {

                    const autopublishData = await database.autoPublish.findFirst({
                        where: {
                            GuildId: interaction.guild?.id,
                        }
                    });


                    interaction.update({
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
                                `> *Channels*: ${autopublishData?.Channels.map((channel) => ` <#${channel}> `).join(", ") || "None"}`,
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

                    break;
                case "autoreact": {

                    const autoreactData = await database.autoReacts.findMany({
                        where: {
                            GuildId: interaction.guild?.id,
                        }
                    })

                    let channels = autoreactData.map((channel) => ` <#${channel.ChannelId}> `).join(", ")
                    let emojis = autoreactData.map((emoji) => ` ${emoji.Emoji} `).join(", ")

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
                                `> *Channels*: ${channels || "None"}`,
                                `> *Emojis*: ${emojis || "None"}`,
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
                        ]
                        ,
                    })

                }
                    break;
                case "autodelete": {
                    interaction.update({
                        components: [
                            new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent([`## ${await convertToEmojiPng("trash", client.user?.id)} Autodelete`,
                                ``,
                                `### **Manage all autodeletes**`,
                                `> Toggle the automation on or off`,
                                `> Add Channel and Emoji to the automation`,
                                `> Remove Channel and Emoji from the automation`,
                                ``].join("\n"))).addActionRowComponents(
                                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                                        new ButtonBuilder()
                                            .setCustomId("autodelete-add")
                                            .setLabel("Add Setup")
                                            .setStyle(ButtonStyle.Secondary)
                                            .setEmoji("<:add:1260157236043583519>"),
                                        new ButtonBuilder()
                                            .setCustomId("autodelete-manage")
                                            .setStyle(ButtonStyle.Secondary)
                                            .setLabel("Manage Setups")
                                            .setEmoji("<:setting:1260156922569687071>"),
                                    ))
                        ]
                        , flags: MessageFlags.IsComponentsV2
                    })
                }
                    break;
            }

        }
    }
};
