import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    ComponentType, ContainerBuilder,
    MessageActionRowComponent,
    MessageFlags,
    ModalSubmitInteraction, PollAnswerData,
    TextChannel, TextDisplayBuilder, TextDisplayComponent
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import ms from "ms";
import {randomUUID} from "crypto";

export default {
    id: "polls-disbot-modal",

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const message = interaction.fields.getTextInputValue("message-template");
        const type = interaction.fields.getTextInputValue("type").toLowerCase();
        const requirements = interaction.fields.getTextInputValue("requirements") ?? "";
        const uuid = randomUUID()

        if (type != "button" && type != "selectmenu") {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} Please use Button or Selectmenu as Type!`
            })
        }

        const messageTemplate = await database.messageTemplates.findFirst({
            where: {
                Name: message
            }
        })
        if (!messageTemplate) return await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiPng("error", client.user.id)} No Message Template found.`
        })

        const roles = await interaction.guild.roles.fetch()
        const filterRoles = roles.filter(role => role.name == requirements)

        const data = await database.polls.create({
            data: {
                UUID: uuid,
                Type: type == "button" ? 1 : 2,
                MessageTemplateId: message,
                MultiAnswers: 1,
                Time: null,
                CreatedAt: new Date,
                Guilds: {
                    connect: {
                        GuildId: interaction.guildId
                    }
                },
                Entrys: [],
                Requirements: {
                    set: filterRoles?.first()?.id ? [filterRoles?.first()?.id] : []
                }
            }
        })

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiPng("vote", client.user.id)} Poll Settings (${uuid.substring(0, 8)}...)`,
                                    ``,
                                    `- Manage your Poll Options (Create, Remove, Show)`,
                                    `- You can have only 25 Options for one Poll`,
                                    `### Data`,
                                    ``,
                                    `- **Type**: ${data.Type == 1 ? "Button" : "Selectmenu"}`,
                                    `- **Message Template**: ${data.MessageTemplateId}`
                                ].join("\n")
                            )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:brackets:1362058401240060095>")
                                .setLabel("Multi Answers")
                                .setCustomId("polls-disbot-multi-answers:" + uuid),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:timer:1321939051921801308>")
                                .setLabel("Time")
                                .setCustomId("polls-disbot-time:" + uuid),
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:addchannel:1324458759589728387>")
                                .setLabel("Add Option")
                                .setCustomId("polls-disbot-options-add:" + uuid),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:preview:1288230393757171825>")
                                .setLabel("Show Option")
                                .setCustomId("polls-disbot-options-show:" + uuid)
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:send:1288224549078434012>")
                                .setLabel("Finish your Poll")
                                .setCustomId("polls-disbot-finish:" + uuid)
                        )
                    )
            ]
        })
    }
};
