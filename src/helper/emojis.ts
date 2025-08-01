import axios from "axios";
import {Config} from "../main/config.js";

/**
 *
 * @param emoji
 * @param {ExtendedClient} client
 */
export async function convertToEmojiPng(emoji: string, client: string) {


    const response = await axios.get(
        `https://discord.com/api/applications/${client}/emojis`,
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

export async function convertToEmojiGif(emoji: string, client: string) {

    const response = await axios.get(
        `https://discord.com/api/applications/${client}/emojis`,
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
