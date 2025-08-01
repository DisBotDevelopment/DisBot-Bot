import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    RoleSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {database} from "../../../../main/database.js";

export default {
    id: "ticket-button-manage-edit",

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
                .setCustomId("ticket-set-button-handler-sec")
                .setPlaceholder("📁  Set a Ticket Handler")
                .setDefaultRoles([ticketbuttons?.Handlers[0] as string])
                .setMinValues(1)
                .setMaxValues(1)
        );
        const deletsec =
            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId("ticket-set-button-category-sec")
                    .setPlaceholder("📁  Set a Category")
                    .setDefaultChannels([ticketbuttons?.CategoryId as string])
                    .addChannelTypes(ChannelType.GuildCategory)
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

        if (ticketbuttons?.TranscriptChannelId) {
            sec2.components[0].setDefaultChannels([ticketbuttons?.TranscriptChannelId]);
        }

        const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("ticket-set-button-TicketChannelName-button")
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
                .setLabel("Add an Modal")
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
                `## Ticket Editor`,
                ``,
                `**Ticket Button ID**: \`${uuids}\``,
                `**Ticket Channel Name**: \`${ticketbuttons?.TicketChannelName}\``,

                ``,
                `> Edit the Handler, Category, Blacklist Role, Transscript Channel and the Channel Name`,
                `> You can also set the Open Message, Edit the Embed and add a Modal`,
                `> Save the Ticket Option when you are done`,
                `> If you are done you can save the Ticket Option`,
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
