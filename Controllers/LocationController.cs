using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Management_Booking_N4.Data;
using Web_Management_Booking_N4.Models;

namespace Web_Management_Booking_N4.Controllers
{
    public class LocationController : Controller
    {
        private readonly ApplicationDbContext _context;

        public LocationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. HIỂN THỊ DANH SÁCH ĐỊA ĐIỂM
        public async Task<IActionResult> Index()
        {
            // Bảo mật: Chưa đăng nhập Admin thì không cho vào xem
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminName")))
            {
                return RedirectToAction("Login", "Auth");
            }

            // Lấy danh sách địa điểm và nạp kèm danh sách khách sạn thuộc địa điểm đó
            var locations = await _context.Locations
                .Include(l => l.Properties) 
                .ToListAsync();

            return View(locations);
        }

        // 2. GIAO DIỆN THÊM MỚI ĐỊA ĐIỂM (GET)
        [HttpGet]
        public IActionResult Create()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminName")))
            {
                return RedirectToAction("Login", "Auth");
            }
            return View();
        }

        // 3. XỬ LÝ THÊM MỚI ĐỊA ĐIỂM (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Location location)
        {
            if (ModelState.IsValid)
            {
                _context.Locations.Add(location);
                await _context.SaveChangesAsync(); // Lưu thay đổi vào DB một cách chính xác
                TempData["Success"] = "Thêm địa điểm mới thành công!";
                return RedirectToAction(nameof(Index));
            }
            return View(location);
        }

        // 4. GIAO DIỆN CHỈNH SỬA ĐỊA ĐIỂM (GET)
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminName")))
            {
                return RedirectToAction("Login", "Auth");
            }

            var location = await _context.Locations.FindAsync(id);
            if (location == null)
            {
                return NotFound();
            }
            return View(location);
        }

        // 5. XỬ LÝ CẬP NHẬT ĐỊA ĐIỂM (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Location location)
        {
            if (id != location.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(location);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "Cập nhật địa điểm thành công!";
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Locations.Any(e => e.Id == location.Id))
                    {
                        return NotFound();
                    }
                    else { throw; }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(location);
        }

        // 6. XỬ LÝ XOÁ ĐỊA ĐIỂM (POST)
        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminName")))
            {
                return RedirectToAction("Login", "Auth");
            }

            var location = await _context.Locations.FindAsync(id);
            if (location != null)
            {
                // Kiểm tra xem địa điểm này có khách sạn nào đang phụ thuộc không
                var hasProperties = await _context.Properties.AnyAsync(p => p.LocationId == id);
                if (hasProperties)
                {
                    TempData["Error"] = "Không thể xóa! Địa điểm này hiện đang có khách sạn hoạt động.";
                    return RedirectToAction(nameof(Index));
                }

                _context.Locations.Remove(location);
                await _context.SaveChangesAsync(); // Đã sửa lỗi gọi hàm sai ở đây
                TempData["Success"] = "Đã xóa địa điểm thành công!";
            }
            
            return RedirectToAction(nameof(Index));
        }
    }
}