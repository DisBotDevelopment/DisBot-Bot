import {ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

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
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This vanity URL is not found.`, interaction, true, "reply")
        }

        const newInvite = await interaction.guild?.invites.create(
            interaction.channelId, {
                maxAge: 0,
                maxUses: 0,
                reason: `Regenerating invite for vanity URL from ${interaction.user.username}`,
            }
        )

        if (!newInvite) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Failed to regenerate invite.`, interaction, true, "reply")
        }

        await database.vanitys.update({
            where: {
                UUID: data.UUID
            },
            data: {
                Invite: newInvite?.url
            }
        })

        await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Successfully regenerated the invite for this vanity URL.`, interaction, true, "reply")
    }
};
