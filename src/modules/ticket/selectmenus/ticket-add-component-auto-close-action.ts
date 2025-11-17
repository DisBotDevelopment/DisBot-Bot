import {ChannelType, Client, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-auto-close-action",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: interaction.customId.split(":")[1]
            }
        })
        for (const value of interaction.values) {

            if (data.ChannelType == ChannelType.PrivateThread) {
                if (value == "channel") {
                    return await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiToPng("error")} You cant use this option for the Channel Type`
                    })
                }
            }
            if (data.ChannelType == ChannelType.GuildCategory) {
                if (value == "look") {
                    return await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiToPng("error")} You cant use this option for the Channel Type`
                    })
                }
                if (value == "not_thread_close") {
                    return await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiToPng("error")} You cant use this option for the Channel Type`
                    })
                }
            }

        }

        await database.ticketSetups.update({
            where: {
                CustomId: interaction.customId.split(":")[1]
            },
            data: {
                AutoCloseAction: {
                    set: interaction.values
                }
            }
        })

        await interaction.deferUpdate()
    }
}
