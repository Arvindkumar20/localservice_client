import {
  deleteService,
  getServices,
} from "@/services/api/professional.service";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  User,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  MoreVertical,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProfessionalApi } from "@/hooks/useProfessionalApi";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    experience: "",
    pricing: "",
    availability: [],
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState("");
  const { updateService } = useProfessionalApi("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getServices();
      console.log(res);
      setServices(res.services);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const categories = [
    "all",
    ...new Set(
      services.map((s) => s.professional?.categoryName).filter(Boolean),
    ),
  ];

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" ||
      service.professional?.categoryName === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      service.professional?.user?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      service.professional?.categoryName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      service._id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setEditFormData({
      experience: service.experience || "",
      pricing: service.pricing || "",
      availability: service.availability ? [...service.availability] : [],
    });
    setEditError("");
    setEditSuccess(false);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError("");

    try {
      // Validate form
      if (!editFormData.experience || editFormData.experience <= 0) {
        throw new Error("Please enter valid experience years");
      }
      if (!editFormData.pricing || editFormData.pricing <= 0) {
        throw new Error("Please enter valid pricing");
      }

      // Here you would call your update API
      // const response = await updateService(selectedService._id, editFormData);

      // Simulate API call
      await updateService(selectedService._id, editFormData);

      // Update local state
      const updatedServices = services.map((service) =>
        service._id === selectedService._id
          ? {
              ...service,
              experience: editFormData.experience,
              pricing: editFormData.pricing,
              availability: editFormData.availability,
            }
          : service,
      );
      setServices(updatedServices);

      setEditSuccess(true);
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess(false);
      }, 1500);
    } catch (error) {
      setEditError(error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (service) => {
    console.log(service);
    if (
      confirm(
        `Are you sure you want to delete service for ${service.professional?.user?.name}?`,
      )
    ) {
      try {
        // Here you would call your delete API
        await deleteService(service._id);

        // Update local state
        setServices(services.filter((s) => s._id !== service._id));
        alert("Service deleted successfully!");
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service");
      }
    }
  };

  const handleAddAvailabilitySlot = () => {
    setEditFormData({
      ...editFormData,
      availability: [
        ...editFormData.availability,
        { startTime: "09:00", endTime: "17:00" },
      ],
    });
  };

  const handleRemoveAvailabilitySlot = (index) => {
    const newAvailability = editFormData.availability.filter(
      (_, i) => i !== index,
    );
    setEditFormData({
      ...editFormData,
      availability: newAvailability,
    });
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...editFormData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setEditFormData({
      ...editFormData,
      availability: newAvailability,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Service Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage all professional services
              </p>
            </div>
            <Link
              to={"/service-provider-dashboard/add-services"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Service
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, category, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Table
              </button>
            </div>

            <button
              onClick={fetchServices}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredServices.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {services.length}
              </span>{" "}
              services
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Limited Slots</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">No Slots</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Display */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {service.professional?.user?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {service.professional?.categoryName}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenId(
                              openId === service._id ? null : service._id,
                            )
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        {openId === service._id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                              onClick={() => handleViewDetails(service)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" /> View Details
                            </button>
                            <button
                              onClick={() => handleEdit(service)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(service)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">
                          {service.experience} years
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-green-600">
                          ₹{service.pricing}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Availability:
                        </span>
                      </div>
                      <div className="pl-6">
                        {service.availability?.length > 0 ? (
                          <div className="space-y-1">
                            {service.availability
                              .slice(0, 2)
                              .map((slot, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-xs text-gray-500"
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                              ))}
                            {service.availability.length > 2 && (
                              <p className="text-xs text-blue-600">
                                +{service.availability.length - 2} more slots
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-red-500">
                            No slots available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-b-xl flex gap-2">
                    <button
                      onClick={() => handleViewDetails(service)}
                      className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-white rounded-lg p-8">
                  <p className="text-gray-500">No services found</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Professional
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <tr
                      key={service._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {service.professional?.user?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {service.professional?.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {service.experience} years
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">
                          ₹{service.pricing}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {service.availability?.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {service.availability.length} slots
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-red-500">No slots</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(service)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Service Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">
                    Professional Name
                  </label>
                  <p className="font-medium">
                    {selectedService.professional?.user?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Category</label>
                  <p className="font-medium">
                    {selectedService.professional?.categoryName}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Experience</label>
                  <p className="font-medium">
                    {selectedService.experience} years
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Pricing</label>
                  <p className="font-medium text-green-600">
                    ₹{selectedService.pricing}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">Service ID</label>
                  <p className="font-mono text-sm">{selectedService._id}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">
                    Availability Slots
                  </label>
                  <div className="mt-2 space-y-2">
                    {selectedService.availability?.length > 0 ? (
                      selectedService.availability.map((slot, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded"
                        >
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-red-500">No availability slots</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEdit(selectedService);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Edit Service</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Professional Info (Read-only) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Professional Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Name</label>
                    <p className="text-sm font-medium">
                      {selectedService.professional?.user?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Category</label>
                    <p className="text-sm font-medium">
                      {selectedService?.professional?.categoryName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={editFormData.experience}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        experience: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing (₹)
                  </label>
                  <input
                    type="number"
                    value={editFormData.pricing}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        pricing: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="100"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Availability Slots
                    </label>
                    <button
                      onClick={handleAddAvailabilitySlot}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Slot
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editFormData.availability.map((slot, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                index,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                index,
                                "endTime",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveAvailabilitySlot(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ))}

                    {editFormData.availability.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                        No availability slots added. Click "Add Slot" to add.
                      </p>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {editError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{editError}</span>
                  </div>
                )}

                {/* Success Message */}
                {editSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">
                      Service updated successfully!
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditSubmit(editFormData._id)}
                disabled={editLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
