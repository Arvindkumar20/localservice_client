// src/components/BookingCard.jsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { cancelBooking } from "@/services/api/bookingsApi";

// import { toast } from "react-hot-toast";

const BookingCard = ({
  id,
  image,
  status,
  title,
  provider,
  price,
  date,
  phone,
  timeSlot,
  statusColor,
  completed,
  paymentStatus,
  onRefresh,
}) => {
  const [cancelling, setCancelling] = useState(false);

  const getStatusStyles = (color) => {
    switch (color) {
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "teal":
        return "bg-teal-100 text-teal-800";
      case "gray":
        return "bg-gray-100 text-gray-800";
      case "red":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancelBooking = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );
    if (!confirmCancel) return;

    try {
      setCancelling(true);
      const response = await cancelBooking(id);
      if (response.success) {
        // toast.success("Booking cancelled successfully");
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      // toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const handleContact = () => {
    // toast.info("Contact feature coming soon!");
  };

  const handleReschedule = () => {
    // toast.info("Reschedule feature coming soon!");
  };

  const handleWriteReview = () => {
    // toast.info("Review feature coming soon!");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-48 h-48 md:h-auto">
            <img
              src={image || "https://via.placeholder.com/400"}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500";
              }}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusStyles(statusColor)}`}
                  >
                    {status}
                  </span>
                  {paymentStatus && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {paymentStatus === "paid" ? "Paid" : "Payment Pending"}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 mb-2">{provider}</p>
                <p className="text-teal-600 font-bold text-lg mb-3">{price}</p>
              </div>

              {/* Date and Time */}
              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{date}</span>
                </div>
                {timeSlot && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{timeSlot}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t flex-wrap">
              {status !== "COMPLETED" && status !== "CANCELLED" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReschedule}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={handleCancelBooking}
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelling..." : "Cancel"}
                  </Button>
                </>
              )}
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" onClick={handleContact}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </a>
              {status === "COMPLETED" && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={handleWriteReview}
                >
                  Write a Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
