using DevExpress.Data.Browsing;
using DevExpress.DirectX.Common.Direct2D;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Solbeg_Task.Models;
using Solbeg_Task.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using System.Linq;
namespace Solbeg_Task.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly Context _context;
        public EmployeeController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        [Route(nameof(GetAllEmployees))]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAllEmployees() => await _context.Employees.ToListAsync();

        [HttpPost]
        [Route(nameof(AddEmployee))]
        public async Task<ActionResult> AddEmployee(Employee em)
        {
            if (!IsValidEmployee(em))
                return BadRequest("Employee data is not valid. Please check the provided data.");
            if(_context.Employees.Any(e => e.Id == em.Id))
                return BadRequest($"ID {em.Id} is already in use.");
            _context.Employees.Add(em);

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Employee added successfully");
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating employee. Please try again later.");
            }
        }

        [HttpPut]
        [Route(nameof(UpdateEmployee))]
        public async Task<ActionResult> UpdateEmployee(int id, [FromBody] Employee em)
        {
            var formerEmployee = await _context.Employees.FindAsync(id);
            if (formerEmployee == null)
                return NotFound("Selected employee not found");

            if (!IsValidEmployee(em))
                return BadRequest("Employee data is not valid. Please check the provided data.");

            formerEmployee.FirstName = em.FirstName;
            formerEmployee.LastName = em.LastName;
            formerEmployee.Age = em.Age;
            formerEmployee.Sex = em.Sex;

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Employee updated successfully");
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating employee. Please try again later.");
            }
        }

        [HttpDelete]
        [Route(nameof(RemoveEmployee))]
        public async Task<ActionResult> RemoveEmployee(int id)
        {
            var employeeToRemove = await _context.Employees.FindAsync(id);
            if (employeeToRemove == null)
                return NotFound("Employee not found");

            _context.Employees.Remove(employeeToRemove);
            await _context.SaveChangesAsync();

            return Ok("Employee removed successfully");
        }
        private bool IsValidEmployee(Employee em)
        {
            var availableGenders = new char[] { 'F', 'M' };
            if (string.IsNullOrWhiteSpace(em.FirstName) || string.IsNullOrWhiteSpace(em.LastName))
                return false;
            if (!availableGenders.Contains(em.Sex))
                return false;   
            if (em.Age < 18 || em.Age > 100)
                return false;
            return true;
        }
    }
}
