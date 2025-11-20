using System.ComponentModel.DataAnnotations;

namespace Shared.Entities.Users;

public class UserApiEntity
{
    public int Id { get; set; }
    [Required] public Guid Key { get; set; }
    public string[]? Permissions { get; set; }
    public string[]? Flags { get; set; }
    
    public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    
    [Required] public UserEntity User { get; set; }
}