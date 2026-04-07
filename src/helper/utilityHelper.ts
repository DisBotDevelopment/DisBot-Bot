import {
    type AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction, type ComponentEmojiResolvable,
    ContainerBuilder,
    InteractionType,
    MessageFlags,
    ModalSubmitInteraction,
    TextDisplayBuilder
} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import FormData from "form-data";
import {Config} from "../main/config.js";
import axios from "axios";
import * as process from "node:process";
import {ExtendedClient} from "../types/ExtendedClient.js";
import {convertToEmojiToPng} from "./emojis.js";
import type {DrawCardOptions} from "../types/drawcardoptions.js";

export function getInteractionData(interaction: ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction, split: number) {
    return interaction.customId.split(":")[split];
}

export async function sendDefaultMessage(message: string, interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction, componentsV2: boolean, type?: "update" | "reply" | "deferReply") {
    if (type == "deferReply") {

        if (!interaction.deferred) {
            await interaction.deferReply({
                flags: MessageFlags.Ephemeral,
            })
        }

        if (componentsV2) {
            await interaction.editReply({
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(message)
                        )
                ],
                flags: MessageFlags.IsComponentsV2
            })
        } else {
            await interaction.editReply({
                content: message,
            })
        }
    } else if (type == "update") {
        if (interaction.type == InteractionType.ModalSubmit) {
            return
        }
        interaction = interaction as ButtonInteraction | AnySelectMenuInteraction

        if (componentsV2) {
            await interaction.update({
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(message)
                        )
                ],
                flags: MessageFlags.IsComponentsV2
            })
        } else {

            await interaction.update({
                content: message,
            })
        }
    } else if (type == "reply") {
        if (componentsV2) {
            await interaction.reply({
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(message)
                        )
                ],
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
            })
        } else {
            await interaction.reply({
                content: message,
                flags: MessageFlags.Ephemeral,
            })
        }
    } else {
        if (componentsV2) {
            await interaction.reply({
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(message)
                        )
                ],
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
            })
        } else {
            await interaction.reply({
                content: message,
                flags: MessageFlags.Ephemeral,
            })
        }
    }
}

export class DocsButton extends ButtonBuilder {
    constructor(url: string) {
        super(
            {
                url: url,
                style: ButtonStyle.Link,
                emoji: "<:outline:1438974310042697909>",
                label: "Docs",
            }
        )
    }

    override setEmoji(emoji: ComponentEmojiResolvable): this {
        return super.setEmoji(emoji);
    }

    override setStyle(style: ButtonStyle): this {
        return super.setStyle(style);
    }


    override setLabel(label: string): this {
        return super.setLabel(label);
    }
}

// Switch to canvacord. => To systems/imageGeneration/ or helper/imageGeneration/
export async function createPollImage(poll: { title: any; description: any; options: any; }) {
    const width = 800;
    const height = 270;
    const optionHeight = 60;
    const barHeight = 30;
    const canvas = createCanvas(width, height + poll.options.length * optionHeight);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#424549";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const maxVotes = Math.max(...poll.options.map((o: { votes: any; }) => o.votes ?? 0), 1);

    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";

    poll.options.forEach((option: { votes: number; emoji: any; label: any; }, index: number) => {
        const y = 130 + index * optionHeight;
        const barWidth = (option.votes / maxVotes) * 600;
        const radius = 10;

        ctx.fillStyle = "#5865F2";
        roundRect(ctx, 40, y, barWidth, barHeight, radius, true, false);

        ctx.fillStyle = "#fff";
        ctx.fillText(`${option.emoji ?? ""} ${option.label}`, 50, y + barHeight / 2);

        ctx.fillStyle = "#ccc";
        ctx.font = "16px Arial";
        ctx.fillText(`${option.votes} votes`, 660, y + barHeight / 2);
    });

    function roundRect(ctx: any, x: any, y: any, width: any, height: any, radius: any, fill: any, stroke: any) {
        if (typeof radius === "number") {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (const side in defaultRadius) {
                radius[side] = radius[side] || 0;
            }
        }

        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();

        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
    }

    const buffer = canvas.toBuffer()
    return await uploadToCDN(buffer)
}

export async function isInDevelopment(
    client: ExtendedClient,
    interaction: ButtonInteraction | ChatInputCommandInteraction | ModalSubmitInteraction | AnySelectMenuInteraction,
    message?: string,
    emoji?: string,
) {
    // Default
    emoji = await convertToEmojiToPng("barrier")
    message = "Failed to handle this feature, it is in Development!"

    if (process.env.ENVIRONMENT == "DEV") {

    } else {
        return await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${emoji} ${message}`,
        })
    }
}

// Switch to canvacord. => To systems/imageGeneration/ or helper/imageGeneration/
export async function drawCardCanvas(opts: DrawCardOptions): Promise<Buffer> {
    const width = 800;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage(opts.card.background);
    ctx.drawImage(bg, 0, 0, width, height);


    if (opts.card.rounded) {
        ctx.save();
        ctx.beginPath();
        const radius = 25;
        ctx.moveTo(radius, 0);
        ctx.lineTo(width - radius, 0);
        ctx.quadraticCurveTo(width, 0, width, radius);
        ctx.lineTo(width, height - radius);
        ctx.quadraticCurveTo(width, height, width - radius, height);
        ctx.lineTo(radius, height);
        ctx.quadraticCurveTo(0, height, 0, height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(bg, 0, 0, width, height);
        ctx.restore();
    }

    if (opts.card.border) {
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#555252";
        ctx.strokeRect(0, 0, width, height);
    }

    const avatar = await loadImage(opts.avatar.image);
    const avatarSize = 128;
    const avatarX = 40;
    const avatarY = height / 2 - avatarSize / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + opts.avatar.outlineWidth, 0, Math.PI * 2);
    ctx.strokeStyle = opts.avatar.outlineColor;
    ctx.lineWidth = opts.avatar.outlineWidth;
    ctx.stroke();
    ctx.fillStyle = opts.text.color;
    ctx.font = "bold 36px Sans";
    ctx.fillText(opts.text.title, 200, 100);

    ctx.font = "24px Sans";
    ctx.fillText(opts.text.subtitle, 200, 150);

    ctx.font = "20px Sans";
    ctx.fillText(opts.text.text, 200, 200);

    return canvas.toBuffer("image/png");
}

export async function uploadToCDN(buffer: Buffer): Promise<string | null> {
    const form = new FormData();
    form.append("file", buffer, {
        filename: "image.png",
        contentType: "image/png",
    });

    const req = await axios.post(`${Config.Other.CDN.Url}/api/upload`, form, {
        headers: {
            'Authorization': Config.Other.CDN.APIToken,
            ...form.getHeaders(),
            "Content-Type": "multipart/form-data",
            "x-zipline-deletes-at": "5d"
        },
    });
    if (req.status != 200) {
        return null;
    }
    const data = await req.data;
    return data.files[0].url ?? null;
}
