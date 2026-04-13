import { useEffect, useState } from "react";
import AvailabilityCardPro from "./AvailabilityCardPro";
import BookingRequestsPro from "./BookingRequestsPro";
import EarningsCardPro from "./EarningsCardPro";
import HeaderSectionPro from "./HeaderSectionPro";
import StatsCardsPro from "./StatsCardsPro";
import { useProfessionalApi } from "@/hooks/useProfessionalApi";
import axios from "axios";
import { useCustomerAuth } from "@/context/AuthContextCustomer";

export default function ProfilePro() {
  const { userToken, user, setUser, saveAuth } = useCustomerAuth();

  const [status, setstatus] = useState(user.status);
  const [isEditable, setIsEditable] = useState(false);
  const { getProfessionalProfile } = useProfessionalApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(userToken);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    available: user.status,
  });
  console.log(status);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  const handleAvailableStatus = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/professionals/availability`,
        { status: status }, // <-- body (agar kuch send nahi karna ho to empty object)
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      saveAuth({ ...user, status: status }, userToken);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleAvailableStatus();
  }, [status]);

  // ✅ Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await getProfessionalProfile();

        const { professional, services, bookings } = res;

        // ✅ Set User Data
        setUserData({
          name: professional?.user?.name || "",
          email: professional?.user?.email || "",
          image: professional?.user?.profilePicture || "",
          available: true,
        });

        // ✅ Set Services
        setServices(services || []);

        // ✅ Set Bookings (if exists)
        setBookings(bookings || []);

        // ✅ Derive availability
        // if (services?.length > 0) {
        //   const isAnyAvailable = services.some(
        //     (s) => s.availabilityStatus === "available",
        //   );
        setstatus(status);
        // }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Sync availability → userData
  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      available: status,
    }));
  }, [status]);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-6xl px-6 py-8 space-y-8">
        {/* 🔹 Header */}
        <HeaderSectionPro
          setUserData={setUserData}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          userData={userData}
        />

        {/* 🔹 Availability */}
        <AvailabilityCardPro
          setstatus={setstatus}
          status={status}
          services={services}
        />

        {/* 🔹 Stats + Earnings */}
        <div className="flex flex-wrap items-center gap-6">
          <EarningsCardPro bookings={bookings} />
          <StatsCardsPro services={services} bookings={bookings} />
        </div>

        {/* 🔹 Bookings */}
        <BookingRequestsPro bookings={bookings} />
      </div>
    </div>
  );
}
