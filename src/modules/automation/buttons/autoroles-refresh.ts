import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    RoleSelectMenuBuilder,
    TextDisplayBuilder
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "guildAutoRoles-refresh",

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
        const guildAutoRolesData = await database.guildAutoRoles.findMany({
            where: {
                GuildId: interaction.guild?.id
            }
        });

        const allRoles = guildAutoRolesData.map(role => {
            return {
                id: role.RoleId,
            }
        })

        await interaction.update({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent([
                    `## ${await convertToEmojiPng("packageplus", client.user?.id)} AutoRoles`,
                    ``,
                    `### **Manage all AutoRoles**`,
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
};
