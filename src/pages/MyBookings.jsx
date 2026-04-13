import { useState, useMemo, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, ArrowLeft, Loader2 } from "lucide-react";
import BookingCard from "@/components/BookingCard";
import { useNavigate } from "react-router-dom";
import { getUserBookings } from "@/services/api/bookingsApi";
// import { toast } from "react-hot-toast";

export default function MyBookings() {
  const [tab, setTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch bookings from API
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserBookings();
      
      console.log("API Response:", response);
      
      if (response.success) {
        // Transform API data to match component format
        const formattedBookings = response.data.map(booking => ({
          id: booking._id,
          image: booking.service?.professional?.user?.profilePicture || 
                 booking.image || 
                 "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/14235/production/_100058428_mediaitem100058424.jpg",
          status: booking.status?.toUpperCase() || "PENDING",
          category: getBookingCategory(booking),
          title: booking.service?.serviceName || "Service",
          provider: getProviderName(booking),
          price: `₹${booking.totalAmount}`,
          date: formatDate(booking.serviceDate),
          statusColor: getStatusColor(booking.status),
          completed: booking.status === "completed",
          timeSlot: booking.timeSlot,
          paymentStatus: booking.paymentStatus,
          serviceDate: booking.serviceDate,
          phone: booking?.user?.phone
        }));
        
        setBookings(formattedBookings);
      } else {
        setError("Failed to load bookings");
        // toast.error("Failed to load bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
      // toast.error(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Helper function to get booking category based on status and date
  const getBookingCategory = (booking) => {
    const now = new Date();
    const serviceDate = new Date(booking.serviceDate);
    const isFuture = serviceDate > now;
    
    if (booking.status === "completed" || booking.status === "cancelled") {
      return "history";
    }
    if (booking.status === "pending" && isFuture) {
      return "upcoming";
    }
    if (booking.status === "confirmed" && isFuture) {
      return "ongoing";
    }
    if (booking.status === "pending" && !isFuture) {
      return "history";
    }
    return "all";
  };

  // Helper function to get provider name
  const getProviderName = (booking) => {
    if (booking.user?.name) {
      return booking.user?.name;
    }
    if (booking.service?.professional?.categoryName) {
      return booking.service.professional.categoryName;
    }
    return "Professional";
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${month} ${day} • ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "pending":
        return "yellow";
      case "confirmed":
        return "teal";
      case "completed":
        return "gray";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  // Filter bookings based on selected tab
  const filteredBookings = useMemo(() => {
    if (tab === "all") {
      return bookings;
    }
    return bookings.filter((booking) => booking.category === tab);
  }, [bookings, tab]);

  // Handle refresh
  const handleRefresh = () => {
    fetchBookings();
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
          <p className="text-gray-500">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
          <h1 className="text-3xl font-semibold">My Bookings</h1>
          <Bell className="cursor-pointer" onClick={handleRefresh} />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-md bg-gray-200 rounded-xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Section Title */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-teal-600 font-semibold tracking-widest text-sm uppercase">
            {tab} bookings
          </h2>
          <span className="text-gray-500 text-sm">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'Request' : 'Requests'}
          </span>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                {...booking}
                onRefresh={handleRefresh}
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              {loading ? "Loading..." : "No bookings found in this category."}
            </div>
          )}
        </div>

        {/* Show loading more indicator */}
        {loading && bookings.length > 0 && (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-teal-600" />
          </div>
        )}
      </div>
    </div>
  );
}