import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction, ButtonStyle, ContainerBuilder, EmbedBuilder,
    FileBuilder,
    Message,
    MessageFlags, ModalBuilder, ModalSubmitInteraction, TextDisplayBuilder
} from "discord.js";
import {replacePlaceholders} from "../main/placeholder.js";

export async function showComponentFollowModal(interaction: ModalSubmitInteraction, modal: ModalBuilder, type: string) {
    await interaction.reply({
        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        components: [
            new ContainerBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent("Fill out the Component you want to create!"))
                .addActionRowComponents(
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`component-editor-create-${type}`)
                            .setLabel("Follow the next steps")
                            .setEmoji("<:next:1287457822526935090>")
                            .setStyle(ButtonStyle.Secondary)
                    )
                )
        ]
    })

    const collector = interaction.channel?.createMessageComponentCollector({
        filter: (i: {
            customId: string;
            user: { id: any; };
        }) => i.customId == `component-editor-create-${type}` && i.user.id === interaction.user.id,
        time: 60000,
    });

    collector?.on("collect", async (i: ButtonInteraction) => {
        await i.showModal(modal)
    })
}

export async function updateComponentsWithPositions(message: Message, json: any, positions: string[]) {

    let newComponents = [];
    if (positions.length == 1) {
        newComponents = JSON.parse(JSON.stringify(message.components));
        newComponents[Number(positions[0])] = json;
    } else if (positions.length == 2) {
        newComponents = JSON.parse(JSON.stringify(message.components));

        if (newComponents[Number(positions[0])]?.components) {
            newComponents[Number(positions[0])].components[Number(positions[1])] = json
        }
    } else if (positions.length == 3) {
        newComponents = JSON.parse(JSON.stringify(message.components));

        if (newComponents[Number(positions[0])]?.components?.[Number(positions[1])]?.components) {
            newComponents[Number(positions[0])].components[Number(positions[1])].components[Number(positions[2])] = json
        }
    }

    const updatedComponents = await Promise.all(
        newComponents?.map(async (c) => {

            if (c.type == 17) {
                c.components = await Promise.all(c.components.map(async (c: any) => {
                    if (c.type == 13) {

                        const req = await fetch(c.file.url)
                        const arrayBuffer = await req.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        await message.edit({
                            files: [new AttachmentBuilder(buffer).setName(c.name)]
                        })

                        return JSON.parse(JSON.stringify(new FileBuilder().setURL(`attachment://${c.name}`)));
                    }
                    return c
                }))
            }


            if (c.type == 13) {
                const req = await fetch(c.file.url)
                const arrayBuffer = await req.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                await message.edit({
                    files: [new AttachmentBuilder(buffer).setName(c.name)]
                })

                return JSON.parse(JSON.stringify(new FileBuilder().setURL(`attachment://${c.name}`)));
            }
            return c
        })
    );

    try {
        await message.edit({
            flags: MessageFlags.IsComponentsV2,
            components: updatedComponents
        })
    } catch (e) {
        console.log(e)
    }
}


export async function MessageBuilder(data: {
                                         Id: number
                                         Content?: string;
                                         EmbedJSON?: string;
                                         ComponentJSON?: string;
                                         IsComponentsV2Message: boolean
                                         OtherEmbeds: string[]
                                         Name: string
                                         GuildId: string
                                     },
                                     placeholderType: Record<string, any>
) {


    let messageData = {}

    if (data.IsComponentsV2Message) {

        const string = replacePlaceholders(data.ComponentJSON, placeholderType);
        const parsed = await parseComponentData(string)

        messageData = {
            flags: MessageFlags.IsComponentsV2,
            components: parsed.components,
            files: parsed.files.length > 0 ? parsed.files : []
        }
    } else {
        messageData = {
            content: replacePlaceholders(data.Content, placeholderType) ?? " ",
            embeds: []
        }

        if (data.EmbedJSON) {
            (messageData as any).embeds.push(new EmbedBuilder(JSON.parse(replacePlaceholders(data.EmbedJSON, placeholderType))));
        }

        for (const embed of data.OtherEmbeds) {
            (messageData as any).embeds.push(new EmbedBuilder(JSON.parse(replacePlaceholders(embed, placeholderType))));
        }
    }

    return {
        messageData
    }
}


export async function parseComponentData(json: any) {

    const fileData = []
    const data = await Promise.all(JSON.parse(json).map(async (c) => {
        if (c.type == 17) {
            c.components = await Promise.all(c.components.map(async (c: any) => {
                if (c.type == 13) {

                    const req = await fetch(c.file.url)
                    const arrayBuffer = await req.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    fileData.push(new AttachmentBuilder(buffer).setName(c.name));

                    return JSON.parse(JSON.stringify(new FileBuilder().setURL(`attachment://${c.name}`)));
                }
                return c
            }))
        }
        if (c.type == 13) {
            const req = await fetch(c.file.url)
            const arrayBuffer = await req.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fileData.push(new AttachmentBuilder(buffer).setName(c.name));

            return JSON.parse(JSON.stringify(new FileBuilder().setURL(`attachment://${c.name}`)));
        }
        return c
    }))

    return {
        components: data,
        files: fileData
    }
}
