
// BookingPage.jsx (Updated with proper available slots display)
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,

  CheckCircle,

  Loader,

  ChevronLeft,
  AlertCircle,

  Calendar as CalendarIcon,
} from "lucide-react";
import {
  createBooking,
  getAvailableTimeSlots,
} from "@/services/api/bookingsApi";


const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDataFromState = location.state?.bookingData;
  const [selectedService, setSelectedService] = useState(
    bookingDataFromState?.service || null,
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingStep, setBookingStep] = useState(
    bookingDataFromState?.service ? 3 : 1,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [serviceAvailability, setServiceAvailability] = useState([]);

  const [bookingData, setBookingData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequests: "",
    paymentMethod: "online",
  });

  // Get current date for min date selection
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today.setDate(today.getDate() + 30))
    .toISOString()
    .split("T")[0];

  // Get service availability from the passed data
  useEffect(() => {
    if (selectedService) {
      // Get availability from service data
      const availability =
        selectedService.availability ||
        selectedService.originalData?.availability ||
        [];
      setServiceAvailability(availability);
      // console.log("Service Availability:", availability);
    }
  }, [selectedService]);

  // Generate available time slots based on service availability
  const generateAvailableSlots = (date) => {
    if (!serviceAvailability.length) {
      return [];
    }

    // For demo purposes, generate time slots based on availability
    // In real app, you would fetch from API based on date
    const allSlots = [
      {
        slot: "09:00 AM - 10:00 AM",
        startTime: "09:00",
        endTime: "10:00",
        available: true,
      },
      {
        slot: "10:00 AM - 11:00 AM",
        startTime: "10:00",
        endTime: "11:00",
        available: true,
      },
      {
        slot: "11:00 AM - 12:00 PM",
        startTime: "11:00",
        endTime: "12:00",
        available: true,
      },
      {
        slot: "12:00 PM - 01:00 PM",
        startTime: "12:00",
        endTime: "13:00",
        available: true,
      },
      {
        slot: "02:00 PM - 03:00 PM",
        startTime: "14:00",
        endTime: "15:00",
        available: true,
      },
      {
        slot: "03:00 PM - 04:00 PM",
        startTime: "15:00",
        endTime: "16:00",
        available: true,
      },
      {
        slot: "04:00 PM - 05:00 PM",
        startTime: "16:00",
        endTime: "17:00",
        available: true,
      },
    ];

    // Filter slots based on service availability times
    const availableSlotsList = allSlots.filter((slot) => {
      const slotHour = parseInt(slot.startTime.split(":")[0]);

      // Check if slot time falls within any availability window
      return serviceAvailability.some((avail) => {
        const startHour = parseInt(avail.startTime?.split(":")[0] || 0);
        const endHour = parseInt(avail.endTime?.split(":")[0] || 24);
        return slotHour >= startHour && slotHour < endHour;
      });
    });

    return availableSlotsList;
  };
console.log(selectedService)
  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  const fetchAvailableSlots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Try to fetch from API first
      const response = await getAvailableTimeSlots({
        serviceId: selectedService.id,
        date: selectedDate,
      });

      // fetch(
      //   `/api/available-slots?serviceId=${selectedService.id}&date=${selectedDate}`,
      // );
      // const data = await response.json();
