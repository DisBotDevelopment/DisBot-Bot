import "dotenv/config";
import {MessageFlags, StringSelectMenuInteraction} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-toggle-invite-logging-select",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const data = await database.vanitys.findFirst
        ({
            include: {
                Analytics: true
            },
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        })
        for (const value of interaction.values) {
            if (!client.user) throw new Error("User not found");

            if (!data) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This vanity URL is not found.`, interaction, true, "reply")
            }

            if (!data?.Analytics?.TrackMessageId)
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")}  No tracking message ID found. Please set up the message Id for the channel first.`, interaction, true, "reply")

            await database.vanityAnalytic.update(
                {
                    where: {
                        VanityId: interaction.customId
                    },
                    data: {
                        TrackInviteWithLog: value,
                    }
                })

            return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")}  Invite logging channel set to <#${value}>.`, interaction, true, "reply")
        }
    }
}