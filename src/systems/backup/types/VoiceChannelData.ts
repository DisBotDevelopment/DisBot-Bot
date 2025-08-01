import type {BaseChannelData} from "./BaseChannelData.js";

export interface VoiceChannelData extends BaseChannelData {
    bitrate: number;
    userLimit: number;
}
