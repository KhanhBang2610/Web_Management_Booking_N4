using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Management_Booking_N4.Data;

namespace Web_Management_Booking_N4.Controllers
{
    public class ReviewController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ReviewController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. HIỂN THỊ DANH SÁCH ĐÁNH GIÁ
        public async Task<IActionResult> Index()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Property)
                .OrderByDescending(r => r.Id)
                .ToListAsync();

            return View(reviews);
        }

        // 2. XÓA ĐÁNH GIÁ (Nếu vi phạm tiêu chuẩn cộng đồng)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            TempData["Success"] = "Đã gỡ bỏ đánh giá của khách hàng thành công!";
            return RedirectToAction(nameof(Index));
        }
    }
}