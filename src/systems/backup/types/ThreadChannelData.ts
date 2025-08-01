import {ThreadAutoArchiveDuration, ThreadChannelType} from "discord.js";
import {MessageData} from "./MessageData.js";

export interface ThreadChannelData {
    type: ThreadChannelType;
    name: string;
    archived: boolean;
    autoArchiveDuration: ThreadAutoArchiveDuration;
    locked: boolean;
    rateLimitPerUser: number;
    messages: MessageData[];
}
