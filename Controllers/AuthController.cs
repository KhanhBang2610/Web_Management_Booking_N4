using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http; // <--- QUAN TRỌNG: Thêm thư viện này để kích hoạt SetString cho Session
using Web_Management_Booking_N4.Data;
using Web_Management_Booking_N4.Models;
using System.Linq;

namespace Web_Management_Booking_N4.Controllers
{
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- ĐĂNG KÝ ADMIN ---
        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        public IActionResult Register(User user)
        {
            if (_context.Users.Any(u => u.Email == user.Email))
            {
                ModelState.AddModelError("Email", "Email này đã được sử dụng!");
                return View(user);
            }

            user.Role = "Admin"; // Mặc định tạo tài khoản Admin theo yêu cầu của bạn
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash); // Mã hóa mật khẩu
            
            _context.Users.Add(user);
            _context.SaveChanges();
            return RedirectToAction("Login");
        }

        // --- ĐĂNG NHẬP ---
        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            
            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                if (user.Role != "Admin")
                {
                    ViewBag.Error = "Chỉ tài khoản Admin mới có quyền truy cập trang này!";
                    return View();
                }

                // Lưu Session lưu trữ thông tin đăng nhập của Admin
                HttpContext.Session.SetString("AdminId", user.Id.ToString());
                HttpContext.Session.SetString("AdminName", user.FullName);
                
                return RedirectToAction("Index", "Home"); // Đăng nhập xong điều hướng thẳng vào Dashboard
            }

            ViewBag.Error = "Email hoặc mật khẩu không chính xác!";
            return View();
        }

        // --- ĐĂNG XUẤT ---
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // Xóa toàn bộ dữ liệu phiên làm việc
            return RedirectToAction("Login");
        }
    }
}