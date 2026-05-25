using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Management_Booking_N4.Data;

namespace Web_Management_Booking_N4.Controllers
{
    public class BookingController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BookingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DANH SÁCH ĐƠN ĐẶT PHÒNG
        public async Task<IActionResult> Index()
        {
            // Lấy Booking kèm theo thông tin Khách hàng (User) và Loại phòng (Room) -> Khách sạn (Property)
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Room)
                    .ThenInclude(r => r.Property)
                .OrderByDescending(b => b.Id)
                .ToListAsync();

            return View(bookings);
        }

        // 2. CẬP NHẬT TRẠNG THÁI ĐƠN (Xác nhận / Hủy đơn nhanh)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateStatus(int id, string status)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            booking.Status = status;
            _context.Update(booking);
            await _context.SaveChangesAsync();

            TempData["Success"] = $"Đã cập nhật trạng thái đơn đặt phòng sang [{status}] thành công!";
            return RedirectToAction(nameof(Index));
        }
    }
}