import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    RoleSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";

export default {
    id: "tag-create-name-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const tagID = interaction.fields.getTextInputValue(
            "tag-create-name-input-id"
        );

        const uuids = randomUUID();

        const data = await database.tags.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                TagId: tagID
            }
        });

        if (!client.user) throw new Error("Client user is not cached");

        if (data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "tag",
                    client.user.id
                )} The tag with the name \`${tagID}\` already exists.`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.tags.create({
            data: {
                GuildId: interaction.guild?.id,
                TagId: tagID,
                UUID: uuids,
                MessageId: null,
                IsEnabled: true,
                IsShlashCommand: false,
                ShlashCommandId: null,
                IsTextInputCommand: false,
            }
        });

        const embed = new EmbedBuilder()
            .setDescription(
                [
                    `## ${await convertToEmojiPng(
                        "tag",
                        client.user.id
                    )} Tag \`\`${tagID}\`\` created`,
                    ``,
                    `> 1. Set a Message template`,
                    `> 2. Selcet the Option to configure the Tag`,
                    `> 3. Setup a Role-Permission for the Tag`,
                    `> 4. Save the Tag and use it`,
                    ``
                ].join("\n")
            )
            .setColor("#2B2D31")
            .setFooter({
                text: `UUID: ${uuids}`
            });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("tag-create-set-message:" + uuids)
                .setLabel("Set a Message")
                .setEmoji("<:message:1322252985702551767>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("tag-create-set-iscommand:" + uuids)
                .setLabel("Toggle Slash Command")
                .setEmoji("<:terminal:1260322426323996783>")
                .setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("tag-create-set-istextcommand:" + uuids)
                .setLabel("Toggle Text Command")
                .setEmoji("<:renamesolid24:1259433901554929675>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("tag-create-save:" + uuids)
                .setLabel("Finish and validate")
                .setEmoji("<:check:1320090167444377713>")
                .setStyle(ButtonStyle.Secondary)
        );

        const permissionselect =
            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId("tag-create-set-permission:" + uuids)
                    .setPlaceholder("Select a Role")
                    .setMinValues(1)
                    .setMaxValues(1)
            );

        interaction.reply({
            embeds: [embed],
            components: [row, row2, permissionselect],
            flags: MessageFlags.Ephemeral
        });
    }
};
