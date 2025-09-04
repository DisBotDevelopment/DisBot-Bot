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
    const height = poll.options.length * 85;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#131416";
    ctx.fillRect(0, 0, width, height);

    const maxVotes = Math.max(...poll.options.map(o => o.votes ?? 0), 1);
    poll.options.forEach((opt, i) => {
        const y = 130 + i * 60;
        const barWidth = (opt.votes / maxVotes) * 600;

        ctx.fillStyle = "#4f46e5";
        ctx.fillRect(40, y, barWidth, 30);

        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.fillText(`${opt.emoji ?? ""} ${opt.label}`, 50, y + 22);

        ctx.fillStyle = "#ccc";
        ctx.font = "16px Arial";
        ctx.fillText(`${opt.votes} votes`, 660, y + 22);
    });

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