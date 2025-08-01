import {ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticketbutton-openmessage",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const openMessage = interaction.fields.getTextInputValue("message");

        const message = await interaction.channel?.messages.fetch(
            interaction.message?.id as string
        );

        const content = message?.content.split("|");

        if (!content || content.length < 3) throw new Error("Invalid content");

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: content[2],
                },
                data: {
                    MessageTempleateId: openMessage,
                }
            }
        );

        if (!openMessage || openMessage == null) {
            await database.ticketSetups.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                        CustomId: content[2],
                    },
                    data: {
                        MessageTempleateId: null,
                    }
                }
            );
        }

        interaction.deferUpdate();
    },
};
