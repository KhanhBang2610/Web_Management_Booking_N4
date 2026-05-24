using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_Management_Booking_N4.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình dịch vụ lưu cache bộ nhớ và Session (Phục vụ Bài 10)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Phiên đăng nhập tồn tại trong 30 phút
    options.Cookie.HttpOnly = true;                 // Tăng cường bảo mật, chống tấn công XSS
    options.Cookie.IsEssential = true;
});

// 2. Cấu hình kết nối cơ sở dữ liệu MySQL thông qua DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 3. Đăng ký dịch vụ kiến trúc MVC (Controllers & Views) & HttpContextAccessor
builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor(); // <--- THÊM DÒNG NÀY: Giúp file Layout đọc mượt mà dữ liệu Session của Admin

var app = builder.Build();

// Cấu hình các bộ lọc Middleware xử lý Request Pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// 4. Kích hoạt Session (Phải đặt TRƯỚC UseAuthorization)
app.UseSession();
app.UseAuthorization();

// 5. Cấu hình định tuyến mặc định - Tự động mở trang Đăng Nhập (Login) khi chạy dự án
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Auth}/{action=Login}/{id?}");

app.Run();