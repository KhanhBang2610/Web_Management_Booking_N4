using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Management_Booking_N4.Data;

namespace Web_Management_Booking_N4.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // DANH SÁCH THÀNH VIÊN
        public async Task<IActionResult> Index()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.Id)
                .ToListAsync();
            return View(users);
        }
    }
}