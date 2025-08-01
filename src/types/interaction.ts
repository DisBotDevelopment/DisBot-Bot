import {PermissionResolvable, SlashCommandBuilder} from "discord.js";
import type {DisbotInteractionType} from "../enums/disbotInteractionType.js";
import type {PermissionType} from "../enums/permissionType.js";
import type {ExtendedClient} from "./client.js";

export interface DisBotInteraction {
    execute: (any: any, client: ExtendedClient) => Promise<void>;
    autocomplete: any;
    name?: string;
    id?: string;
    subCommand?: string;
    subCommandGroup?: string;
    data?: SlashCommandBuilder;
    type: DisbotInteractionType;
    options: {
        once?: boolean;
        permission: PermissionType | null;
        cooldown?: number | 0;
        botPermissions: PermissionResolvable[];
        userPermissions: PermissionResolvable[];
        userHasOnePermission: boolean | false;
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


