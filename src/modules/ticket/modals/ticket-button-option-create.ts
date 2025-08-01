import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    EmbedBuilder,
    MessageActionRowComponent,
    MessageFlags,
    ModalSubmitInteraction,
    RoleSelectMenuBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-button-option-create",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        await interaction.deferReply({flags: MessageFlags.Ephemeral})
        const nameInput = interaction.fields.getTextInputValue(
            "ticket-button-option-create-name"
        );
        const emojiInput = interaction.fields.getTextInputValue(
            "ticket-button-option-create-emoji"
        );
        const style = interaction.fields.getTextInputValue(
            "ticket-button-option-create-style"
        );

        const messageId = interaction.customId.split(":")[1];
        const message = await interaction.channel?.messages.fetch(messageId);
        const uuids = randomUUID();

        // Map styles
        let styles: number;
        if (style == "Primary") styles = 1;
        else if (style == "Secondary") styles = 2;
        else if (style == "Success") styles = 3;
        else if (style == "Danger") styles = 4;
        else styles = 3;

        let rows = message?.components as ActionRow<MessageActionRowComponent>[];

        // Helper: Validate row/component limits
        const maxComponentsPerRow = 5;
        const maxRows = 5;

        if (!rows) rows = [];

        if (rows.length === 0) {
            // No rows exist, create a new one
            const button = new ButtonBuilder()
                .setCustomId(uuids)
                .setLabel(nameInput)
                .setStyle(styles || ButtonStyle.Secondary);

            if (emojiInput) {
                button.setEmoji(emojiInput);
            }

            const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                button
            );

            await message?.edit({components: [newRow]});
        } else {
            // Handle adding to existing rows or creating a new one
            let lastRow = rows[rows.length - 1];

            if (lastRow.components.length >= maxComponentsPerRow) {
                if (rows.length >= maxRows) {
                    // Max rows reached
                    return await interaction.editReply({
                        content:
                            "Cannot add more buttons. The message has reached the maximum number of rows and components.",
                    });
                }
                // Create a new row if the last row is full
                const button = new ButtonBuilder()
                    .setCustomId(uuids)
                    .setLabel(nameInput)
                    .setStyle(styles || ButtonStyle.Secondary);

                if (emojiInput) {
                    button.setEmoji(emojiInput);
                }

                const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    button
                );
                rows.push(newRow as unknown as ActionRow<MessageActionRowComponent>);
            } else {
                // Add the button to the last row
                const button = new ButtonBuilder()
                    .setCustomId(uuids)
                    .setLabel(nameInput)
                    .setStyle(styles || ButtonStyle.Secondary);

                if (emojiInput) {
                    button.setEmoji(emojiInput);
                }

                lastRow.components.push(button as unknown as MessageActionRowComponent);
            }

            // Update the message
            await message?.edit({components: rows});
        }

        // Ticket Menu Database Entry
        await database.ticketSetups.create({
            data: {
                Handlers: [],
                CustomId: uuids,
                HasModal: false,
                Guilds: {
                    connect: {
                        GuildId: interaction.guild?.id
                    }
                }
            }
        })

        const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("ticket-set-button-handler-sec")
                .setPlaceholder("📁  Set a Ticket Manager Role")
                .setMinValues(1)
                .setMaxValues(1)
        );

        const deletsec =
            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId("ticket-set-button-category-sec")
                    .setPlaceholder("📁  Set a Category/Channel")
                    .addChannelTypes([ChannelType.GuildCategory, ChannelType.GuildText])
                    .setMinValues(1)
                    .setMaxValues(1)
            );

        const sec1 = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("ticket-set-button-blacklistrole-sec")
                .setPlaceholder("📁  Set a Blacklist Role")
                .setMinValues(1)
                .setMaxValues(1)
        );

        const sec2 = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId("ticket-set-button-transsript-sec")
                .setPlaceholder("📁  Set a Transscript Channel")
                .addChannelTypes(ChannelType.GuildText)
                .setMinValues(1)
                .setMaxValues(1)
        );

        const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("ticket-set-button-channelname-button:" + uuids)
                .setLabel("Set Channel Name")
                .setEmoji("<:renamesolid24:1259433901554929675>")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("ticket-set-button-thread-button:" + uuids)
                .setLabel("Use Ticket Thread")
                .setEmoji("<:threds:1199381322209165334>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("ticket-set-button-messages:" + uuids)
                .setLabel("Set Ticket Messages")
                .setEmoji("<:setting:1260156922569687071>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("ticket-set-button-moadl-button")
                .setLabel("Add a Modal")
                .setEmoji("<:add:1260157236043583519>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("ticket-set-button-button")
                .setEmoji("<:save:1260157401496031244>")
                .setLabel("Save the Ticket Option")
                .setStyle(ButtonStyle.Success)
        );

        const embed = new EmbedBuilder().setDescription(
            [
                `## Ticket Creator`,
                ``,
                `**Ticket Button ID**: \`${uuids}\``,
                `**Ticket Button Name**: \`${nameInput}\``,
                `**Ticket Button Style**: \`${style}\``,
                `**Ticket Menu Emoji**: \`${emojiInput ? emojiInput : "No Emoji"}\``,
                `**Ticket Menu Message ID**: \`${messageId}\``,
                ``,
                `> Set the Handler, Category, Blacklist Role, Transscript Channel and the Channel Name`,
                `> You can also set the Open Message, Edit the Embed and add a Modal`,
                `> Save the Ticket Option when you are done`,
                ``,
            ].join("\n")
        );

        await interaction.editReply({
            content: `${message?.url}|${message?.id}|${uuids}`,
            components: [row, deletsec, sec1, sec2, button],
            embeds: [embed],
        });
    },
}
;
