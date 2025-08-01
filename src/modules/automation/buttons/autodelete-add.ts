import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    RoleSelectMenuBuilder,
    TextDisplayBuilder,
    UserSelectMenuBuilder
} from "discord.js";
import {randomUUID} from "crypto";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "autodelete-add",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = randomUUID();

        await database.autoDeletes.create({
            data: {
                UUID: uuid,
                GuildId: interaction.guildId
            }
        });


        const container = new ContainerBuilder()

        container
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent([
                        `> **Select a channel to add AutoDelete**`,
                    ].join("\n"))
            )
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
                    `> **If your are done you can click the button below to save the setup**`,
                ].join("\n"))
        )
            .addActionRowComponents(
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("autodelete-add-save:" + uuid.toString())
                            .setLabel("Activate AutoDelete Setup")
                            .setStyle(ButtonStyle.Success)
                            .setEmoji("<:check:1320090167444377713>")
                    )
            );


        await interaction.reply({
            components: [container],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });


    }
};
