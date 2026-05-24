using System;
using System.Collections.Generic;

namespace Web_Management_Booking_N4.Models;

public partial class Property
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string? Description { get; set; }

    public int? StarRating { get; set; }

    public int? LocationId { get; set; }

    public int? OwnerId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Location? Location { get; set; }

    public virtual User? Owner { get; set; }

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
