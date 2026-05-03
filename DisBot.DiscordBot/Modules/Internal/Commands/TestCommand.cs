using DisBot.DiscordBot.Helper;
using DisBot.DiscordBot.Services.Internal;
using DisBot.Shared.Helper;
using NetCord.Services.ApplicationCommands;

namespace DisBot.DiscordBot.Modules.Internal.Commands;

public class TestCommand : ApplicationCommandModule<ApplicationCommandContext>
{
    private readonly EmojiService EmojiService;

    public TestCommand(EmojiService emojiService)
    {
        EmojiService = emojiService;
    }

    [SlashCommand("pong", "Pong!")]
    public async Task Pong()
    {
        var error = ReportHelper.Create(new Exception("leck"), "", "sdf");
        await error.WithDiscord(Context.Interaction);
    }
}