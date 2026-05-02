using DisBot.DiscordBot.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NetCord;
using NetCord.Rest;

namespace DisBot.DiscordBot.Services.Internal;

public class EmojiService
{
    public static Dictionary<string, string> Emojis { get; private set; } = new();
    private readonly RestClient RestClient;
    private readonly IOptions<BotOptions> BotOptions;
    private readonly ILogger<EmojiService> Logger;

    public EmojiService(RestClient restClient, IOptions<BotOptions> botOptions, ILogger<EmojiService> logger)
    {
        RestClient = restClient;
        BotOptions = botOptions;
        Logger = logger;
    }

    public async Task Initialize()
    {
        var application = await RestClient.GetApplicationAsync(BotOptions.Value.DiscordApplicationId);

        var emojis = await RestClient.GetApplicationEmojisAsync(BotOptions.Value.DiscordApplicationId);
        foreach (var applicationEmoji in emojis)
        {
            if (Emojis.ContainsKey(applicationEmoji.Name)) continue;
            var animation = applicationEmoji.Animated ? "a" : "";
            Emojis.Add(applicationEmoji.Name, $"<{animation}:{applicationEmoji.Name}:{applicationEmoji.Id}>");
        }

        var emojiFiles = Directory.GetFiles(Path.Combine(Directory.GetCurrentDirectory(), "Resources/Emojis"));
        foreach (var emojiFile in emojiFiles)
        {
            var name = emojiFile.Split("/").Last().Split('.').First();
            if (Emojis.ContainsKey(name)) continue;
            var emoji = await RestClient.CreateApplicationEmojiAsync(BotOptions.Value.DiscordApplicationId,
                new ApplicationEmojiProperties(name,
                    new ImageProperties(ImageFormat.Png, await File.ReadAllBytesAsync(emojiFile))));
            var animation = emoji.Animated ? "a" : "";
            Emojis.Add(emoji.Name, $"<{animation}:{emoji.Name}:{emoji.Id}>");

            Logger.LogInformation(
                "Added Discord Emoji with name {EmojiName} to the Application {ApplicationName}", emoji.Name,
                application.Name);
        }
    }
}