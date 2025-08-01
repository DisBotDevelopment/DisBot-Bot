import {
    ActionRowBuilder,
    ButtonInteraction,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-account-age",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");

        const data = await database.securitys.findFirst({
            where: {GuildId: interaction.guildId}
        })

        const modal = new ModalBuilder()
            .setCustomId("security-gate-account-age-modal")
            .setTitle("Security Gate - Account Age").addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId("security-gate-account-age-input")
                        .setLabel("Minimum Account Age (in days)")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setMinLength(1)
                        .setMaxLength(3)
                        .setPlaceholder("Enter the minimum account age in days")
                ),
            )

        await interaction.showModal(modal);

    }
};
