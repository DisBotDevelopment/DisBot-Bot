import {ClientUser, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import ms, {StringValue} from "ms";

export default {
    id: "ticket-add-component-command-slash-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const menuID = interaction.customId.split(":")[1];
        const text = interaction.fields.getTextInputValue(
            "text"
        );
        const description = interaction.fields.getTextInputValue(
            "description"
        );

        const data = await database.ticketSetups.findFirst({
            where: {CustomId: interaction.customId.split(":")[1]}
        })

        const commandNames = await interaction.guild.commands.fetch()

        if (!text && data.SlashCommandId) {
            await database.ticketSetups.update(
                {
                    where: {
                        CustomId: menuID
                    },
                    data: {
                        SlashCommandId: text ? text : null,
                        SlashCommandDescription: null
                    }
                }
            );
            await interaction.guild.commands.delete(data.SlashCommandId)
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("check")} Removed command from guild and Ticket Component!`
            })
        }

        commandNames.forEach(async (commandName) => {
                if (commandName.name === text) {
                    return await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiToPng("error")} This name is already taken from a Slash Command.`,
                    })

                }
            }
        )

        if (data.SlashCommandId) {
            const isCommand = interaction.guild.commands.cache.get(data.SlashCommandId)
            if (isCommand) await interaction.guild.commands.delete(data.SlashCommandId)
        }

        const command = await interaction.guild.commands.create({
            name: text,
            description: description ?? "Open a Ticket with this Command",
        })

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: menuID
                },
                data: {
                    SlashCommandId: command.id,
                    SlashCommandName: text,
                    SlashCommandDescription: description
                }
            }
        );

        await interaction.reply({
            content: `## ${await convertToEmojiToPng("check")} Added Slash Command to Ticket Component.`,
            flags: MessageFlags.Ephemeral,
        });
    }
};
