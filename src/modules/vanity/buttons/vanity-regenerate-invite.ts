import {ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-regenerate-invite",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("The client is not ready");
        const data = await database.vanitys.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });


        if (!data) {
            await interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} This vanity URL is not found.`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const newInvite = await interaction.guild?.invites.create(
            interaction.channelId, {
                maxAge: 0,
                maxUses: 0,
                reason: `Regenerating invite for vanity URL from ${interaction.user.username}`,
            }
        )

        if (!newInvite) {
            await interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Failed to regenerate invite.`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        await database.vanitys.update({
            where: {
                UUID: data.UUID
            },
            data: {
                Invite: newInvite?.url
            }
        })

        await interaction.reply({
            content: `## ${await convertToEmojiToPng("check")} Successfully regenerated the invite for this vanity URL.`,
            flags: MessageFlags.Ephemeral
        })


    }
};
