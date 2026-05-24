using System;
using System.Collections.Generic;

namespace Web_Management_Booking_N4.Models;

public partial class Review
{
    public int Id { get; set; }

    public int? PropertyId { get; set; }

    public int? UserId { get; set; }

    public int? Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Property? Property { get; set; }

    public virtual User? User { get; set; }
}
