import {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ModalSubmitInteraction
} from "discord.js";
import {createCanvas} from "canvas";
import FormData from "form-data";
import {Config} from "../main/config.js";
import axios from "axios";

export function getInteractionData(interaction: ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction, split: number) {
    return interaction.customId.split(":")[split];
}

export async function createPollImage(poll: { title: any; description: any; options: any; }) {
    const width = 800;
    const height = 270;
    const optionHeight = 60;
    const barHeight = 30;
    const canvas = createCanvas(width, height + poll.options.length * optionHeight);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#424549";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const maxVotes = Math.max(...poll.options.map(o => o.votes ?? 0), 1);

    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";

    poll.options.forEach((option, index) => {
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

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof radius === "number") {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (let side in defaultRadius) {
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