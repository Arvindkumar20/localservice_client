export default function AvailabilityCardPro({
  status,
  setstatus,
  services,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Availability Status
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your service availability
            </p>
          </div>

          <button
            onClick={() =>
              setstatus(status == "active" ? "inactive" : "active")
            }
            className={`
              relative inline-flex items-center justify-center px-6 py-2.5 rounded-xl
              font-semibold text-sm transition-all duration-300 ease-in-out
              transform hover:scale-105 active:scale-95 shadow-sm
              ${
                status == "active"
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${status == "active" ? "bg-green-200" : "bg-red-200"} animate-pulse`}
              ></span>
              {status == "active" ? "Available" : "Unavailable"}
            </span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="p-6">
        {services?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <p className="text-gray-500">No services added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services?.map((service) => (
              <div
                key={service._id}
                className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Service Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {service.name || "Service"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {service._id.slice(-8)}
                      </p>
                    </div>
                    <span
                      className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        service.availabilityStatus === "Available"
                          ? "bg-green-100 text-green-700"
                          : service.availabilityStatus === "Limited"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }
                    `}
                    >
                      {service.availabilityStatus || "Active"}
                    </span>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-5 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {service.experience}
                      </p>
                      <p className="text-xs text-gray-500">Years Experience</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        ₹{service.pricing}
                      </p>
                      <p className="text-xs text-gray-500">Price</p>
                    </div>
                  </div>

                  {/* Slots Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Available Time Slots
                      </p>
                      <span className="text-xs text-gray-400">
                        {service.availability?.length || 0} slots
                      </span>
                    </div>

                    {service.availability?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.availability.map((slot) => (
                          <div
                            key={slot._id}
                            className="bg-gradient-to-r from-gray-50 to-white rounded-lg px-3 py-2 text-sm border border-gray-100 hover:border-blue-200 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 font-medium">
                                {slot.startTime}
                              </span>
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                              <span className="text-gray-700 font-medium">
                                {slot.endTime}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <svg
                          className="w-8 h-8 text-gray-400 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm text-gray-500">
                          No slots available
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Add time slots for this service
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors">
                    Manage Slots
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
