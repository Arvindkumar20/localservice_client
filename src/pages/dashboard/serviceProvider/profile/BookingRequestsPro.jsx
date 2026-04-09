import { updateBookingStatus } from "@/services/api/bookingsApi";
import BookingCardPro from "./BookingCardPro";
import { useState } from "react";

export default function BookingRequestsPro({ bookings: initialBookings = [] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // Track which booking is being updated

  const handleAction = async (bookingId, newStatus) => {
    try {
      setActionLoading(bookingId); // Set loading state for this specific booking
      
      // Call API to update status
      await updateBookingStatus(bookingId, { status: newStatus });
      
      // Update local state to reflect the change immediately
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      
      // Optional: Show success message
      // You can replace this with a toast notification
      console.log(`Booking ${bookingId} status updated to ${newStatus}`);
      
    } catch (err) {
      console.error("Error updating booking status:", err);
      // Optional: Show error message to user
      alert("Failed to update booking status. Please try again.");
    } finally {
      setActionLoading(null); // Clear loading state
    }
  };

  // If you want to handle refetching from API after update, you can use this function
  const refreshBookings = async () => {
    try {
      setLoading(true);
      // Call your API to fetch latest bookings
      // const response = await getBookings();
      // setBookings(response.data);
    } catch (err) {
      console.error("Error refreshing bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Requests</h2>
        <button 
          onClick={refreshBookings}
          className="text-teal-600 font-medium hover:text-teal-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "View all"}
        </button>
      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">
          No booking requests
        </div>
      ) : (
        <div className="flex items-center justify-start gap-5 flex-wrap">
          {bookings.map((b) => {
            // ✅ urgent = within next 24 hours
            const isUrgent =
              new Date(b.serviceDate).getTime() - Date.now() <
              24 * 60 * 60 * 1000;

            return (
              <BookingCardPro
                key={b._id}
                urgent={isUrgent}
                name={b.user?.name || "User"}
                image={b.user?.profilePicture || ""}
                service={`₹${b.service?.pricing || 0}`}
                distance="2 km away" // 👉 static for now
                time={`${new Date(
                  b.serviceDate,
                ).toDateString()} • ${b.timeSlot}`}
                bookingId={b._id}
                status={b.status}
                handleAction={handleAction}
                isLoading={actionLoading === b._id} // Pass loading state to child
              />
            );
          })}
        </div>
      )}
    </div>
  );
}