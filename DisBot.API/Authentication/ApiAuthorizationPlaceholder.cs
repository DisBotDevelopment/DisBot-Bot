namespace DisBot.API.Authentication;

public class ApiAuthorizationPlaceholder
{
    public static string GuildId = "{guildId}";

    public static string[] ApplyAuthPlaceholder(string[] permissions, Dictionary<string, string> replacements)
    {
        var list = permissions.ToList();
        foreach (var permission in list.ToList())
        {
            if (permission.Contains(GuildId))
            {
                list.Add(permission.Replace(GuildId, replacements[GuildId]));
            }
        }

        return list.ToArray();
    }
}