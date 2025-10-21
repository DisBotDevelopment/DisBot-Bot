import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "leave-message-create",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const data = await database.guildLeaveSetup.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        });

        if (!data.ChannelId) return interaction.reply({
            content: `## ${await convertToEmojiToPng("error")} There are no Channel set.`,
            flags: MessageFlags.Ephemeral,
        })

        await database.guildLeaveSetup.update(
            {
                where: {
                    GuildId: interaction.guild?.id
                },
                data: {
                    MessageTemplateId: interaction.fields.getTextInputValue(
                        "leave-message-create-name"
                    ),
                    Image: data.Image,
                }
            }
        );

        if (!client.user) throw new Error("Client user is not cached!");

        await interaction.reply({
            content: `## ${await convertToEmojiToPng(
                "check"
            )} Leave message has been set!`,
            flags: MessageFlags.Ephemeral
        });
    }
};
