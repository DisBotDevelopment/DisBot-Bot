import {
    ButtonInteraction,
    ChannelType,
    ContainerBuilder,
    MessageFlags,
    StringSelectMenuBuilder,
    TextDisplayBuilder
} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "permissions-manage-reset",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {


        const data = await database.guildInteractionPermissions.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        })

        if (!data) return await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiToPng("error")} No Data!`
        })

        await database.guildInteractionPermissions.delete({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        })


        await interaction.update({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`## ${await convertToEmojiToPng("check")} Successfully removed you Interaction Permission Override!`)
                    )
            ]
        })


    }
};
