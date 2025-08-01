import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-edit-embed",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const data = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.customId.split(":")[1]
            }
        });

        let embed;
        if (data?.EmbedJSON) {
            embed = new EmbedBuilder(JSON.parse(data.EmbedJSON));
        } else {
            embed = new EmbedBuilder()
                .setTitle("Create an embed")
                .setDescription("You can edit the Embed here.")
                .setColor("#2B2D31");
        }

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("embed-create-add-sec")
                .setPlaceholder("Add a Option to the Embed")
                .addOptions(
                    {
                        label: "Title",
                        value: "title",
                        description: "Set the Title of the Embed",
                        emoji: "<:heading:1321937110151729153>"
                    },
                    {
                        label: "Author",
                        value: "author",
                        description: "Set the Author of the Embed",
                        emoji: "<:userdetail:1321937833296134205>"
                    },
                    {
                        label: "Footer",
                        value: "footer",
                        description: "Set the Footer of the Embed",
                        emoji: "<:subtitle:1321938231788568586>"
                    },
                    {
                        label: "Description",
                        value: "description",
                        description: "Set the Description of the Embed",
                        emoji: "<:description:1321938426576109768>"
                    },
                    {
                        label: "Color",
                        value: "color",
                        description: "Set the Color of the Embed",
                        emoji: "<:color:1321938714741440552>"
                    },
                    {
                        label: "Thumbnail",
                        value: "thumbnail",
                        description: "Set the Thumbnail of the Embed",
                        emoji: "<:imageadd:1260148502449754112>"
                    },
                    {
                        label: "Timestamp",
                        value: "timestamp",
                        description: "Set the Timestamp of the Embed",
                        emoji: "<:timer:1321939051921801308>"
                    },
                    {
                        label: "Image",
                        value: "image",
                        description: "Set the Image of the Embed",
                        emoji: "<:imageadd:1260148502449754112>"
                    },
                    {
                        label: "Field",
                        value: "field",
                        description: "Manage the Fields of the Embed",
                        emoji: "<:folder:1321939544521572384>"
                    }
                )
        );

        const deletsec =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("embed-create-delete-sec")
                    .setPlaceholder("Remove a Option from the Embed")
                    .addOptions(
                        {
                            label: "Title",
                            value: "title",
                            description: "Set the Title of the Embed",
                            emoji: "<:heading:1321937110151729153>"
                        },
                        {
                            label: "Author",
                            value: "author",
                            description: "Set the Author of the Embed",
                            emoji: "<:userdetail:1321937833296134205>"
                        },
                        {
                            label: "Footer",
                            value: "footer",
                            description: "Set the Footer of the Embed",
                            emoji: "<:subtitle:1321938231788568586>"
                        },
                        {
                            label: "Description",
                            value: "description",
                            description: "Set the Description of the Embed",
                            emoji: "<:description:1321938426576109768>"
                        },
                        {
                            label: "Color",
                            value: "color",
                            description: "Set the Color of the Embed",
                            emoji: "<:color:1321938714741440552>"
                        },
                        {
                            label: "Thumbnail",
                            value: "thumbnail",
                            description: "Set the Thumbnail of the Embed",
                            emoji: "<:imageadd:1260148502449754112>"
                        },
                        {
                            label: "Timestamp",
                            value: "timestamp",
                            description: "Set the Timestamp of the Embed",
                            emoji: "<:timer:1321939051921801308>"
                        },
                        {
                            label: "Image",
                            value: "image",
                            description: "Set the Image of the Embed",
                            emoji: "<:imageadd:1260148502449754112>"
                        },
                        {
                            label: "Field",
                            value: "field",
                            description: "Use the add Selectmenu to manage the Fields",
                            emoji: "<:folder:1321939544521572384>"
                        }
                    )
            );

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("embed-create-export")
                .setLabel("Export JSON")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:export:1321939859228721172>"),
            new ButtonBuilder()
                .setCustomId("embed-create-import")
                .setLabel("Import JSON")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:import:1321939860868698185>"),

            new ButtonBuilder()
                .setCustomId("messages-embed-edit-save:" + data?.Name)
                .setLabel("Edit the Embed")
                .setEmoji("<:save:1260157401496031244>")
                .setStyle(ButtonStyle.Success)
        );

        interaction.reply({
            embeds: [embed],
            components: [row, deletsec, buttons]
        });
    }
};
