using DisBot.DiscordBot.Database;
using Microsoft.Extensions.DependencyInjection;

namespace DisBot.DiscordBot.Extensions;

public static partial class ServiceProviderExtension
{
    public static DataContext GetDataBaseContextAsync(this IServiceProvider serviceProvider)
    {
        var asyncScope = serviceProvider.CreateAsyncScope();
        return asyncScope.ServiceProvider.GetRequiredService<DataContext>();
    }
}