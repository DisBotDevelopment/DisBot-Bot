using DiscordBot.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Shared.Entities.Guilds;

namespace DiscordBot.Database;

public class DataContext : DbContext
{
    public DbSet<GuildEntity> Guilds { get; set; }

    private readonly IOptions<DatabaseOptions> Options;

    public DataContext(IOptions<DatabaseOptions> options)
    {
        Options = options;
    }

    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (optionsBuilder.IsConfigured)
            return;

        optionsBuilder.UseNpgsql(
            $"Host={Options.Value.Host};" +
            $"Port={Options.Value.Port};" +
            $"Username={Options.Value.Username};" +
            $"Password={Options.Value.Password};" +
            $"Database={Options.Value.Database}"
        );
    }
}