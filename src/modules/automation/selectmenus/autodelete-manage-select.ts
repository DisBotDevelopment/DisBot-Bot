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
    TextDisplayBuilder,
    UserSelectMenuBuilder
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "autodelete-manage-select",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {

            const data = await database.autoDeletes.findFirst({
                where: {
                    UUID: interaction.customId.split(":")[1]
                }
            });

            if (!client.user) throw new Error("Client user is not defined");

            if (!data) {
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} No AutoDelete setup found with UUID: \`${value}\``,
                    flags: MessageFlags.Ephemeral
                });
                continue;
            }

            const uuid = data.UUID || value;

            interaction.reply({
                components: [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent([
                                `**Channel Name:** ${data.ChannelId ? `<#${data.ChannelId}>` : "N/A"}\n**UUID:** ${data.UUID}`,
                                `**Whitelisted Roles:** ${data.WhitelistedRoles.length ? data.WhitelistedRoles.map((r) => `<@&${r}>`).join(", ") : "None"}`,
                                `**Whitelisted Users:** ${data.WhitelistedUsers.length ? data.WhitelistedUsers.map((u) => `<@${u}>`).join(", ") : "None"}`,
                                `**Whitelisted Messages:** ${data.WhitelistedMessages.length ? data.WhitelistedMessages.map((c) => `${c}`).join(", ") : "None"}`,
                                `**Is Active:** ${data.IsActive ? "Yes" : "No"}`,
                                `**Time to Delete:** ${data.Time} ms`,
                            ].join("\n")))
                        .addActionRowComponents(
                            new ActionRowBuilder<ChannelSelectMenuBuilder>()
                                .addComponents(
                                    new ChannelSelectMenuBuilder()
                                        .setCustomId("autodelete-add-channel:" + uuid.toString())
                                        .setPlaceholder("Select a channel to add AutoDelete")
                                        .setChannelTypes([ChannelType.GuildText])
                                        .setMinValues(1)
                                        .setMaxValues(1)
                                )
                        ).addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent([
                                `> **Add a whitelist message/role/user and setup a autoDelete timer**`,
                                `> **You can add multiple whitelisted messages/roles/users**`,
                            ].join("\n"))
                    ).addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("autodelete-add-timer:" + uuid.toString())
                                    .setLabel("Add Timer")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji("<:timer:1321939051921801308>")
                            )
                    )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("autodelete-add-message:" + uuid.toString())
                                        .setLabel("Add Whitelisted Message")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setEmoji("<:message:1322252985702551767>"),
                                ))
                        .addActionRowComponents(
                            new ActionRowBuilder<RoleSelectMenuBuilder>()
                                .addComponents(
                                    new RoleSelectMenuBuilder()
                                        .setCustomId("autodelete-add-role:" + uuid.toString())
                                        .setPlaceholder("Select a role to whitelist")
                                        .setMinValues(0)
                                        .setMaxValues(1)
                                )
                        ).addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>()
                            .addComponents(
                                new UserSelectMenuBuilder()
                                    .setCustomId("autodelete-add-user:" + uuid.toString())
                                    .setPlaceholder("Select a user to whitelist")
                                    .setMinValues(0)
                                    .setMaxValues(1)
                            )
                    ).addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent([
                                `> **If your are done you can click the button below to aktivate or deactivate the AutoDelete setup**`,
                            ].join("\n"))
                    )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("autodelete-toggle:" + uuid.toString())
                                        .setLabel("Activate AutoDelete Setup")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setEmoji("<:check:1376986390117482556>"),
                                    new ButtonBuilder()
                                        .setCustomId("autodelete-manage")
                                        .setLabel("Go Back")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setEmoji("<:check:1301119279088799815>")
                                )
                        )

                ],
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
            })
        }
    }
}