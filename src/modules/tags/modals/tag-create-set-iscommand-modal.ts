import {MessageFlags, ModalSubmitInteraction, PermissionFlagsBits, TextInputStyle,} from "discord.js";

import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "tag-create-set-iscommand-modal",

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const UUID = interaction.customId.split(":")[1];

        const data = await database.tags.findFirst({
            where: {
                UUID: UUID
            }
        });

        if (!client.user) throw new Error("Client user is not cached.");

        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "error"
                )} The tag does not exist.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const commands = client.commands;

        if (!data.SlashCommandId && data.IsSlashCommand == false) {
            if (!commands) {
                return interaction.reply({
                    content: `## ${await convertToEmojiToPng(
                        "error"
                    )} No commands found.`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            for (const cmd of commands.values()) {
                if (cmd.name == data.TagId) {
                    return interaction.reply({
                        content: `## ${await convertToEmojiToPng(
                            "error"
                        )} This tag can't be a Slash Command because it is a built-in command.`,
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
        }

        if (data.IsSlashCommand === false) {
            const command = await interaction.guild?.commands.create({
                name: data.TagId || "",
                description:
                    interaction.fields.getTextInputValue(
                        "tag-create-set-iscommand-modal-description"
                    ) || "Use the tag " + data.TagId,
                dmPermission: false,
                defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
            });

            await database.tags.update(
                {
                    where: {UUID: UUID},
                    data: {
                        IsSlashCommand: true,
                        SlashCommandId: command?.id,
                        CommandDescription: interaction.fields.getTextInputValue(
                            "tag-create-set-iscommand-modal-description"
                        ),
                    }
                }
            );

            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "tag"
                )} The tag \`${data.TagId}\` is now a Slash Command.`,
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.guild?.commands.delete(data.SlashCommandId as string);

            await database.tags.update(
                {
                    where: {UUID: UUID},
                    data: {
                        IsSlashCommand: false,
                    }
                }
            );

            return interaction.reply({
                content: `## ${await convertToEmojiToPng(
                    "tag"
                )} The tag \`${data.TagId}\` is no longer a Slash Command.`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
