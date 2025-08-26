import {ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {database} from "../../main/database.js";
import {ExtendedClient} from "types/client.js";
import {cli} from "winston/lib/winston/config/index.js";
import {CommandHelper} from "../../helper/CommandHelper.js";
import {loadBans} from "../../systems/backup/load.js";
import {loadCommands} from "../../handler/files/commands.js";
import {loadButtons} from "../../handler/files/buttons.js";
import {loadEvents} from "../../handler/files/events.js";
import {loadSelectMenus} from "../../handler/files/selectmenus.js";
import {loadModals} from "../../handler/files/modals.js";

export default {
    data: new SlashCommandBuilder().setName("bot-reload").setDescription("Reload the Bot Modules").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {

        await loadCommands(client);
        await loadSelectMenus(client);
        await loadModals(client);
        await loadButtons(client);
        await loadEvents(client);

        await CommandHelper.loadCommands(client);
        await CommandHelper.guildLoadCommands(client);

        await interaction.reply({
            content: "## Reload the Bot Modules",
            flags: MessageFlags.Ephemeral,
        })


    }
}