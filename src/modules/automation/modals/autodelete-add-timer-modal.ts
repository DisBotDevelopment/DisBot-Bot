import "dotenv/config";
import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import ms, {StringValue} from "ms";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";


export default {
    id: "autodelete-add-timer-modal",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1];
        const input = interaction.fields.getTextInputValue("autodelete-add-timer-input");

        if (!client.user) throw new Error("Client user is not cached.");

        const time = ms(input as StringValue);
        if (!time || time < 0) {
            await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} Invalid time format. Please use a valid format like \`5m\`, \`1h\`, etc.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const data = await database.autoDeletes.findFirst(
            {
                where: {
                    GuildId: interaction.guildId,
                }
            }
        )

        if (!data) {
            await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} No setup found with the provided UUID.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        await database.autoDeletes.update(
            {
                where: {
                    UUID: uuid,
                },
                data: {
                    Time: time.toString()
                }
            },
        );

        const readableTime = ms(time, {long: true});

        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Timer updated successfully!\nNew timer: **${readableTime}** (${time}ms)`,
            flags: MessageFlags.Ephemeral,
        })
    },
};