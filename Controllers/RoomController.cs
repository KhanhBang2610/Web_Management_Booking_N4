using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Web_Management_Booking_N4.Data;
using Web_Management_Booking_N4.Models;

namespace Web_Management_Booking_N4.Controllers
{
    public class RoomController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RoomController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH LOẠI PHÒNG
        public async Task<IActionResult> Index()
        {
            var rooms = await _context.Rooms
                .Include(r => r.Property)
                .OrderByDescending(r => r.Id)
                .ToListAsync();
            return View(rooms);
        }

        // 2. GIAO DIỆN TẠO MỚI (GET)
        public IActionResult Create()
        {
            ViewBag.PropertyId = new SelectList(_context.Properties, "Id", "Name");
            return View();
        }

        // 3. XỬ LÝ LƯU (POST) - ĐÃ ĐỒNG BỘ TÊN BIẾN THEO MODEL CỦA BẠN
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,PropertyId,RoomType,BasePrice,Capacity,TotalRooms,Amenities,CreatedAt")] Room room)
        {
            if (ModelState.IsValid)
            {
                room.CreatedAt = DateTime.Now;
                _context.Add(room);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Thêm loại phòng mới thành công!";
                return RedirectToAction(nameof(Index));
            }

            ViewBag.PropertyId = new SelectList(_context.Properties, "Id", "Name", room.PropertyId);
            return View(room);
        }

        // 4. XỬ LÝ XÓA
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room != null)
            {
                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Đã xóa loại phòng thành công!";
            }
            return RedirectToAction(nameof(Index));
        }
        // 5. GIAO DIỆN CHỈNH SỬA PHÒNG (GET)
public async Task<IActionResult> Edit(int? id)
{
    if (id == null)
    {
        return NotFound();
    }

    var room = await _context.Rooms.FindAsync(id);
    if (room == null)
    {
        return NotFound();
    }
    
    // Đổ danh sách khách sạn vào dropdown và chọn sẵn khách sạn hiện tại của phòng
    ViewBag.PropertyId = new SelectList(_context.Properties, "Id", "Name", room.PropertyId);
    return View(room);
}

// 6. XỬ LÝ CẬP NHẬT PHÒNG (POST)
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Edit(int id, [Bind("Id,PropertyId,RoomType,BasePrice,Capacity,TotalRooms,Amenities,CreatedAt")] Room room)
{
    if (id != room.Id)
    {
        return NotFound();
    }

    if (ModelState.IsValid)
    {
        try
        {
            _context.Update(room);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Cập nhật thông tin loại phòng thành công!";
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Rooms.Any(e => e.Id == room.Id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        return RedirectToAction(nameof(Index));
    }
    
    ViewBag.PropertyId = new SelectList(_context.Properties, "Id", "Name", room.PropertyId);
    return View(room);
}
    }
}