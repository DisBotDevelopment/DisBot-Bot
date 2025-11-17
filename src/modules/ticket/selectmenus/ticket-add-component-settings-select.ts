import {Client, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-settings-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1]

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: uuid
            }
        })

        if (data.TicketSettings.includes(interaction.values[0])) {

            const filter = data.TicketSettings.filter((f) => f != interaction.values[0])

            await database.ticketSetups.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                        CustomId: interaction.customId.split(":")[1]
                    },
                    data: {
                        TicketSettings: {
                            set: filter
                        }
                    }
                }
            );

            await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Removed Ticket Setting ${interaction.values[0]}`, interaction, true, "reply")
        } else {
            await database.ticketSetups.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                        CustomId: interaction.customId.split(":")[1]
                    },
                    data: {
                        TicketSettings: {
                            push: interaction.values[0]
                        }
                    }
                }
            );

            // Reply Messages
            switch (interaction.values[0]) {
                case "disable_actions_button": {
                    await sendDefaultMessage(`## ${await convertToEmojiToPng("button")} Disabled Ticket Action Button!\n-# When you use Components V2 Messages then your can use this Button Template to get the Ticket Button\n-# Button Custom Id: \`ticket-actions:{ticket.id}\``, interaction, true, "reply")
                }
                    break;
            }

        }
    }
};
