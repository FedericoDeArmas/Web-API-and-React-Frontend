using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Solbeg_Task.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseConstructor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    Sex = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.InsertData(
               table: "Employees",
               columns: new[] { "FirstName", "LastName", "Age", "Sex" },
               values: new object[,]
               {
                    { "John", "Doe", 30, "M" },
                    { "Jane", "Smith", 25, "F" },
                    { "Michael", "Johnson", 35, "M" },
                    { "Emily", "Brown", 28, "F" },
                    { "David", "Williams", 32, "M" }
               });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
