import {Client, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "tag-create-set-permission",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];

        const data = await database.tags.findFirst({
            where: {
                UUID: uuid
            }
        });

        interaction.values.forEach(async (value) => {
            if (!data) {
                if (!client.user) throw new Error("No Client found.");
                return interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "tag",
                        client?.user?.id
                    )} The tag with the name \`${value}\` does not exist.`,
                    flags: MessageFlags.Ephemeral
                });
            }
            if (!interaction.guild) throw new Error("No Guild found.");
            const role = interaction.guild.roles.cache.get(value);
            if (!client.user) throw new Error("No Client found.");
            if (!role)
                return interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "tag",
                        client.user.id
                    )} The role with the ID \`${value}\` does not exist.`,
                    flags: MessageFlags.Ephemeral
                });

            await database.tags.update(
                {
                    where: {UUID: uuid},
                    data: {PermissionRoleId: value}
                }
            );

            interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "tag",
                    client.user.id
                )} The permission role for the tag \`${data.TagId
                }\` has been set to ${role}`,
                flags: MessageFlags.Ephemeral
            });

            setTimeout(async () => {
                await interaction.deleteReply();
            }, 2000);
        });
    }
};
