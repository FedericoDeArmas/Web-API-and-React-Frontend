using DevExpress.Data.Browsing;
using Microsoft.EntityFrameworkCore;
using Solbeg_Task.Models;

namespace Solbeg_Task.Data
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base (options) { }
        
        public DbSet<Employee> Employees { get; set; }
    }
}
