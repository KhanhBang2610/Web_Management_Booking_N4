using System;
using System.Collections.Generic;

namespace Web_Management_Booking_N4.Models;

public partial class Room
{
    public int Id { get; set; }

    public int? PropertyId { get; set; }

    public string RoomType { get; set; } = null!;

    public decimal BasePrice { get; set; }

    public int Capacity { get; set; }

    public int TotalRooms { get; set; }

    public string? Amenities { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Property? Property { get; set; }
}
