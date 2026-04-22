using System.ComponentModel.DataAnnotations;
using Shared.Interfaces;

namespace Shared.Entities.Users;

public class UserApiEntity : IActionTimestamps
{
    public int Id { get; set; }
    [Required] public Guid Key { get; set; }
    public string[]? Permissions { get; set; }
    public string[]? Flags { get; set; }

    public int UserId { get; set; }
    [Required] public UserEntity User { get; set; }
}