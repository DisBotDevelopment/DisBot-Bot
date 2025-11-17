import {
    ActionRow,
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder,
    MessageFlags,
    ModalBuilder, RoleSelectMenuBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle, UserSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-add-component-permission",

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
                            "> ### Use the buttons to add and View your roles & users. To remove users & roles use the show button"
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-permission-show:" + uuid)
                                .setLabel("Show Permissions")
                                .setEmoji("<:permissions:1277170947761111130>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId("ticket-add-component-permission-role:" + uuid)
                                .setPlaceholder("Select a Role to setup permissions")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId("ticket-add-component-permission-user:" + uuid)
                                .setPlaceholder("Select a User to setup permissions")
                        )
                    )
            ]
        })
    }
};
