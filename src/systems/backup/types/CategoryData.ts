import {ChannelPermissionsData} from "./ChannelPermissionData.js";
import {TextChannelData} from "./TextChannelData.js";
import {VoiceChannelData} from "./VoiceChannelData.js";

export interface CategoryData {
    name: string;
    permissions: ChannelPermissionsData[];
    children: Array<TextChannelData | VoiceChannelData>;
}
