import {
    ActionRow,
    ActionRowBuilder,
    ButtonInteraction, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder,
    MessageFlags,
    ModalBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-channel-type",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const modal = new ModalBuilder();

        const uuid = interaction.customId.split(":")[1]
        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: uuid
            }
        });

        interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            "> ### Use a Thread to create you Ticket\n To use a Thread, select a the Thread type and setup a Parent Channel."
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId("ticket-add-component-channel-type-thread:" + uuid)
                                .setPlaceholder("Select Channel for Thread Type")
                                .setChannelTypes(ChannelType.GuildText)
                        )
                    )
                    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small))
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            "> ### Use a Channel to create you Ticket\n To use a Channel, select a the Channel type and setup a Parent Category."
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId("ticket-add-component-channel-type-channel:" + uuid)
                                .setPlaceholder("Select Category for Channel Type")
                                .setChannelTypes(ChannelType.GuildCategory)
                        )
                    )
            ]
        })
    }
};
