import {
    ChannelType,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import {IDisBotCommand, IDisBotInteraction} from "../../../types/Interaction.js";
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {isInDevelopment} from "../../../helper/utilityHelper.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    type: DisBotInteractionType.Command,
    interactionName: "tempvoice",
    help: {
        name: 'Temp Voice',
        description: 'Setup a temporary voice channel system',
        usage: '/tempvoice',
        examples: [],
        aliases: [],
        docsLink: 'https://docs.disbot.app/docs/commands/tempvoice'
    },
    command: new SlashCommandBuilder()
        .setName("tempvoice")
        .setDescription("Setup a temporary voice channel system")
        .setDescriptionLocalizations({de: "Erstelle ein TempVoice Channels"})
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
    async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
        await isInDevelopment(client, interaction);
    }
} as IDisBotCommand