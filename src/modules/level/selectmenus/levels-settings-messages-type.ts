import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType,
    Client,
    GuildMemberRoleManager, LabelBuilder,
    MessageFlags, ModalBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle,
    UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-messages-type",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const value = interaction.values[0]

        await database.levelSettings.update({
            where: {
                GuildId: interaction.guild.id
            },
            data: {
                LevelUpMessageType: value
            }
        })

        if (value == "custom") {
            const modal = new ModalBuilder()
                .setCustomId("levels-settings-messages-type-modal")
                .setTitle("Select Custom Channel")

            const input = new ChannelSelectMenuBuilder()
                .setCustomId("channel")
                .setChannelTypes(ChannelType.GuildText)

            modal
                .setLabelComponents(
                    new LabelBuilder()
                        .setLabel("Channel")
                        .setChannelSelectMenuComponent(input)
                )

            await interaction.showModal(modal)

        } else {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Selected your Message Type successfully.`, interaction, true, "reply")
        }


    },
};
