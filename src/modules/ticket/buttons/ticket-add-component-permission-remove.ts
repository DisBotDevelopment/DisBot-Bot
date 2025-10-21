import {ButtonInteraction, ChannelType, GuildChannel, MessageFlags, TextChannel, TextDisplayBuilder} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-permission-remove",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1];

        await database.ticketPermissions.delete({
            where: {
                UUID: uuid
            }
        })

        await interaction.update({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new TextDisplayBuilder().setContent(`## ${await convertToEmojiToPng("check")} Ticket Permission with Id ${uuid} successfully deleted!`)
            ]
        })

    }
};
