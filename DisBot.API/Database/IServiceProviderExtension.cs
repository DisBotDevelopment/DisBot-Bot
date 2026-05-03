namespace DisBot.API.Database;

public static partial class ServiceProviderExtension
{
    public static DataContext GetDataBaseContextAsync(this IServiceProvider serviceProvider)
    {
        var asyncScope = serviceProvider.CreateAsyncScope();
        return asyncScope.ServiceProvider.GetRequiredService<DataContext>();
    }
}