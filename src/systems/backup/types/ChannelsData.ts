import {CategoryData} from "./CategoryData.js";
import {TextChannelData} from "./TextChannelData.js";
import {VoiceChannelData} from "./VoiceChannelData.js";

export interface ChannelsData {
    categories: CategoryData[];
    others: Array<TextChannelData | VoiceChannelData>;
}
