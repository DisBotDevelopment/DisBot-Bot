using DisBot.DiscordBot.Configuration;
using Microsoft.Extensions.Options;
using NetCord;
using NetCord.Rest;

namespace DisBot.DiscordBot.Services.Internal;

public class EmojiService
{
    public static Dictionary<string, string> Emojis { get; private set; } = new();
    private readonly RestClient RestClient;
    private readonly IOptions<BotOptions> BotOptions;

    public EmojiService(RestClient restClient, IOptions<BotOptions> botOptions)
    {
        RestClient = restClient;
        BotOptions = botOptions;
        Initialize();
    }

    public async Task Initialize()
    {
        var emojis = await RestClient.GetApplicationEmojisAsync(BotOptions.Value.DiscordApplicationId);
        foreach (var applicationEmoji in emojis)
        {
            if (Emojis.ContainsKey(applicationEmoji.Name)) return;
            var animation = applicationEmoji.Animated ? "a" : "";
            Emojis.Add(applicationEmoji.Name, $"<{animation}:{applicationEmoji.Name}:{applicationEmoji.Id}>");
        }
    }
}