import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "leave-message-create",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const data = await database.guildLeaveSetups.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        });

        if (!data) {
            await database.guildLeaveSetups.create({
                data: {
                    GuildId: interaction.guild?.id,
                    MessageTemplateId: interaction.fields.getTextInputValue(
                        "leave-message-create-name"
                    ),
                    ChannelId: interaction.fields.getTextInputValue(
                        "leave-message-create-channel"
                    ),
                    Image: true,
                }
            });
        }

        await database.guildLeaveSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id
                },
                data: {
                    MessageTemplateId: interaction.fields.getTextInputValue(
                        "leave-message-create-name"
                    ),
                    ChannelId: interaction.fields.getTextInputValue(
                        "leave-message-create-channel"
                    ),
                    Image: true,
                }
            }
        );

        if (!client.user) throw new Error("Client user is not cached!");

        await interaction.reply({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} Leave message has been set!`,
            flags: MessageFlags.Ephemeral
        });
    }
};
