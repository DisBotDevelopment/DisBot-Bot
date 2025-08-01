import {
    ActionRow,
    ActionRowBuilder,
    AnyComponentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ComponentType,
    EmbedBuilder,
    MessageActionRowComponent,
    MessageFlags,
    ModalSubmitInteraction,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-menu-option-create",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const nameinput = interaction.fields.getTextInputValue(
            "ticket-menu-option-create-name"
        );
        const descriptioninput = interaction.fields.getTextInputValue(
            "ticket-menu-option-create-description"
        );
        const emojiinput = interaction.fields.getTextInputValue(
            "ticket-menu-option-create-emoji"
        );
        const messageid = interaction.customId.split(":")[1];

        const placeholder = interaction.fields.getTextInputValue(
            "ticket-menu-option-set-placehoder"
        );

        const message = await interaction.channel?.messages.fetch(messageid);
        if (!message) throw new Error("Message not found!");

        const uuids = randomUUID();
        const newOption = {
            label: nameinput,
            value: uuids,
            description: descriptioninput || undefined,
            emoji: emojiinput || undefined,
        };

        let rows =
            (message.components as ActionRow<MessageActionRowComponent>[]) || [];
        let updatedRows: ActionRowBuilder<AnyComponentBuilder>[] = [];
        let optionAdded = false;

        // Suche nach existierenden StringSelectMenus und versuche, die Option hinzuzufügen
        updatedRows = rows
            .filter((row) =>
                row.components.some(
                    (component) => component.type === ComponentType.StringSelect
                )
            )
            .map((row) => {
                const rowBuilder = ActionRowBuilder.from(
                    row as any
                ) as ActionRowBuilder<StringSelectMenuBuilder>;
                const selectMenu = rowBuilder.components.find(
                    (component) => component instanceof StringSelectMenuBuilder
                ) as StringSelectMenuBuilder;

                if (selectMenu && selectMenu.options.length < 25 && !optionAdded) {
                    selectMenu.addOptions(newOption);
                    optionAdded = true;
                }

                return rowBuilder;
            });

        // Falls keine Option hinzugefügt wurde, neues Menü erstellen
        if (!optionAdded) {
            const newMenu = new StringSelectMenuBuilder()
                .setCustomId(`ticket-selectmenu`)
                .setPlaceholder(placeholder || "Select an option")
                .addOptions(newOption);
            // FIX UUID AND EMBED EDITOR + todo and TICKET UI...
            const newRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(newMenu);
            updatedRows.push(newRow);
        }

        // Bearbeite die Nachricht mit aktualisierten Komponenten
        await message.edit({
            components: updatedRows.map((row) => row.toJSON() as any),
        });

        // Ticket Menu

        await database.ticketSetups.create({
            data: {
                GuildId: interaction.guild?.id,
                CategoryId: null,
                Handlers: null,
                TicketBlacklistRoles: [],
                TranscriptChannelId: null,
                CustomId: uuids,
                MessageTempleateId: null,
                HasModal: false,
            }
        });

        const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("ticket-set-menu-handler-sec")
                .setPlaceholder("📁  Set a Ticket Manager Role")
                .setMinValues(1)
                .setMaxValues(1)
        );
        const deletsec =
            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId("ticket-set-menu-category-sec")
                    .setPlaceholder("📁 Set a Category/Channel")
                    .addChannelTypes([ChannelType.GuildCategory, ChannelType.GuildText])
                    .setMinValues(1)
                    .setMaxValues(1)
            );
        const sec1 = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("ticket-set-menu-blacklistrole-sec")
                .setPlaceholder("📁  Set a Blacklist Role")
                .setMinValues(1)
                .setMaxValues(1)
        );

        const sec2 = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId("ticket-set-menu-transsript-sec")
                .setPlaceholder("📁  Set a Transscript Channel")
                .addChannelTypes(ChannelType.GuildText)
                .setMinValues(1)
                .setMaxValues(1)
        );

        const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("ticket-set-menu-channelname-button")
                .setLabel("Set Channel Name")
                .setEmoji("<:renamesolid24:1259433901554929675>")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("ticket-set-menu-thread-button:" + uuids)
                .setLabel("Use Ticket Thread")
                .setEmoji("<:threds:1199381322209165334>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("ticket-set-menu-messages:" + uuids)
                .setLabel("Set Ticket Messages")
                .setEmoji("<:setting:1260156922569687071>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("ticket-set-menu-moadl-button")
                .setLabel("Add an Modal")
                .setEmoji("<:add:1260157236043583519>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("ticket-set-menu-button")
                .setEmoji("<:save:1260157401496031244>")
                .setLabel("Save the Ticket Option")
                .setStyle(ButtonStyle.Success)
        );

        const embed = new EmbedBuilder().setDescription(
            [
                `## Ticket Creator`,
                ``,
                `**Ticket Menu ID**: \`${uuids}\``,
                `**Ticket Menu Name**: \`${nameinput}\``,
                `**Ticket Menu Description**: \`${descriptioninput ? descriptioninput : "No Description"
                }\``,
                `**Ticket Menu Emoji**: \`${emojiinput ? emojiinput : "No Emoji"}\``,
                `**Ticket Menu Message ID**: \`${messageid}\``,
                ``,
                `> You need to setup the required fields to make the ticket menu work properly`,
                `> You can setup the required fields by clicking the buttons below`,
                `> And use the Select Menus to setup the required fields`,
                `> You can also setup the optional fields by clicking the buttons below`,
                `> And use the Select Menus to setup the optional fields`,
                `> After setting up the required fields and optional fields`,
                `> Click the Save the Ticket Option button to save the Ticket Option`,
                ``,
            ].join("\n")
        );

        return interaction.reply({
            content: `${message?.url}|${message?.id}|${uuids}`,
            components: [row, deletsec, sec1, sec2, button],
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    },
};
