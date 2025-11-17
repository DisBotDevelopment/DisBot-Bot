import "dotenv/config";
import {
    codeBlock,
    ContainerBuilder,
    LabelBuilder,
    MessageFlags, ModalBuilder, TextDisplayBuilder, TextDisplayComponent,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {isInDevelopment} from "../../../helper/utilityHelper.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "component-editor-ids",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        await interaction.deferReply({flags: MessageFlags.Ephemeral,})

        const messageId = interaction.customId.split(":")[1]
        const message = await interaction.channel.messages.fetch(messageId)

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("puzzle")} Component View`,
                                    `-# Please note your are editing an Array! 1 = 0.....`,
                                    ``,
                                    `\`\`\`json`,
                                    `${JSON.stringify(message.components, null, 2)}\`\`\``
                                ].join("\n")
                            )
                    )
            ]
        })

    }
};
