import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder, LabelBuilder,
    MessageFlags, ModalBuilder,
    ModalSubmitInteraction, StringSelectMenuBuilder, TextDisplayBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {showComponentFollowModal, updateComponentsWithPositions} from "../../../helper/messageHelper.js";
import {Channel} from "diagnostics_channel";

export default {
    id: "component-editor-position",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const messageId = interaction.customId.split(":")[1]
        const type = interaction.customId.split(":")[2]
        const position = interaction.fields.getTextInputValue("position")
        const id = interaction.fields.getTextInputValue("id")


        switch (type) {
            case "textdisplay": {

                const modal = new ModalBuilder().setCustomId("component-editor-create-textdisplay-modal:" + messageId + ":" + position + ":" + id).setTitle("Component Editor")
                const content = new TextInputBuilder().setStyle(TextInputStyle.Paragraph).setCustomId("content")
                modal.setLabelComponents(
                    new LabelBuilder()
                        .setLabel("Content")
                        .setDescription("Content of the Text Display")
                        .setTextInputComponent(content)
                )

                await showComponentFollowModal(
                    interaction,
                    modal,
                    type
                )
            }
                break;
            case "section": {
                const modal = new ModalBuilder().setCustomId("component-editor-create-section-modal:" + messageId + ":" + position + ":" + id).setTitle("Component Editor")

                const content = new TextInputBuilder().setCustomId("content").setStyle(TextInputStyle.Paragraph)
                const thumbnail = new TextInputBuilder().setCustomId("thumbnail").setStyle(TextInputStyle.Short).setRequired(false).setPlaceholder("If you use Button then paste your url/customId here (Button)")
                const label = new TextInputBuilder().setCustomId("label").setStyle(TextInputStyle.Short).setRequired(false).setPlaceholder("If you use Thumbnail then paste here the Description (Thumbnail)")
                const emoji = new TextInputBuilder().setCustomId("emoji").setStyle(TextInputStyle.Short).setRequired(false).setPlaceholder("If you want the Image as Spoiler use true false (Thumbnail)")

                const style = new StringSelectMenuBuilder()
                    .setCustomId("style")
                    .setMaxValues(1)
                    .setMinValues(0)
                    .setRequired(false)
                    .addOptions(
                        [
                            {
                                label: "Danger",
                                emoji: "<:minus:1321943125706543155>",
                                value: "4"
                            },
                            {
                                label: "Link",
                                emoji: "<:minus:1321943125706543155>",
                                value: "5"
                            },
                            {
                                label: "Primary",
                                emoji: "<:minus:1321943125706543155>",
                                value: "1"
                            },
                            {
                                label: "Secondary",
                                emoji: "<:minus:1321943125706543155>",
                                value: "2"
                            },
                            {
                                label: "Success",
                                emoji: "<:minus:1321943125706543155>",
                                value: "3"
                            }
                        ]
                    )


                modal.setLabelComponents(
                    new LabelBuilder()
                        .setLabel("Content")
                        .setTextInputComponent(content),
                    new LabelBuilder()
                        .setLabel("Button Label")
                        .setDescription("Select Thumbnail or Button")
                        .setTextInputComponent(label),
                    new LabelBuilder()
                        .setLabel("Button Emoji")
                        .setTextInputComponent(emoji),
                    new LabelBuilder()
                        .setLabel("Button Style")
                        .setStringSelectMenuComponent(style),
                    new LabelBuilder()
                        .setLabel("Thumbnail")
                        .setDescription("Select Thumbnail or Button")
                        .setTextInputComponent(thumbnail),
                )
                await showComponentFollowModal(
                    interaction,
                    modal,
                    type
                )
            }
                break;
            case "separator": {
                const modal = new ModalBuilder().setCustomId("component-editor-create-separator-modal:" + messageId + ":" + position + ":" + id).setTitle("Component Editor")
                const spacing = new StringSelectMenuBuilder()
                    .setCustomId("spacing")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions(
                        [
                            {
                                label: "Large Spacing Size",
                                emoji: "<:minus:1321943125706543155>",
                                value: "large"
                            },
                            {
                                label: "Small Spacing Size",
                                emoji: "<:minus:1321943125706543155>",
                                value: "small"
                            }
                        ]
                    )

                const diver = new StringSelectMenuBuilder()
                    .setCustomId("diver")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions(
                        [
                            {
                                label: "Use Diver",
                                emoji: "<:brackets:1362058401240060095>",
                                value: "true"
                            },
                            {
                                label: "No Diver",
                                emoji: "<:brackets:1362058401240060095>",
                                value: "false"
                            }
                        ]
                    )

                modal.setLabelComponents(
                    new LabelBuilder()
                        .setLabel("Spacing")
                        .setStringSelectMenuComponent(spacing),
                    new LabelBuilder()
                        .setLabel("Diver")
                        .setStringSelectMenuComponent(diver),
                )
                await showComponentFollowModal(
                    interaction,
                    modal,
                    type
                )
            }
                break;
            case "container": {
                const modal = new ModalBuilder().setCustomId("component-editor-create-container-modal:" + messageId + ":" + position + ":" + id).setTitle("Component Editor")

                const color = new TextInputBuilder().setCustomId("color").setStyle(TextInputStyle.Short).setRequired(false)
                const spoiler = new StringSelectMenuBuilder()
                    .setCustomId("spoiler")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions(
                        [
                            {
                                label: "Is Spoiler",
                                emoji: "<:check:1320090167444377713>",
                                value: "true"
                            },
                            {
                                label: "No Spoiler",
                                emoji: "<:x_:1322169218682322955>",
                                value: "false"
                            }
                        ]
                    )

                modal.setLabelComponents(
                    new LabelBuilder()
                        .setLabel("Color")
                        .setDescription("Use \",\" to separate the RGB numbers. 255,255,255")
                        .setTextInputComponent(color),
                    new LabelBuilder()
                        .setLabel("Spoiler")
                        .setStringSelectMenuComponent(spoiler),
                )
                await showComponentFollowModal(
                    interaction,
                    modal,
                    type
                )
            }
                break;
            case "mediagallery": {
                const modal = new ModalBuilder().setCustomId("component-editor-create-mediagallery-modal:" + messageId + ":" + position + ":" + id).setTitle("Component Editor")

                const data = new TextInputBuilder().setCustomId("data").setStyle(TextInputStyle.Paragraph).setPlaceholder(`eg. %url;%description%;%spoiler%|....`)

                modal.setLabelComponents(
                    new LabelBuilder()
                        .setLabel("Data")
                        .setDescription("Make your Images with description like this")
                        .setTextInputComponent(data),
                )
                await showComponentFollowModal(
                    interaction,
                    modal,
                    type
                )
            }
                break;
            case "file": {
                const modal = new ModalBuilder().setCustomId("component-editor-create-file-modal:" + messageId + ":" + position + ":" + id).setTitle("Component Editor")

                const name = new TextInputBuilder().setCustomId("name").setStyle(TextInputStyle.Short).setPlaceholder("cool-file.png")
                const url = new TextInputBuilder().setCustomId("url").setStyle(TextInputStyle.Short)

                const spoiler = new StringSelectMenuBuilder()
                    .setCustomId("spoiler")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions(
                        [
                            {
                                label: "Is Spoiler",
                                emoji: "<:check:1320090167444377713>",
                                value: "true"
                            },
                            {
                                label: "No Spoiler",
                                emoji: "<:x_:1322169218682322955>",
                                value: "false"
                            }
                        ]
                    )

                modal.setLabelComponents(
                    new LabelBuilder()
                        .setLabel("File Name")
                        .setTextInputComponent(name),
                    new LabelBuilder()
                        .setLabel("Url")
                        .setDescription("Please use a URl that returns a File. (.png,.pdf,.json)")
                        .setTextInputComponent(url),
                    new LabelBuilder()
                        .setLabel("Spoiler")
                        .setStringSelectMenuComponent(spoiler),
                )
                await showComponentFollowModal(
                    interaction,
                    modal,
                    type
                )
            }
                break;
            case "selectmenu": {
                const modal = new ModalBuilder().setCustomId("component-editor-create-selectmenu-modal:" + messageId + ":" + position + ":" + id).setTitle("Component Editor")

                const customId = new TextInputBuilder().setCustomId("customid").setStyle(TextInputStyle.Short).setPlaceholder("cool-id")
                const selectType = new StringSelectMenuBuilder()
                    .setCustomId("type")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions(
                        [
                            {
                                label: "String Select",
                                emoji: "<:check:1320090167444377713>",
                                value: "string"
                            },
                            {
                                label: "User Select",
                                emoji: "<:check:1320090167444377713>",
                                value: "user"
                            },
                            {
                                label: "Channel Select",
                                emoji: "<:x_:1322169218682322955>",
                                value: "channel"
                            },
                            {
                                label: "Role Select",
                                emoji: "<:x_:1322169218682322955>",
                                value: "role"
                            },
                            {
                                label: "Mention Select",
                                emoji: "<:x_:1322169218682322955>",
                                value: "mention"
                            }
                        ]
                    )
                const placeholder = new TextInputBuilder().setCustomId("placeholder").setStyle(TextInputStyle.Short).setPlaceholder("Select your Option...")
                const limit = new TextInputBuilder().setCustomId("limit").setStyle(TextInputStyle.Short).setPlaceholder("eg. 1,5")
                const data = new TextInputBuilder().setCustomId("data").setRequired(false).setStyle(TextInputStyle.Paragraph).setPlaceholder("StringSelect:\n- %customId%;%label%;%description%;%emoji%")

                modal.setLabelComponents(
                    new LabelBuilder()
                        .setLabel("Custom Id")
                        .setDescription("CustomId for your Component to use")
                        .setTextInputComponent(customId),
                    new LabelBuilder()
                        .setLabel("Type")
                        .setDescription("Please use a URl that returns a File. (.png,.pdf,.json)")
                        .setStringSelectMenuComponent(selectType),
                    new LabelBuilder()
                        .setLabel("Placeholder")
                        .setTextInputComponent(placeholder),
                    new LabelBuilder()
                        .setLabel("Limit")
                        .setDescription("Limit for selection: 1,1 = 1 is required.")
                        .setTextInputComponent(limit),
                    new LabelBuilder()
                        .setLabel("Data")
                        .setDescription("For ChannelSelect set ChannelTypes (GuildText...) and for StringSelect (see placeholder from input)")
                        .setTextInputComponent(data),
                )
                await showComponentFollowModal(
                    interaction,
                    modal,
                    type
                )
            }
                break;
            case "button": {
                const modal = new ModalBuilder().setCustomId("component-editor-create-button-modal:" + messageId + ":" + position + ":" + id).setTitle("Component Editor")

                const customId = new TextInputBuilder().setCustomId("customid").setStyle(TextInputStyle.Short).setPlaceholder("Or Url if you use Link Style.")
                const label = new TextInputBuilder().setCustomId("label").setStyle(TextInputStyle.Short).setRequired(false)
                const emoji = new TextInputBuilder().setCustomId("emoji").setStyle(TextInputStyle.Short).setRequired(false)

                const style = new StringSelectMenuBuilder()
                    .setCustomId("style")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setRequired(true)
                    .addOptions(
                        [
                            {
                                label: "Danger",
                                emoji: "<:minus:1321943125706543155>",
                                value: "4"
                            },
                            {
                                label: "Link",
                                emoji: "<:minus:1321943125706543155>",
                                value: "5"
                            },
                            {
                                label: "Primary",
                                emoji: "<:minus:1321943125706543155>",
                                value: "1"
                            },
                            {
                                label: "Secondary",
                                emoji: "<:minus:1321943125706543155>",
                                value: "2"
                            },
                            {
                                label: "Success",
                                emoji: "<:minus:1321943125706543155>",
                                value: "3"
                            }
                        ]
                    )


                modal.setLabelComponents(
                    new LabelBuilder()
                        .setLabel("Custom Id")
                        .setTextInputComponent(customId),
                    new LabelBuilder()
                        .setLabel("Button Label")
                        .setDescription("Select Emoji and/or Label")
                        .setTextInputComponent(label),
                    new LabelBuilder()
                        .setLabel("Button Emoji")
                        .setTextInputComponent(emoji),
                    new LabelBuilder()
                        .setLabel("Button Style")
                        .setStringSelectMenuComponent(style),
                )
                await showComponentFollowModal(
                    interaction,
                    modal,
                    type
                )
            }
                break;
        }

    }
}