console.log(response)
      if (response?.success && response?.availableSlots) {
        setAvailableSlots(response?.availableSlots);
      } else {
        // Fallback to generating slots from service availability
        const generatedSlots = generateAvailableSlots(selectedDate);
        setAvailableSlots(generatedSlots);

        if (generatedSlots.length === 0) {
          setError(
            "No available slots for this date based on service availability.",
          );
        }
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
      // Fallback to generating slots from service availability
      const generatedSlots = generateAvailableSlots(selectedDate);
      setAvailableSlots(generatedSlots);

      if (generatedSlots.length === 0) {
        setError(
          "No available slots for this date. Please check service availability.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setBookingStep(3);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setError(null);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (bookingStep === 3 && selectedDate && selectedTimeSlot) {
      setBookingStep(4);
    } else if (bookingStep === 2 && selectedService) {
      setBookingStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      setError("Please complete all required fields");
      return;
    }

    if (
      !bookingData.customerName ||
      !bookingData.customerEmail ||
      !bookingData.customerPhone
    ) {
      setError("Please fill in your contact information");
      return;
    }

    setIsLoading(true);
    setError(null);

    const bookingPayload = {
      serviceId: selectedService.id,
      serviceDate: selectedDate,
      timeSlot: selectedTimeSlot.slot,
      startTime: selectedTimeSlot.startTime,
      serviceName:"",
      endTime: selectedTimeSlot.endTime,
      specialRequests: bookingData.specialRequests,
      paymentMethod: bookingData.paymentMethod,
      totalAmount:selectedService.price,
      customerDetails: {
        name: bookingData.customerName,
        email: bookingData.customerEmail,
        phone: bookingData.customerPhone,
      },
    };

    try {
      const response = await createBooking(bookingPayload);
      console.log(response);
      if (response?.success) {
        setBookingId(response._id);
        setSuccess(true);
        setBookingStep(5);
      } else {
        throw new Error(response.message || "Booking failed");
      }
    } catch (err) {
      setError(err.message);
      console.error("Booking error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToServices = () => {
    navigate("/");
  };

  // Success State
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully scheduled.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Booking ID:</p>
              <p className="text-lg font-mono font-bold text-blue-600 mb-4">
                {bookingId}
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to{" "}
                  {bookingData.customerEmail}
                </p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBackToServices}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Book Another Service
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Book Your Service
          </h1>
          <p className="text-gray-600">
            {selectedService
              ? `Booking: ${selectedService.name}`
              : "Complete your booking details"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            {[
              { step: 1, label: "Select Professional" },
              { step: 2, label: "Choose Service" },
              { step: 3, label: "Pick Date & Time" },
              { step: 4, label: "Confirm Details" },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all
                    ${
                      bookingStep >= item.step
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {bookingStep > item.step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    item.step
                  )}
                </div>
                <p
                  className={`text-sm hidden md:block ${
                    bookingStep >= item.step
                      ? "text-blue-600 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="relative max-w-3xl mx-auto mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full">
              <div
                className="h-1 bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${((bookingStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Step 3: Select Date & Time */}
              {bookingStep === 3 && selectedService && (
                <div>
                  <div className="mb-6">
                    <button
                      onClick={handlePreviousStep}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Choose Date & Time
                  </h2>

                  {/* Service Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      Selected Service:{" "}
                      <span className="font-bold">{selectedService.name}</span>
                    </p>
                    <p className="text-sm text-blue-800">
                      Price:{" "}
                      <span className="font-bold">
                        ₹{selectedService.price}
                      </span>
                    </p>
                    <p className="text-sm text-blue-800">
                      Duration:{" "}
                      <span className="font-bold">
                        {selectedService.duration}
                      </span>
                    </p>
                    {serviceAvailability.length > 0 && (
                      <p className="text-xs text-blue-600 mt-2">
                        Available Hours:{" "}
                        {serviceAvailability
                          .map((a) => `${a.startTime} - ${a.endTime}`)
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Date Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      max={maxDate}
                      value={selectedDate || ""}
                      onChange={(e) => handleDateSelect(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Time Slots
                      </label>
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader className="animate-spin w-6 h-6 text-blue-500" />
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableSlots.length > 0 ? (
                              availableSlots.map((slot, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleTimeSlotSelect(slot)}
                                  className={`px-4 py-3 rounded-lg border transition-all ${
                                    selectedTimeSlot?.slot === slot.slot
                                      ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300"
                                      : "hover:border-blue-300 hover:bg-blue-50 border-gray-200"
                                  }`}
                                >
                                  <Clock className="w-4 h-4 inline-block mr-2" />
                                  {slot.slot}
                                </button>
                              ))
                            ) : (
                              <div className="col-span-full text-center py-8">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">
                                  No available slots for this date.
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                  Please select another date.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Legend */}
                          {availableSlots.length > 0 && (
                            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                                <span>Selected Slot</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                                <span>Available Slot</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Confirm Details */}
              {bookingStep === 4 && (
                <div>
                  <div className="mb-6">
                    <button
                      onClick={handlePreviousStep}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back to Date & Time
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Confirm Your Booking
                  </h2>

                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contact Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="customerName"
                            value={bookingData.customerName}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="customerEmail"
                            value={bookingData.customerEmail}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="customerPhone"
                            value={bookingData.customerPhone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Method
                          </label>
                          <select
                            name="paymentMethod"
                            value={bookingData.paymentMethod}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="online">Online Payment</option>
                            <option value="cash">Cash at Service</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        name="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any special requirements or notes for the professional..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Booking Summary
              </h3>

              {selectedService && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Service</p>
                  <p className="font-medium text-gray-900">
                    {selectedService.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    ₹ {selectedService.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedService.duration}
                  </p>
                </div>
              )}

              {selectedDate && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              {selectedTimeSlot && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedTimeSlot.slot}
                  </p>
                </div>
              )}

              <div className="mb-6 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">
                    ₹ {selectedService?.price || 0}
                  </span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="space-y-3">
                {bookingStep > 1 && bookingStep < 4 && (
                  <button
                    onClick={handlePreviousStep}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}

                {bookingStep === 3 && (
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedDate || !selectedTimeSlot}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue to Confirmation
                  </button>
                )}

                {bookingStep === 4 && (
                  <button
                    onClick={handleSubmitBooking}
                    disabled={
                      isLoading ||
                      !bookingData.customerName ||
                      !bookingData.customerEmail ||
                      !bookingData.customerPhone
                    }
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="animate-spin w-4 h-4" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                )}
              </div>

              {/* Info Note */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 text-center">
                  By confirming, you agree to our terms and conditions.
                  Cancellation policy applies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
