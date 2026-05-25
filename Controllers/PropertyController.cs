using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Web_Management_Booking_N4.Data;
using Web_Management_Booking_N4.Models;

namespace Web_Management_Booking_N4.Controllers
{
    public class PropertyController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PropertyController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH KHÁCH SẠN (INDEX)
        public async Task<IActionResult> Index()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminName")))
            {
                return RedirectToAction("Login", "Auth");
            }

            // Nạp kèm dữ liệu Location (Eager Loading) để lấy tên Tỉnh/Thành của khách sạn
            var properties = await _context.Properties
                .Include(p => p.Location)
                .Include(p => p.Rooms) // Để sau này đếm số lượng phòng nếu cần
                .ToListAsync();

            return View(properties);
        }

        // 2. GIAO DIỆN THÊM MỚI KHÁCH SẠN (GET)
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminName")))
            {
                return RedirectToAction("Login", "Auth");
            }

            // Lấy danh sách Địa điểm đổ vào DropdownList (Ô lựa chọn) ngoài giao diện
            var locations = await _context.Locations.ToListAsync();
            ViewBag.LocationId = new SelectList(locations, "Id", "Name");

            return View();
        }

        // 3. XỬ LÝ THÊM MỚI KHÁCH SẠN (POST)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Property property)
        {
            // Kiểm tra tính hợp lệ của dữ liệu đầu vào
            if (ModelState.IsValid)
            {
                _context.Properties.Add(property);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Thêm cơ sở lưu trú mới thành công!";
                return RedirectToAction(nameof(Index));
            }

            // Nếu dữ liệu lỗi, nạp lại danh sách địa điểm để tránh lỗi Dropdown rỗng
            var locations = await _context.Locations.ToListAsync();
            ViewBag.LocationId = new SelectList(locations, "Id", "Name", property.LocationId);
            return View(property);
        }

        // 4. XỬ LÝ XOÁ KHÁCH SẠN ĐƠN GIẢN (POST)
        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminName")))
            {
                return RedirectToAction("Login", "Auth");
            }

            var property = await _context.Properties.FindAsync(id);
            if (property != null)
            {
                // Kiểm tra xem khách sạn này có phòng (Rooms) nào đang phụ thuộc không để tránh lỗi khóa ngoại
                var hasRooms = await _context.Rooms.AnyAsync(r => r.PropertyId == id);
                if (hasRooms)
                {
                    TempData["Error"] = "Không thể xóa! Khách sạn này hiện đang có các phòng hoạt động.";
                    return RedirectToAction(nameof(Index));
                }

                _context.Properties.Remove(property);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Đã gỡ bỏ khách sạn khỏi hệ thống thành công!";
            }

            return RedirectToAction(nameof(Index));
        }
        // 5. GIAO DIỆN CHỈNH SỬA KHÁCH SẠN (GET)
[HttpGet]
public async Task<IActionResult> Edit(int id)
{
    if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminName")))
    {
        return RedirectToAction("Login", "Auth");
    }

    // Tìm khách sạn theo ID
    var property = await _context.Properties.FindAsync(id);
    if (property == null)
    {
        return NotFound();
    }

    // Lấy danh sách địa điểm đổ vào Dropdown để Admin có thể chọn lại Tỉnh/Thành
    var locations = await _context.Locations.ToListAsync();
    ViewBag.LocationId = new SelectList(locations, "Id", "Name", property.LocationId);

    return View(property);
}

// 6. XỬ LÝ CẬP NHẬT KHÁCH SẠN (POST)
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Edit(int id, Property property)
{
    if (id != property.Id)
    {
        return NotFound();
    }

    if (ModelState.IsValid)
    {
        try
        {
            _context.Update(property);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Cập nhật thông tin khách sạn thành công!";
            return RedirectToAction(nameof(Index));
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Properties.Any(e => e.Id == property.Id))
            {
                return NotFound();
            }
            else { throw; }
        }
    }

    // Nếu dữ liệu không hợp lệ, nạp lại Dropdown tránh lỗi giao diện
    var locations = await _context.Locations.ToListAsync();
    ViewBag.LocationId = new SelectList(locations, "Id", "Name", property.LocationId);
    return View(property);
}
    }
}