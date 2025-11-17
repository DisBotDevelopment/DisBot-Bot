import "dotenv/config";
import backup from "../../../systems/backup/index.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiGif, convertToEmojiToPng} from "../../../helper/emojis.js";
import {Guild, MessageFlags, ModalSubmitInteraction} from "discord.js";
import pkg from "short-uuid";
import {database} from "../../../main/database.js";

const {uuid} = pkg;

export default {
    id: "commands-manager-description-modal",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");

        const description = interaction.fields.getTextInputValue("input")

        const data = await database.buildInCommands.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        })

        if (!data) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("error")} No Data!`
            })
        }

        const commands = await client.application.commands.fetch({guildId: interaction.guildId});

        for (const command of commands.values()) {
            if (
                command.name == data.CustomName &&
                command.guildId == interaction.guild?.id
            ) {
                await interaction.guild?.commands.edit(command.id, {
                    description: description,
                });


                await database.buildInCommands.update({
                    where: {
                        UUID: interaction.customId.split(":")[1]
                    },
                    data: {
                        Description: description,
                    }
                })

                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("check")} Updated your Command Name successfully!`
                });
            }
        }

        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiToPng("error")} Updated your Command Description!`
        })
    },
};