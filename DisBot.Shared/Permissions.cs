namespace DisBot.Shared;

public static class Permissions
{
    public static class UserPermissions
    {
        public static List<string> AllowedPermissionsForApiKeys = [UsersGuildsSelection];

        public const string User = "user";
        public const string UsersGuildsSelection = "users.guilds.selection";
    }

    public static class GuildPermissions
    {
        public static List<string> AllowedPermissionsForApiKeys = [];
        public const string Guild = "guild";
    }
}