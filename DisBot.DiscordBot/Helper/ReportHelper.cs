namespace DisBot.DiscordBot.Helper;

public static class ReportHelper
{
    public static Dictionary<string, Shared.Helper.ErrorReport> Errors { get; } = new();

    public static Shared.Helper.ErrorReport Create(Exception e, string? title, string? description)
    {
        var id = Guid.NewGuid().ToString();
        var error = new Shared.Helper.ErrorReport(id, e, title ?? "DisBot Exception",
            description ?? "Failed to execute action or process...");
        Errors.Add(id, error);
        return error;
    }
}