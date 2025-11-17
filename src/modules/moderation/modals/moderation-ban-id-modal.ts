import {ContainerBuilder, MessageFlags, ModalSubmitInteraction, TextDisplayBuilder,} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "moderation-ban-id-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const user = interaction.fields.getTextInputValue(
            "moderation-ban-set-user-input"
        );
        const reason =
            interaction.fields.getTextInputValue("moderation-ban-set-reason-input") ??
            "No reason provided";

        await interaction.guild?.members.ban(user, {reason: reason});

        if (!client.user) throw new Error("Client not found");
        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("check")} User has been banned`)
                    )
            ]
        });
    },
};
