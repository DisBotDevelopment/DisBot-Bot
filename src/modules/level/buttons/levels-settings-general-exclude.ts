import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonComponent,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ContainerBuilder,
    MessageFlags,
    ModalBuilder,
    RoleSelectMenuBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorComponent,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    TextInputBuilder,
    UserSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-general-exclude",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent("Exclude Roles, User, and Channels from the Module.")
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Large)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId("levels-settings-general-exclude-users-add")
                                .setPlaceholder("Add users from the exclude.")
                                .setMaxValues(1)
                                .setMinValues(1)
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId("levels-settings-general-exclude-users-remove")
                                .setPlaceholder("Remove users from the exclude.")
                                .setMaxValues(1)
                                .setMinValues(1)
                        )
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Large)
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Large)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId("levels-settings-general-exclude-channels-add")
                                .setPlaceholder("Add channels from the exclude.")
                                .setMaxValues(1)
                                .setMinValues(1)
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId("levels-settings-general-exclude-channels-remove")
                                .setPlaceholder("Remove channels from the exclude.")
                                .setMaxValues(1)
                                .setMinValues(1)
                        )
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Large)
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Large)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId("levels-settings-general-exclude-roles-add")
                                .setPlaceholder("Add roles from the exclude.")
                                .setMaxValues(1)
                                .setMinValues(1)
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId("levels-settings-general-exclude-roles-remove")
                                .setPlaceholder("Remove roles from the exclude.")
                                .setMaxValues(1)
                                .setMinValues(1)
                        )
                    )
            ]
        })

    }
};
