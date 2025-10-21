import "dotenv/config";
import backup from "../../../systems/backup/index.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiGif, convertToEmojiToPng} from "../../../helper/emojis.js";
import {
    BitFieldResolvable,
    Guild,
    MessageFlags,
    ModalSubmitInteraction,
    PermissionFlagsBits,
    PermissionsBitField
} from "discord.js";
import {database} from "../../../main/database.js";
import {discordPermissions} from "../../../main/data.js";

export default {
    id: "commands-manager-permission-modal",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");

        const permissions = interaction.fields.getTextInputValue("input").split(",")

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


                const bitField = new PermissionsBitField()

                for (const permission of permissions) {
                    bitField.add(discordPermissions[permission])
                }


                await interaction.guild?.commands.edit(command.id, {
                    defaultMemberPermissions: bitField,
                });

                console.log()

                await database.buildInCommands.update({
                    where: {
                        UUID: interaction.customId.split(":")[1]
                    },
                    data: {
                        Permissions: String(bitField.bitfield)
                    }
                })

                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("check")} Updated your Permissions of the Command.`
                });
            }
        }

        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiToPng("error")} Set Permissions from your input!`
        })

    },
};
