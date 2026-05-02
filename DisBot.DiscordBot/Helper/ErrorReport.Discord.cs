using DisBot.DiscordBot.Services.Internal;
using Microsoft.VisualBasic;
using NetCord;
using NetCord.Rest;
using Interaction = NetCord.Interaction;

namespace DisBot.DiscordBot.Helper;

public static class ErrorReport
{
    public static async Task WithDiscord(this Shared.Helper.ErrorReport errorReport, Interaction interaction)
    {
        await interaction.SendResponseAsync(
            InteractionCallback.Message(
                new InteractionMessageProperties()
                {
                    Flags = MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                    Components =
                    [
                        new ComponentContainerProperties
                        {
                            new TextDisplayProperties($"## {errorReport.Title}"),
                            new TextDisplayProperties($"-# {errorReport.Description}"),
                            new ComponentSeparatorProperties(),
                            new TextDisplayProperties(
                                $"||```cs\n// {errorReport.Exception.Message}\n{errorReport.Exception.StackTrace ?? "N/A"}```||"),
                            new ComponentSeparatorProperties(),
                            new ComponentSectionProperties(new ButtonProperties(
                                $"internal.error.report:{errorReport.Id}",
                                "Report Error",
                                EmojiProperties.Custom(1366426689961459893), ButtonStyle.Secondary))
                            {
                                new TextDisplayProperties(
                                    $"-# Please read the error before you report it to the development Team."),
                            },
                            new ComponentSeparatorProperties(),
                            new ComponentSectionProperties(
                                new LinkButtonProperties(
                                    "https://docs.disbot.app/doc/troubleshooting-8PWsSMRNvH",
                                    "Read More",
                                    EmojiProperties.Custom(1438974310042697909)))
                            {
                                new TextDisplayProperties($"""
                                                           ### {EmojiService.Emojis["info"]} Follow this Steps!
                                                           -# **Steps you can do**
                                                           -# - Check your Action or Input.
                                                           -# - Check the Error Message and the Error Details below.
                                                           -# - Check Github and Discord for this problem.
                                                           -# - If there is no problem from you side and on Github or Discord then click \"Report Error\"
                                                           -# - Thanks for your Report - You will see a message with the Reports Liked.
                                                           """)
                            }
                        }
                    ]
                }
            ));
    }
}