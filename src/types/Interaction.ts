import {Events, PermissionResolvable, SlashCommandBuilder} from "discord.js";
import type {DisBotInteractionType} from "../enums/disBotInteractionType.js";
import type {PermissionType} from "../enums/permissionType.js";
import {ExtendedClient} from "./ExtendedClient.js";

export interface IDisBotInteraction {
    interactionName: string;
    interactionDescription?: string;
    execute: (any: any, client: ExtendedClient) => Promise<void>;
    type: DisBotInteractionType;
    options?: {
        cooldown?: number | 0;
        botPermissions?: PermissionResolvable[];
        userPermissions?: PermissionResolvable[];
        isGuildOwner?: boolean | false;
    },
}

export interface IDisBotInteractive extends IDisBotInteraction {
    customId?: string;
}

export interface IDisBotEvent extends IDisBotInteraction {
    event: Events
    once?: boolean;
}

export interface IDisBotCommand extends IDisBotInteraction {
    command: SlashCommandBuilder;
    subCommand?: string;
    subCommandGroup?: string;
    autocomplete?: any;
    help?: {
        name: string;
        description: string;
        usage: string;
        examples?: string[];
        aliases?: string[];
        docsLink?: string;
    }
}

