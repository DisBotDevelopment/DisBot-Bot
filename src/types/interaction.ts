import {PermissionResolvable, SlashCommandBuilder} from "discord.js";
import type {DisBotInteractionType} from "../enums/disBotInteractionType.js";
import type {PermissionType} from "../enums/permissionType.js";
import type {ExtendedClient} from "./client.js";

export interface DisBotInteraction {
    interactionName: string;
    interactionDescription?: string;
    execute: (any: any, client: ExtendedClient) => Promise<void>;
    autocomplete: any;
    name?: string;
    id?: string;
    subCommand?: string;
    subCommandGroup?: string;
    data?: SlashCommandBuilder;
    type: DisBotInteractionType;
    options: {
        once?: boolean;
        cooldown?: number | 0;
        botPermissions: PermissionResolvable[];
        userPermissions: PermissionResolvable[];
        isGuildOwner: boolean | false;
    },
    help: {
        name: string;
        description: string;
        usage: string;
        examples: string[];
        aliases: string[];
        docsLink?: string;
    }
}


