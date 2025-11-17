import {ButtonInteraction, ContainerBuilder, MessageFlags, TextDisplayBuilder} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "autodelete-add-save",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not cached.");


        const uuid = interaction.customId.split(":")[1];

        const data = await database.guildAutoDeletes.findFirst({
            where: {
                UUID: uuid
            }
        });


        if (!data) {
            await interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} No AutoDelete setup found with UUID: \`${uuid}\``,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (!data.ChannelId) {
            await interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} No channel has been set for AutoDelete setup with UUID: \`${uuid}\``,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (!data.Time || Number(data.Time) <= 0) {
            await interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} No timer has been set for AutoDelete setup with UUID: \`${uuid}\``,
                flags: MessageFlags.Ephemeral
            });
            return;
        }


        await database.guildAutoDeletes.update(
            {
                where: {
                    UUID: uuid
                },
                data: {
                    IsActive: true
                }
            },
        );

        await interaction.update({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("check")} AutoDelete setup has been saved successfully!`))
            ],
        })
    }
};
