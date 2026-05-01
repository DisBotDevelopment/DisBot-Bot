namespace DisBot.DiscordBot.Configuration;

public class LoggingOptions
{
    public string GitHubApiToken { get; set; }
    public ulong ErrorReportForumId { get; set; }
    public ulong[] ErrorReportForumTags { get; set; }
}