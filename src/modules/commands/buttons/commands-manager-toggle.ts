import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {protectedCommands} from "../../../main/data.js";
import {database} from "../../../main/database.js";

export default {
    id: "commands-manager-toggle",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client User is not defined");

        const data = await database.buildInCommands.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        })

        if (!data) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} No Data!`
            })
        }

        if (protectedCommands.includes(data.CustomName) || protectedCommands.includes(data.CodeName)) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} ${data.CustomName} can't not be toggled on or off!`
            })
        }
        try {
            const commands = await client.application.commands.fetch({guildId: interaction.guildId});

            for (const command of commands.values()) {
                if (
                    command.name != data.CustomName &&
                    command.guildId == interaction.guild?.id
                ) {
                    await database.buildInCommands.update({
                        where: {
                            UUID: interaction.customId.split(":")[1]
                        },
                        data: {
                            IsEnabled: true
                        }
                    })
                    await interaction.guild.commands.create(
                        {
                            name: data.CustomName,
                            description: client.commands.get(data.CodeName).data.description,
                            contexts: client.commands.get(data.CodeName).data.contexts,
                            options: client.commands.get(data.CodeName).data.options as any,
                            default_member_permissions: client.commands.get(data.CodeName).data.default_member_permissions,
                            integrationTypes: client.commands.get(data.CodeName).data.integration_types,
                            dmPermission: false
                        }
                    )

                    await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiPng("check", client.user.id)} Added command to the guild.`
                    })

                } else {
                    await interaction.guild.commands.delete(command.id)
                    await database.buildInCommands.update({
                        where: {
                            UUID: interaction.customId.split(":")[1]
                        },
                        data: {
                            IsEnabled: false
                        }
                    })
                    await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiPng("check", client.user.id)} Removed command successfully!`
                    })
                }
            }
        } catch (error) {
            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} Can't remove this command from the Guild!`
            })
        }


    }
};
