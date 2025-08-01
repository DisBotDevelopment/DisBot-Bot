import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    RoleSelectMenuBuilder,
    Snowflake
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {database} from "../../../../main/database.js";

export default {
    id: "ticket-menu-manage-edit",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuids = interaction.customId.split(":")[1];

        const ticketbuttons = await database.ticketSetups.findFirst({
            where: {
                CustomId: interaction.customId.split(":")[1]
            }
        });

        const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("ticket-set-menu-handler-sec")
                .setPlaceholder("📁  Set a Ticket Handler")
                .setDefaultRoles()
                .setMinValues(1)
                .setMaxValues(1)
        );
        const deletsec =
            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId("ticket-set-menu-category-sec")
                    .setPlaceholder("📁 Set a Category")
                    .setDefaultChannels([ticketbuttons?.CategoryId as Snowflake])
                    .addChannelTypes(ChannelType.GuildCategory)
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

        if (ticketbuttons?.TranscriptChannelId) {
            sec2.components[0].setDefaultChannels([ticketbuttons.TranscriptChannelId]);
        }

        const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("ticket-set-menu-TicketChannelName-button")
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

        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setDescription(
                [
                    `## Ticket Editor`,
                    ``,
                    `**Ticket Menu ID**: \`${uuids}\``,
                    `**Ticket Menu Name**: \`${ticketbuttons?.TicketChannelName}\``,
                    ``,
                    `> You need to setup the required fields to make the ticket menu work properly`,
                    `> You can setup the required fields by clicking the buttons below`,
                    `> And use the Select Menus to setup the required fields`,
                    `> You can also setup the optional fields by clicking the buttons below`,
                    `> And use the Select Menus to setup the optional fields`,
                    `> After setting up the required fields and optional fields`,
                    `> Click the Save the Ticket Option button to save the Ticket Option`,
                    ``
                ].join("\n")
            );

        return interaction.reply({
            components: [row, deletsec, sec1, sec2, button],
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    }
};
