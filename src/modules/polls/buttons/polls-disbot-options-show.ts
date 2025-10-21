import {
    ActionRowBuilder,
    ButtonInteraction, ButtonStyle,
    ChannelType, ContainerBuilder,
    MessageFlags,
    ModalBuilder,
    StringSelectMenuBuilder,
    TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {PaginationBuilder} from "../../../helper/paginationHelper.js";
import {ExtendedClient} from "../../../types/client.js";
import {PaginationData} from "../../../types/pagination.js";
import {database} from "../../../main/database.js";
import {getInteractionData} from "../../../helper/utilityHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "polls-disbot-options-show",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        try {
            const uuid = getInteractionData(interaction, 1)

            const data = await database.polls.findFirst({
                include: {
                    PollOptions: true
                },
                where: {
                    UUID: uuid
                }
            })
            if (!data) {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} No Poll Data found!`
                })
            }

            if (data.PollOptions.length <= 0) {
                return await interaction.reply({
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiToPng("error")} No Poll Options found!`
                })
            }

            const options = data.PollOptions.map((o) => {
                return {
                    label: o.Label,
                    description: o.Description,
                    emoji: o.Emoji.length <= 0 ? "<:vote:1412727028540506194>" : o.Emoji,
                    value: o.UUID
                }
            })

            await interaction.reply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent("View your options and select it to remove it.\n-# You have only 25 Poll Options because of the Discord Limits"))
                        .addActionRowComponents(
                            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId("polls-disbot-options-show-select")
                                    .setPlaceholder("Select an Option to remove it")
                                    .addOptions(
                                        options
                                    )
                                    .setMaxValues(1)
                            )
                        )
                ]
            })


        } catch (err) {
            console.error(err)
        }
    }
};
