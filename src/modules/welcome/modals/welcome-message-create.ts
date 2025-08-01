import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "welcome-message-create",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const data = await database.guildWelcomeSetups.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        });

        if (!data) {
            await database.guildWelcomeSetups.create({
                data: {
                    GuildId: interaction.guild?.id,
                    MessageTemplateId: interaction.fields.getTextInputValue(
                        "welcome-message-create-name"
                    ),
                    ChannelId: interaction.fields.getTextInputValue(
                        "welcome-message-create-channel"
                    ),
                    Image: false,
                    ImageData: null,
                }
            });
        }

        await database.guildWelcomeSetups.update({
                where: {
                    GuildId: interaction.guild?.id
                },
                data: {
                    MessageTemplateId: interaction.fields.getTextInputValue(
                        "welcome-message-create-name"
                    ),
                    ChannelId: interaction.fields.getTextInputValue(
                        "welcome-message-create-channel"
                    ),
                    Image: false
                }
            }
        );

        if (!client.user) throw new Error("Client user is not defined");

        interaction.reply({
            content: `## ${await convertToEmojiPng(
                "check",
                client.user.id
            )} Welcome message has been set!`,
            flags: MessageFlags.Ephemeral
        });
    }
};
