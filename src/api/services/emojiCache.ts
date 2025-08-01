import axios from "axios";
import fs from "fs";
import path from "path";
import {ExtendedClient} from "../../types/client.js";
import {getFilesRecursively} from "../../helper/fileHelper.js";
import {LoggingAction} from "../../enums/loggingTypes.js";
import {Logger} from "../../main/logger.js";
import {Config} from "../../main/config.js";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function emojiCache(client: ExtendedClient) {
    try {

        const emojiFolder = path.resolve(process.cwd(), "src", "emojis");
        const emojiFiles = getFilesRecursively(emojiFolder, [".png", ".gif"]);

        if (emojiFiles.length === 0) {
            console.log("No emoji files found");
            return;
        }

        if (!client.user?.id) {
            console.log("Client user ID not available");
            return;
        }

        // Get all existing emojis first
        let existingEmojis: any[] = [];
        try {
            const response = await axios.get(
                `https://discord.com/api/v10/applications/${client.user.id}/emojis`,
                {
                    headers: {
                        Authorization: `Bot ${Config.Bot.DiscordBotToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            existingEmojis = response.data.items
        } catch (error) {
            console.error("Failed to fetch existing emojis", error);
            return;
        }

        for (const emoji of emojiFiles) {
            let emojiName = path.basename(emoji, path.extname(emoji.split(".")[1]));
            emojiName = emojiName.split(".")[0]
            emojiName = emojiName.toLowerCase()
                .replace(/[^a-z0-9_]/g, '_')
                .substring(0, 32);

            if (emojiName.length < 2) {
                console.log(`Skipping ${emoji}: Name too short after sanitization`);
                continue;
            }

            // Check if emoji already exists
            if (existingEmojis.map((e: any) => e.name).includes(emojiName)) {
                continue;
            }

            try {
                const fileData = fs.readFileSync(emoji);
                const base64Data = fileData.toString('base64');
                const fileExt = emoji.split(".")[1].toLowerCase();

                console.log(`Uploading emoji: ${emojiName}`);

                const response = await axios.post(
                    `https://discord.com/api/v10/applications/${client.user.id}/emojis`,
                    {
                        name: emojiName,
                        image: `data:image/${fileExt};base64,${base64Data}`
                    },
                    {
                        headers: {
                            Authorization: `Bot ${Config.Bot.DiscordBotToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );


                await sleep(1000);
            } catch (uploadError) {
                Logger?.error({
                    timestamp: new Date().toISOString(),
                    level: "error",
                    label: "EmojiCache",
                    message: `Failed to upload emoji ${emojiName}: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`,
                    botType: Config.BotType.toString() || "Unknown",
                    action: LoggingAction.Other
                });
            }
        }
    } catch (error) {
        Logger?.error({
            timestamp: new Date().toISOString(),
            level: "error",
            label: "EmojiCache",
            message: `Error in emojiCache: ${error instanceof Error ? error.message : String(error)}`,
            botType: Config.BotType.toString() || "Unknown",
            action: LoggingAction.Other
        });
    }
}