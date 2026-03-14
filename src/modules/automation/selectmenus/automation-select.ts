import "dotenv/config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ContainerBuilder,
    MessageFlags,
    RoleSelectMenuBuilder,
    StringSelectMenuInteraction,
    TextDisplayBuilder
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

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
                    GuildId: interaction.guild?.id ?? ""
                }
            });

            switch (value) {
                case "guildAutoRoles": {

                    const guildAutoRolesData = await database.guildAutoRoles.findMany({
                        where: {
                            GuildId: interaction.guild?.id,
                        }
                    });

                    const allRoles = guildAutoRolesData.map((role) => {
                        return {
                            id: role.RoleId,
                        }
                    })

                    interaction.update({
                        flags: MessageFlags.IsComponentsV2,
                        components: [
                            new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent([
                                `## ${await convertToEmojiToPng("packageplus")} AutoRoles`,
                                ``,
                                `### **Manage all AutoRoles**`,
                                `> Toggle the automation on or off`,
                                `> Add Roles to the automation`,
                                `> Remove Roles from the automation`,
                                `### **Data**`,
                                `> *Roles*: ${allRoles.map((role) => ` <@&${role.id}> `).join(", ") || "None"}`,
                                `> *Toggle*: ${toggleData?.AutorolesEnabled ? `${await convertToEmojiToPng("toggleon")} Enabled` : `${await convertToEmojiToPng("toggleoff")} Disabled`}`,
                                ``
                            ].join("\n"))).addActionRowComponents(
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("guildAutoRoles-toggle")
                                        .setLabel(toggleData?.AutorolesEnabled ? "Disable" : "Enable")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setEmoji(toggleData?.AutorolesEnabled ? "<:toggleon:1301864515838672908>" : "<:toggleoff:1301864526848987196>"),
                                    new ButtonBuilder()
                                        .setCustomId("guildAutoRoles-refresh")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setEmoji("<:refresh:1260140823106813953>"),
                                )).addActionRowComponents(
                                new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                                    new RoleSelectMenuBuilder()
                                        .setCustomId("guildAutoRoles-add")
                                        .setPlaceholder("Add Roles to the automation")
                                        .setMinValues(1)
                                        .setMaxValues(25)
                                        .setDisabled(false)
                                ))
                                .addActionRowComponents(
                                    new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                                        new RoleSelectMenuBuilder()
                                            .setCustomId("guildAutoRoles-remove")
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

                    const autopublishData = await database.guildAutoPublish.findFirst({
                        where: {
                            GuildId: interaction.guild?.id,
                        }
                    });


                    interaction.update({
                        flags: MessageFlags.IsComponentsV2,
                        components: [
                            new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent([
                                    `## ${await convertToEmojiToPng("megaphone")} AutoPublish`,
                                    ``,
                                    `### **Manage all autopublish**`,
                                    `> Toggle the automation on or off`,
                                    `> Add Channels to the automation`,
                                    `> Remove Channels from the automation`,
                                    `### **Data**`,
                                    `> *Channels*: ${autopublishData?.Channels.map((channel) => ` <#${channel}> `).join(", ") || "None"}`,
                                    `> *Toggle*: ${toggleData?.AutorolesEnabled ? `${await convertToEmojiToPng("toggleon")} Enabled` : `${await convertToEmojiToPng("toggleoff")} Disabled`}`,
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

                    const autoreactData = await database.guildAutoReacts.findMany({
                        where: {
                            GuildId: interaction.guild?.id,
                        }
                    })

                    const channels = autoreactData.map((channel) => ` <#${channel.ChannelId}> `).join(", ")
                    const emojis = autoreactData.map((emoji) => ` ${emoji.Emoji} `).join(", ")

                    await interaction.update({
                        flags: MessageFlags.IsComponentsV2,
                        components: [
                            new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder()
                                .setContent([`## ${await convertToEmojiToPng("smileplus")} Autoreact`,
                                    ``,
                                    `### **Manage all autoreact**`,
                                    `> Toggle the automation on or off`,
                                    `> Add Channel and Emoji to the automation`,
                                    `> Remove Channel and Emoji from the automation`,
                                    `### **Data**`,
                                    `> *Channels*: ${channels || "None"}`,
                                    `> *Emojis*: ${emojis || "None"}`,
                                    `> -# This list is from all the channels and emojis in the database`,
                                    `> *Toggle*: ${toggleData?.AutoreactEnabled ? `${await convertToEmojiToPng("toggleon")} Enabled` : `${await convertToEmojiToPng("toggleoff")} Disabled`} `,
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
                            new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent([`## ${await convertToEmojiToPng("trash")} Autodelete`,
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
