using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Management_Booking_N4.Data; // Đảm bảo namespace này trỏ đúng đến thư mục chứa ApplicationDbContext
using Web_Management_Booking_N4.Models;

namespace Web_Management_Booking_N4.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ApplicationDbContext _context; // Khai báo thêm biến kết nối Cơ sở dữ liệu

    // Inject cả ILogger và ApplicationDbContext vào Constructor
    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        // Kiểm tra quyền bảo mật: Nếu chưa đăng nhập Admin thì đá về trang Login
        if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminName")))
        {
            return RedirectToAction("Login", "Auth");
        }

        // 1. Thống kê số lượng đơn đặt phòng thành công (Đã thanh toán / Thành công)
        var successBookings = await _context.Bookings
            .Where(b => b.Status == "Success" || b.Status == "Confirmed" || b.Status == "Đã thanh toán")
            .ToListAsync();
        ViewBag.SuccessCount = successBookings.Count;

        // 2. Tính tổng số tiền thu vào từ các đơn đặt phòng thành công
        ViewBag.TotalRevenue = successBookings.Sum(b => b.TotalPrice);

        // 3. Đếm số lượng khách đặt phòng nhưng đang chờ Admin phê duyệt
        ViewBag.PendingCount = await _context.Bookings
            .Where(b => b.Status == "Pending" || b.Status == "Chờ xử lý")
            .CountAsync();

        // 4. Tính số lượng phòng đã được khách đặt (Các đơn hàng trừ đơn đã hủy)
        ViewBag.BookedRooms = await _context.Bookings
            .Where(b => b.Status != "Cancelled" && b.Status != "Đã hủy")
            .CountAsync();

        // 5. Tính toán số phòng còn trống thực tế dựa trên tổng số phòng của hệ thống
        var totalRooms = await _context.Rooms.CountAsync();
        ViewBag.AvailableRooms = totalRooms - ViewBag.BookedRooms;
        
        // Ngăn chặn hiển thị số âm nếu dữ liệu test chưa được đồng bộ chuẩn
        if (ViewBag.AvailableRooms < 0) ViewBag.AvailableRooms = 0;

        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
