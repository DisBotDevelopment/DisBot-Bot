import "dotenv/config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ClientUser,
    EmbedBuilder,
    MessageFlags,
    RoleSelectMenuBuilder,
    StringSelectMenuInteraction
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "autodelete-add-user",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {

            const uuid = interaction.customId.split(":")[1];

            const data = await database.autoDeletes.findFirst({
                where: {
                    UUID: uuid
                }
            });

            if (!client.user) throw new Error("Client user is not defined");
            if (!data) {
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} No AutoDelete setup found with UUID: \`${uuid}\``,
                    flags: MessageFlags.Ephemeral
                });
                continue;
            }


            if (data.WhitelistedUsers.includes(value)) {
                await database.autoDeletes.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            WhitelistedUsers: {
                                set: data.WhitelistedUsers.filter((r: string) => r != value)
                            }
                        }
                    },
                );

                return await interaction.reply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} User removed successfully! (${data.WhitelistedUsers.length - 1})`,
                    flags: MessageFlags.Ephemeral
                });
            } else {

                const newRoles = [...data.WhitelistedUsers, value];
                await database.autoDeletes.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            WhitelistedUsers: {
                                push: newRoles
                            }
                        }
                    }
                )

                return await interaction.reply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} User added successfully! (${data.WhitelistedUsers.length + 1})`,
                    flags: MessageFlags.Ephemeral
                });

            }
        }
    }
}
