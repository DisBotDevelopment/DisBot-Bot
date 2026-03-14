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
import {errorHandler} from "./errorHelper.js";
import {disbotClient} from "../main/bot.js";
import {ExtendedClient} from "../types/ExtendedClient.js";

export async function showComponentFollowModal(interaction: ModalSubmitInteraction, id: string, messageId: string, position: string, type: string, client: ExtendedClient) {
    try {
        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`Fill out the Component you want to create! (${type}, ${position})`))
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`component-editor-create:${type}:${id}:${messageId}:${position}`)
                                .setLabel("Follow the next steps")
                                .setEmoji("<:next:1287457822526935090>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
            ]
        })
    } catch (e: any) {
        await errorHandler(
            interaction,
            client,
            e,
            "Failed to Update Message Component",
            "Please try to parse the values RIGHT!"
        )
    }
}

export async function updateComponentsWithPositions(message: Message, json: any, positions?: string[]) {

    let newComponents = [];
    if (positions) {
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
    } else if (positions == null) {
        newComponents = json
    }

    const updatedComponents = await Promise.all(
        newComponents?.map(async (c: {
            type: number;
            components: any[];
            file: { url: string | URL | Request; };
            name: string;
        }) => {

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
                                         Id: number;
                                         GuildId: string;
                                         Content: string | null;
                                         EmbedJSON: string | null;
                                         OtherEmbeds: string[];
                                         Name: string;
                                         ComponentJSON: string | null;
                                         IsComponentsV2Message: boolean;
                                     },
                                     placeholderType: Record<string, any>
) {


    let messageData = {}

    if (data.IsComponentsV2Message) {
        if (!data.ComponentJSON) return
        const string = replacePlaceholders(data.ComponentJSON!, placeholderType);
        const parsed = await parseComponentData(string)

        messageData = {
            flags: MessageFlags.IsComponentsV2,
            components: parsed.components,
            files: parsed.files.length > 0 ? parsed.files : []
        }
    } else {
        messageData = {
            content: replacePlaceholders(data.Content ?? "", placeholderType) ?? " ",
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

    const fileData: any[] = []
    const data = await Promise.all(JSON.parse(json).map(async (c: any) => {
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
