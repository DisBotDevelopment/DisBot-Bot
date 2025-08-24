import {ClientUser, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
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

        const commandNames = await client.application.commands.fetch()

        if (!text && data.SlashCommandId) {
            await database.ticketSetups.update(
                {
                    where: {
                        CustomId: menuID
                    },
                    data: {
                        SlashCommandId: text ? text : null
                    }
                }
            );
            await interaction.guild.commands.delete(data.SlashCommandId)
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} Removed command from guild and Ticket Component!`
            })
        }

        commandNames.forEach(async (commandName) => {
                if (commandName.name === text) {
                    return await interaction.reply({
                        flags: MessageFlags.Ephemeral,
                        content: `## ${await convertToEmojiPng("error", client.user.id)} This name is already taken from a Slash Command.`,
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
                    SlashCommandId: command.id
                }
            }
        );

        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Added Slash Command to Ticket Component.`,
            flags: MessageFlags.Ephemeral,
        });
    }
};
