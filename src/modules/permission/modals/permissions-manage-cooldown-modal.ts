import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "permissions-manage-cooldown-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");
        const cooldown =
            interaction.fields.getTextInputValue("cooldown");


        const data = await database.guildInteractionPermissions.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        })

        if (!data) return interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiToPng("error")} No Data!`
        })

        await database.guildInteractionPermissions.update({
            where: {
                UUID: interaction.customId.split(":")[1]
            },
            data: {
                Cooldown: Number(cooldown) == 0 ? null : Number(cooldown)
            }
        })

        await interaction.deferUpdate()
    },
};
