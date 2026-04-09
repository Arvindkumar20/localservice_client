export default function AvailabilityCardPro({
  isAvailable,
  setIsAvailable,
  services,
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-4">
      
      {/* Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Availability</h2>

        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className={`px-4 py-1 rounded-lg text-white ${
            isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services?.map((service) => (
          <div
            key={service._id}
            className="border p-3 rounded-lg bg-gray-50"
          >
            <p><strong>Experience:</strong> {service.experience} yrs</p>
            <p><strong>Price:</strong> ₹{service.pricing}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-blue-600">
                {service.availabilityStatus}
              </span>
            </p>

            {/* Slots */}
            <div className="mt-2">
              <p className="font-medium">Slots:</p>
              {service.availability?.length > 0 ? (
                service.availability.map((slot) => (
                  <p key={slot._id} className="text-sm text-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-400">No slots</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}