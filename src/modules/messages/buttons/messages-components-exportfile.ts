import {
    ActionRowBuilder, AttachmentBuilder,
    ButtonBuilder, ButtonInteraction,
    ButtonStyle,
    ComponentBuilder,
    ContainerBuilder, FileBuilder,
    MessageFlags,
    ModalSubmitInteraction, StringSelectMenuBuilder,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";

export default {
    id: "messages-components-exportfile",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const messageId = interaction.customId.split(":")[1]
        const name = interaction.customId.split(":")[2]

        const data = await database.messageTemplates.findFirst({
            where: {Name: name,}
        });

        if (!client.user) throw new Error("Client user is not cached");

        await database.messageTemplates.update({
            where: {
                Name: name
            },
            data: {
                IsComponentsV2Message: true
            }
        })
        const message = await interaction.channel.messages.fetch(messageId)
        const buffer = Buffer.from(JSON.stringify(message.components));

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("component-editor-create-add-sec:" + messageId)
                .setOptions(
                    [
                        {
                            label: "Text Display Component",
                            description: "Add Text to your Components.",
                            emoji: "<:renamesolid24:1259433901554929675>",
                            value: "textdisplay"
                        },
                        {
                            label: "Section Component",
                            description: "Add a Section to the Component",
                            emoji: "<:addchannel:1324458759589728387>",
                            value: "section"
                        },
                        {
                            label: "Separator Component",
                            description: "Add a Diver Line to the Components.",
                            emoji: "<:minus:1321943125706543155>",
                            value: "separator"
                        },
                        {
                            label: "Container Component",
                            description: "Add a Container to your Components.",
                            emoji: "<:folder:1321939544521572384>",
                            value: "container"
                        },
                        {
                            label: "Media Gallery Component",
                            description: "Add a Images to your Components.",
                            emoji: "<:imageadd:1260148502449754112>",
                            value: "mediagallery"
                        },
                        {
                            label: "File Component",
                            description: "Add a File to your Components.",
                            emoji: "<:description:1321938426576109768>",
                            value: "file"
                        },
                        {
                            label: "Selectmenu Component",
                            description: "Add File to your Components.",
                            emoji: "<:selectmenu:1327304700701315132>",
                            value: "selectmenu"
                        },
                        {
                            label: "Button Component",
                            description: "Add a Button to your Components.",
                            emoji: "<:button:1327305176553492520>",
                            value: "button"
                        },
                    ]
                )
        );

        const manageRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`component-editor-delete:${messageId}`)
                .setLabel("Delete Component with ID")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:trash:1259432932234367069>"),
            new ButtonBuilder()
                .setCustomId(`component-editor-ids:${messageId}`)
                .setLabel("View IDs")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:preview:1288230393757171825>"),
        )

        const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`component-editor-create-import:${messageId}`)
                .setLabel("Import JSON")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("<:import:1321939860868698185>"),
            new ButtonBuilder()
                .setCustomId(`messages-components-create-save:${name}:${messageId}`)
                .setLabel("Save Components")
                .setStyle(ButtonStyle.Success)
                .setEmoji("<:puzzle:1381000302601441440>"),
            new ButtonBuilder()
                .setCustomId(`messages-components-exportfile:${messageId}:${name}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:save:1260140823106813953>"),
            new ButtonBuilder()
                .setCustomId(`messages-embed-clearmessage:${messageId}`)
                .setStyle(ButtonStyle.Danger)
                .setEmoji("<:save:1322252985702551767>")
        );

        await interaction.update({
            withResponse: true,
            flags: MessageFlags.IsComponentsV2,
            files: [new AttachmentBuilder(buffer, {name: `components-${name}.json`})],
            components: [
                new ContainerBuilder()
                    .addActionRowComponents(manageRow)
                    .addActionRowComponents(row)
                    .addActionRowComponents(buttonRow)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `**Use the ${await convertToEmojiToPng("message")} button to clear the message from the channel**\n-# To Export the Components as JSON File use the ${await convertToEmojiToPng("refresh")} button below.\n-# To Import a JSON File use the ${await convertToEmojiToPng("import")} button.`
                        )
                    )
                    .addFileComponents(
                        new FileBuilder().setURL(`attachment://components-${name}.json`)
                    ),
            ],
        });
    },
};
