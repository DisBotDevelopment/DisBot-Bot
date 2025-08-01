import {ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import {database} from "../../main/database.js";
import {ExtendedClient} from "types/client.js";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    data: new SlashCommandBuilder().setName("bot-info").setDescription("Sensitive Infos about the bot.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {

        const data = await database.disBot.findFirst()

        interaction.reply({

            content: [
                `- Connectet to Database: ${data ? "Yes" : "No"}`,
                `- Gateway: ${client.ws.gateway}`,
                `- WS Ping: ${client.ws.ping} ms`,
                `- Gateway Status: ${client.ws.status}`
            ].join("\n")

        })

    }
}