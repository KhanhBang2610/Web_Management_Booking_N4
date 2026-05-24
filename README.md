# Web_Management_Booking_N4

Dự án Website quản lý đặt phòng khách sạn, căn hộ ở các thành phố du lịch phổ biến, được xây dựng theo mô hình kiến trúc **Monolithic** sử dụng công nghệ **ASP.NET Core MVC** (.NET 8.0 / .NET 9.0).

## 🛠 Công nghệ sử dụng
- **Framework:** ASP.NET Core MVC.
- **ORM / Data Access:** Entity Framework Core (EF Core).
- **Database:** MySQL (Cấu hình qua ApplicationDbContext).
- **Frontend tích hợp:** Razor Pages (`.cshtml`), HTML5, CSS3, JavaScript (Bootstrap & jQuery).

---

## 📂 Cấu trúc tổng thể của dự án (Root Directory)

```text
/Web_Management_Booking_N4
├── /Controllers         # Xử lý luồng điều hướng request và logic trung gian
│   ├── AuthController.cs
│   ├── BookingController.cs
│   ├── HomeController.cs
│   ├── LocationController.cs
│   ├── PropertyController.cs
│   ├── ReviewController.cs
│   ├── RoomController.cs
│   └── UserController.cs
├── /Data                # Lớp kết nối và cấu hình Cơ sở dữ liệu
│   └── ApplicationDbContext.cs
├── /Models              # Định nghĩa cấu trúc thực thể (Entity) và ViewModel
│   ├── Booking.cs
│   ├── ErrorViewModel.cs
│   ├── Location.cs
│   ├── Property.cs
│   ├── Review.cs
│   ├── Room.cs
│   └── User.cs
├── /Views               # Giao diện hiển thị người dùng (Razor Views)
│   ├── /Auth            # Màn hình xác thực (Đăng nhập, Đăng ký)
│   │   ├── Login.cshtml
│   │   └── Register.cshtml
│   ├── /Booking         # Màn hình liên quan đến đơn đặt phòng
│   │   ├── Details.cshtml
│   │   └── Index.cshtml
│   ├── /Home            # Trang chủ và trang điều khoản
│   │   ├── Index.cshtml
│   │   └── Privacy.cshtml
│   ├── /Location        # Quản lý/Hiển thị địa điểm du lịch
│   ├── /Property        # Quản lý/Hiển thị khách sạn, căn hộ
│   │   ├── Create.cshtml
│   │   ├── Edit.cshtml
│   │   └── Index.cshtml
│   ├── /Review          # Hiển thị và viết đánh giá
│   │   └── Index.cshtml
│   ├── /Room            # Quản lý/Hiển thị chi tiết phòng
│   ├── /Shared          # Bố cục dùng chung (Layouts, Partials)
│   │   ├── _AdminLayout.cshtml
│   │   ├── _Layout.cshtml
│   │   ├── _ValidationScriptsPartial.cshtml
│   │   └── Error.cshtml
│   ├── /User            # Thông tin tài khoản người dùng
│   ├── _ViewImports.cshtml  # Khai báo các thư viện, Namespace dùng chung cho Views
│   └── _ViewStart.cshtml    # Định nghĩa Layout mặc định khi render file View
├── /Properties          # Cấu hình môi trường chạy (launchSettings.json)
├── /wwwroot             # Chứa tài nguyên tĩnh (Tệp CSS, JS của Bootstrap, jQuery, Hình ảnh)
├── appsettings.json     # Chứa chuỗi kết nối Database (Connection Strings) và thiết lập ứng dụng
├── Program.cs           # Điểm khởi đầu ứng dụng (Cấu hình Services, Middleware, Routing)
└── Web_Management_Booking_N4.csproj # File quản lý package NuGet và cấu hình Project .NET


Để mở được giao diện của ASP NEt core để thực hiện đồ án:
1. Pull code từ github về máy (gõ lệnh git clone <link github> trong cmd)
2. Gõ lệnh: dotnet --list-sdks trên terminal dự án để coi phiên bản net SDK của máy mình
(ví dụ nếu hiện số 9 đầu tiên, thì nhập 3 lệnh sau để chạy:
dotnet add package Microsoft.EntityFrameworkCore --version 9.0.0
dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.0.0
dotnet add package Pomelo.EntityFrameworkCore.MySql --version 9.0.0
- Note: nếu hiện số 8 thì chỉ cần thay số 9 thành 8 rồi chạy là được.
3.Gõ lệnh: dotnet tool install --global dotnet-ef --version 9.0.0 (máy dùng phiên bản nào thì thay thành số đó)
4. Vào database My SQL workbench tạo database và tạo từng bảng bằng lệnh truy vấn:
-- 1. Tạo Database
CREATE DATABASE IF NOT EXISTS agoda_clone_db;
USE agoda_clone_db;

-- 2. Bảng Tỉnh thành/Địa điểm du lịch
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Người dùng (Khách hàng, Chủ nhà, Admin)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Customer', 'Host', 'Admin') DEFAULT 'Customer',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Cơ sở lưu trú (Khách sạn/Căn hộ)
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    description TEXT,
    star_rating INT DEFAULT 0,
    location_id INT,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Bảng Loại phòng
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    room_type VARCHAR(100) NOT NULL,
    base_price DECIMAL(15, 2) NOT NULL,
    capacity INT NOT NULL,
    total_rooms INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- 6. Bảng Đơn đặt phòng
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    room_id INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- 7. Bảng Đánh giá
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    user_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
Hiện dấu tích xanh hết là đúng.

4. chạy lệnh kết nối database trong terminal:
dotnet ef dbcontext scaffold "server=localhost;port=3306;database=agoda_clone_db;user=root;password=1234" Pomelo.EntityFrameworkCore.MySql -o Models --context-dir Data --context ApplicationDbContext --force 

nhớ đổi user và password tùy máy mỗi người thiết lập ban đầu nha. 

Bị cấn chỗ nào thì cứ nhắn lên group nhóm 4 hỏi tui! 