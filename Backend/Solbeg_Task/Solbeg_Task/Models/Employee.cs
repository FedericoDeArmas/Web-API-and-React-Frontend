using System.ComponentModel.DataAnnotations;

namespace Solbeg_Task.Models
{
    /// <summary>
    /// Represents an Employee entity.
    /// </summary>
    public class Employee
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "First name is required.")]
        [MaxLength(50, ErrorMessage = "First name cannot exceed 50 characters.")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required.")]
        [MaxLength(50, ErrorMessage = "Last name cannot exceed 50 characters.")]
        public required string LastName { get; set; }

        [Range(0, 150, ErrorMessage = "Age must be between 0 and 150.")]
        public int Age { get; set; }

        [Required(ErrorMessage = "Sex is required.")]
        [RegularExpression("^[MF]$", ErrorMessage = "Sex must be 'M' or 'F'.")]
        public char Sex { get; set; }
    }
}
