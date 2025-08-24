import "dotenv/config";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {database} from "../../../main/database.js";

export default {
    id: "commands-manager-name-modal",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");

        const name = interaction.fields.getTextInputValue("input");

        const data = await database.buildInCommands.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!data) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} No Data!`
            });
        }

        const commands = await client.application.commands.fetch({guildId: interaction.guildId});

        for (const command of commands.values()) {
            if (
                command.name == data.CustomName &&
                data.CustomName != name &&
                command.guildId == interaction.guild?.id
            ) {
                await interaction.guild?.commands.edit(command.id, {
                    name: name,
                });

                await database.buildInCommands.update({
                    where: {UUID: data.UUID},
                    data: {CustomName: name}
                });

                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiPng("check", client.user.id)} Updated your Command Name successfully!`
                });
            }
        }
        
        return await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiPng("error", client.user.id)} Could not find a matching command.`
        });
    }
};
