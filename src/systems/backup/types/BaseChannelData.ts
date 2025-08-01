import {TextBasedChannelTypes, ThreadChannelType, VoiceBasedChannelTypes} from 'discord.js';
import {ChannelPermissionsData} from "./ChannelPermissionData.js";

export interface BaseChannelData {
    type: TextBasedChannelTypes | VoiceBasedChannelTypes | ThreadChannelType;
    name: string;
    parent?: string;
    permissions: ChannelPermissionsData[];
}
