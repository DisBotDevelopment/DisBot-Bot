import axios from "axios";
import {Config} from "../main/config.js";

/**
 *
 * @param emoji
 */
export async function convertToEmojiToPng(emoji: string) {


    const response = await axios.get(
        `https://discord.com/api/applications/${Config.Bot.DiscordApplicationId}/emojis`,
        {
            headers: {
                Authorization: `Bot ${Config.Bot.DiscordBotToken}`,
            }
        }
    );

    const emojis = response.data.items;

    // Find the emoji with the given name
    const findemoji = emojis.find((e: any) => e.name === emoji);

    if (!findemoji) {
        return " ";
    }

    return `<:${emoji}:${findemoji.id}>`;
}

export async function convertToEmojiGif(emoji: string) {

    const response = await axios.get(
        `https://discord.com/api/applications/${Config.Bot.DiscordApplicationId}/emojis`,
        {
            headers: {
                Authorization: `Bot ${Config.Bot.DiscordBotToken}`
            }
        }
    );

    const emojis = response.data.items;

    const findemoji = emojis.find((e: any) => e.name === emoji);

    if (!findemoji) {
        return " ";
    }
    return `<a:${emoji}:${findemoji.id}>`;
}
