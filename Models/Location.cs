using System;
using System.Collections.Generic;

namespace Web_Management_Booking_N4.Models;

public partial class Location
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Property> Properties { get; set; } = new List<Property>();
}
