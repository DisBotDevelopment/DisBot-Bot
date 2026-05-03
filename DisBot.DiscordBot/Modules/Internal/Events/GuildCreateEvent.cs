using DisBot.DiscordBot.Database;
using DisBot.DiscordBot.Extensions;
using DisBot.Shared.Entities.Guilds;
using DisBot.Shared.Static;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NetCord;
using NetCord.Gateway;
using NetCord.Hosting.Gateway;

namespace DisBot.DiscordBot.Modules.Internal.Events;

public class GuildCreateEvent : IGuildCreateShardedGatewayHandler
{
    private readonly IServiceProvider ServiceProvider;

    public GuildCreateEvent(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider;
    }

    public async ValueTask HandleAsync(GatewayClient client, GuildCreateEventArgs arg)
    {
        var dataContext = ServiceProvider.GetDataBaseContextAsync();
        var guild = await dataContext.Guilds.FirstOrDefaultAsync(entity => entity.DiscordGuildId == arg.GuildId);
        if (guild is null)
        {
            var user = await dataContext.Users.Where(entity => entity.DiscordUserId == arg.Guild.OwnerId)
                .FirstOrDefaultAsync();
            if (user is null) return;
            await dataContext.Guilds.AddAsync(new GuildEntity()
            {
                DiscordGuildId = arg.GuildId,
                DiscordGuildName = arg.Guild!.Name,
                DiscordGuildAvatar = arg.Guild.GetIconUrl(ImageFormat.WebP)?.ToString() ??
                                     DisBotData.DISCORD_404_IMAGE_URL,
                User = user,
            });
        }

        await dataContext.SaveChangesAsync();
    }
}