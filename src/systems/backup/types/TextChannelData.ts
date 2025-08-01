import {BaseChannelData} from "./BaseChannelData.js";
import {MessageData} from "./MessageData.js";
import {ThreadChannelData} from "./ThreadChannelData.js";

export interface TextChannelData extends BaseChannelData {
    nsfw: boolean;
    parent?: string;
    topic?: string;
    rateLimitPerUser?: number;
    isNews: boolean;
    messages: MessageData[];
    threads: ThreadChannelData[];
}
