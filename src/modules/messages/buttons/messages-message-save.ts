import {ButtonInteraction, ContainerBuilder, MessageFlags, TextDisplayBuilder} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-message-save",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];

        const data = await database.messageTemplates.findFirst({
            where: {
                Name: uuid,
            }
        });

        if (!client.user) throw new Error("Client not Found!");

        if (!data?.EmbedJSON && !data?.Content) {
            return interaction
                .reply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} The message you are trying to save does not exist.`,
                    flags: MessageFlags.Ephemeral,
                    components: [],
                    embeds: [],
                })
                .then(async () => {
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 5000);
                });
        }

        await interaction.update({
            components: [

                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(
                            `## ${await convertToEmojiPng(
                                "check",
                                client.user.id
                            )} Message saved successfully.`
                        )
                )
            ],
            flags: MessageFlags.IsComponentsV2,
        });
    },
};
