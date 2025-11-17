import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder, REST, Routes,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {protectedCommands} from "../../../main/data.js";
import {database} from "../../../main/database.js";
import {Logger} from "../../../main/logger.js";
import {Config} from "../../../main/config.js";

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
                content: `## ${await convertToEmojiToPng("error")} No Data!`
            })
        }

        if (protectedCommands.includes(data.CustomName) || protectedCommands.includes(data.CodeName)) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("error")} ${data.CustomName} can't not be toggled on or off!`
            })
        }
        try {
            const commands = await client.application.commands.fetch({guildId: interaction.guildId});

            for (const command of commands.values()) {
                if (
                    command.name != data.CustomName &&
                    command.guildId == interaction.guild?.id && !data.IsEnabled
                ) {

                    const restClient = new REST({version: "10"}).setToken(Config.Bot.DiscordBotToken);

                    const json = client.commands.get(data.CodeName).command.toJSON();

                    json.name = data.CustomName;
                    json.description = data.Description;
                    json.default_member_permissions = data.Permissions;

                    const currentCommands = await restClient.get(
                        Routes.applicationGuildCommands(Config.Bot.DiscordApplicationId, interaction.guild.id)
                    ) as any[]
                    
                    const newCommands = [...currentCommands, json];

                    await restClient.put(
                        Routes.applicationGuildCommands(Config.Bot.DiscordApplicationId, interaction.guild.id),
                        {
                            body: newCommands,
                        }
                    );


                    await database.buildInCommands.update({
                        where: {
                            UUID: interaction.customId.split(":")[1]
                        },
                        data: {
                            IsEnabled: true
                        }
                    })

                    return await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiToPng("check")} Added command to the guild.`
                    })

                } else if (
                    command.name == data.CustomName &&
                    command.guildId == interaction.guild?.id
                ) {
                    await command.delete()
                    await database.buildInCommands.update({
                        where: {
                            UUID: interaction.customId.split(":")[1]
                        },
                        data: {
                            IsEnabled: false
                        }
                    })
                    return await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiToPng("check")} Removed command successfully!`
                    })
                }
            }
        } catch (error) {
            Logger.error(error);
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("error")} Can't remove this command from the Guild!`
            })
        }


    }
};
