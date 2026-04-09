"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Star,
  Clock,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Loader,
  AlertCircle,
  ChevronRight,
  Briefcase,
  Sparkles,
  TrendingUp,
  Shield,
  MessageCircle,
  Heart,
  BadgeCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllProfessionals } from "@/services/api/customerApis";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";

export default function FindProfessionals() {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  
  // State for professionals data
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [search, setSearch] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);
  const [topRated, setTopRated] = useState(false);
  const [underPrice, setUnderPrice] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [favorites, setFavorites] = useState([]);
  
  // State for services dialog
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showServicesDialog, setShowServicesDialog] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [hoveredProfessional, setHoveredProfessional] = useState(null);

  // Fetch professionals from API
  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllProfessionals({ limit: 10 });
      console.log("Full API Response:", response);

      let professionalsData = [];

      if (Array.isArray(response)) {
        professionalsData = response;
      } else if (response.professionals && Array.isArray(response.professionals)) {
        professionalsData = response.professionals;
      } else if (response.data && Array.isArray(response.data)) {
        professionalsData = response.data;
      } else {
        professionalsData = [];
      }

      // Transform the data
      const transformedProfessionals = professionalsData.map((item, index) => {
        let userData = null;
        if (item.userId) {
          userData = item?.userId;
        } else if (item.user) {
          userData = item?.user;
        } else {
          userData = { name: "", email: "" };
        }

        let userName = "Professional";
        let userEmail = "";
        let userImage = "";

        if (userData) {
          userName = userData?.name || userData.fullName || userData.displayName || "Professional";
          userEmail = userData?.email || "";
          userImage = userData?.image || userData?.profileImage || userData?.avatar || userData?.profilePicture || "";
        }

        if (userName === "Professional") {
          userName = item.name || item.fullName || item.professionalName || item.displayName || "Professional";
        }

        if (!userEmail) {
          userEmail = item.email || "";
        }

        if (!userImage) {
          userImage = item.image || item.profileImage || item.avatar || item.profilePicture || 
            `https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"}/${index + 30}.jpg`;
        }

        const categoryName = item.categoryName || item.role || item.specialization || item.profession || "Service Provider";
        const rating = item.rating || item.averageRating || 4.5;
        const reviews = item.reviews?.length || item.totalReviews || item.reviewCount || 0;
        const price = item?.services?.[0]?.pricing || item?.services?.[0]?.price || item?.price || 40;
        const serviceCount = item.services?.length || 0;

        return {
          id: item?._id || item.id || index,
          userId: userData?._id || item.userId?._id || item.userId,
          name: userName,
          email: userEmail,
          role: categoryName,
          specialization: item?.specialization || item?.specialty || categoryName,
          reviews: reviews,
          rating: rating,
          price: price,
          image: userImage,
          bio: item.bio || item.description || item.about,
          serviceCount: serviceCount,
          services: item.services || [],
          location: item.location || "Remote",
          experience: item.experience || Math.floor(Math.random() * 10) + 1,
          completedJobs: item.completedJobs || Math.floor(Math.random() * 500) + 50,
          nextDay: ["Today", "Tomorrow", "Monday", "Tuesday"][Math.floor(Math.random() * 4)],
          nextTime: `${Math.floor(Math.random() * 12) + 9} AM`,
          distance: (Math.random() * 5).toFixed(1),
          serviceCategory: categoryName.toLowerCase(),
          originalData: item,
        };
      });

      setProfessionals(transformedProfessionals);
    } catch (err) {
      console.error("Error fetching professionals:", err);
      setError("Failed to load professionals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    let result = [...professionals];

    // Search filter
    if (search) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.role.toLowerCase().includes(search.toLowerCase()) ||
          item.specialization.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Today filter
    if (todayOnly) {
      result = result.filter((item) => item.nextDay === "Today");
    }

    // Service category filter from URL params
    if (serviceName) {
      result = result.filter(
        (item) => item.serviceCategory === serviceName.toLowerCase()
      );
    }

    // Top rated filter
    if (topRated) {
      result = result.filter((item) => item.rating >= 4.5);
    }

    // Under price filter
    if (underPrice) {
      result = result.filter((item) => item.price < 60);
    }

    // Sorting
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "relevance") {
      result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [professionals, search, todayOnly, topRated, underPrice, sortBy, serviceName]);

  // Fetch services for professional
  const fetchProfessionalServices = async (professional) => {
    setSelectedProfessional(professional);
    setLoadingServices(true);

    try {
      if (professional.services && professional.services.length > 0) {
        setServices(professional.services);
      } else {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/professionals/services/${professional?.id || professional?.userId}`
        );

        let servicesData = [];
        if (Array.isArray(response)) {
          servicesData = response;
        } else if (response.services && Array.isArray(response.data.services)) {
          servicesData = response.services;
        } else if (response.data && Array.isArray(response.data)) {
          servicesData = response.data;
        } else {
          servicesData = [];
        }

        setServices(servicesData);
      }
      setShowServicesDialog(true);
    } catch (err) {
      console.error("Error fetching services:", err);
      if (professional.services && professional.services.length === 0) {
        setServices([]);
        setShowServicesDialog(true);
      } else {
        setError("Failed to load services. Please try again.");
      }
    } finally {
      setLoadingServices(false);
    }
  };

  // Handle service selection and navigate to booking
  const handleServiceSelect = (service) => {
    const bookingData = {
      service: {
        id: service._id || service.id,
        name: service?.serviceName||"",
        category: service.category || selectedProfessional.role,
        description: service?.title || `${service?.serviceName} by ${selectedProfessional?.name}`,
        price: service?.pricing || service?.price,
        duration: service?.duration || "1 hour",
        image: selectedProfessional.image,
        professionalId: selectedProfessional.id,
        professionalName: selectedProfessional.name,
        professionalUserId: selectedProfessional.userId,
        availability: service.availability || [
          { startTime: "09:00", endTime: "13:00" },
          { startTime: "14:00", endTime: "18:00" },
        ],
      },
      professional: {
        id: selectedProfessional.id,
        userId: selectedProfessional.userId,
        name: selectedProfessional.name,
        role: selectedProfessional.role,
        specialization: selectedProfessional.specialization,
        rating: selectedProfessional.rating,
        reviews: selectedProfessional.reviews,
        image: selectedProfessional.image,
        email: selectedProfessional.email,
      },
    };

    setShowServicesDialog(false);
    navigate("/booking", { state: { bookingData } });
  };

  // Toggle favorite
  const toggleFavorite = (professionalId) => {
    setFavorites((prev) =>
      prev.includes(professionalId)
        ? prev.filter((id) => id !== professionalId)
        : [...prev, professionalId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader className="animate-spin h-16 w-16 text-teal-600 mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-teal-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Finding best professionals for you...</p>
          <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (error && professionals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfessionals}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f6f8f7]">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-12 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Perfect Professional
              </h1>
              <p className="text-lg md:text-xl text-teal-100 mb-6">
                Connect with top-rated experts who bring excellence to every project
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-white/20 text-white border-none px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Verified Professionals
                </Badge>
                <Badge className="bg-white/20 text-white border-none px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  100% Secure Payments
                </Badge>
                <Badge className="bg-white/20 text-white border-none px-4 py-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Best Price Guarantee
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header with controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Find Professionals</h2>
              <p className="text-gray-600 mt-1">
                {serviceName ? `Showing results for ${serviceName}` : "Browse our top professionals"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <select
                className="border rounded-lg px-3 py-2 bg-white"
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="rating">Sort by: Rating</option>
                <option value="price">Sort by: Price (Low to High)</option>
              </select>

              <SlidersHorizontal className="cursor-pointer text-gray-600" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search professionals by name or role..."
                className="pl-9 h-11 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <Button
              variant={todayOnly ? "default" : "outline"}
              onClick={() => setTodayOnly(!todayOnly)}
              className={todayOnly ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>

            <Button
              variant={topRated ? "default" : "outline"}
              onClick={() => setTopRated(!topRated)}
              className={topRated ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              <Star className="h-4 w-4 mr-2 fill-current" />
              Top Rated
            </Button>

            <Button
              variant={underPrice ? "default" : "outline"}
              onClick={() => setUnderPrice(!underPrice)}
              className={underPrice ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              Under ₹60/hr
            </Button>
          </div>

          {/* Result Count */}
          <p className="mb-6 text-lg font-semibold text-gray-900">
            {filteredData.length} professional{filteredData.length !== 1 ? "s" : ""} found
          </p>

          {/* Professionals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((pro, index) => (
              <Card
                key={pro.id || index}
                className="group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onMouseEnter={() => setHoveredProfessional(pro.id)}
                onMouseLeave={() => setHoveredProfessional(null)}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Header Section */}
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 rounded-xl">
                          <AvatarImage src={pro.image} alt={pro.name} />
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                            {pro.name?.slice(0, 2).toUpperCase() || "PR"}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(pro.id);
                          }}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <Heart
                            className={`h-3 w-3 ${favorites.includes(pro.id) ? "fill-red-500 text-red-500" : "text-gray-400"} hover:scale-110 transition-transform`}
                          />
                        </button>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-teal-700 transition-colors">
                          {pro.name}
                        </h3>
                        <p className="text-sm text-teal-600 font-medium">
                          {pro.specialization || pro.role}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {pro.rating.toFixed(1)} ({pro.reviews} reviews)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-teal-700">
                        ₹{pro.price}<span className="text-sm">/hr</span>
                      </div>
                      {pro.serviceCount > 0 && (
                        <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200 text-xs">
                          {pro.serviceCount} services
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Availability & Location */}
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      Next: {pro.nextDay}, {pro.nextTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {pro.distance} miles away
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-xs text-gray-400 pt-2">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      <span>{pro.experience}+ years</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      <span>{pro.completedJobs}+ jobs</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 mt-2"
                    onClick={() => fetchProfessionalServices(pro)}
                    disabled={pro.serviceCount === 0}
                  >
                    {pro.serviceCount > 0 ? (
                      <>
                        View Services
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      "No Services Available"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredData.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Professionals Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any professionals matching your criteria.
                </p>
                <Button
                  onClick={() => {
                    setSearch("");
                    setTodayOnly(false);
                    setTopRated(false);
                    setUnderPrice(false);
                    setSortBy("relevance");
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Services Dialog */}
      <Dialog open={showServicesDialog} onOpenChange={setShowServicesDialog}>
        <DialogContent className="sm:max-w-3xl rounded-2xl max-h-[85vh] overflow-y-auto p-0">
          {/* Dialog Header with Professional Info */}
          {selectedProfessional && (
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-xl border-2 border-white shadow-lg">
                  <AvatarImage src={selectedProfessional.image} alt={selectedProfessional.name} />
                  <AvatarFallback className="bg-teal-500 text-white">
                    {selectedProfessional.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-white">
                    {selectedProfessional.name}
                  </DialogTitle>
                  <div className="flex items-center gap-3 mt-1 text-teal-100">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {selectedProfessional.rating?.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{selectedProfessional.reviews} reviews</span>
                    <span>•</span>
                    <span>{selectedProfessional.specialization}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowServicesDialog(false)}
                  variant="ghost"
                  className="text-white hover:bg-teal-700"
                >
                  ✕
                </Button>
              </div>
            </div>
          )}

          {/* Services List */}
          <div className="p-6">
            {loadingServices ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin h-8 w-8 text-teal-600" />
                <span className="ml-3 text-gray-600">Loading services...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {services.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Available Services</h3>
                      <p className="text-sm text-gray-500">Choose a service to book</p>
                    </div>
                    {services.map((service, index) => (
                      <Card
                        key={service._id || service.id || index}
                        className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-teal-200 cursor-pointer"
                      >
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                                {service?.serviceName||""}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">
                                {service?.title || `${service?.serviceName} by ${selectedProfessional?.name}`}
                              </p>
                              <div className="flex flex-wrap gap-3 text-sm">
                                <span className="flex items-center gap-1 text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  {service?.duration || "1 hour"}
                                </span>
                                {service.category && (
                                  <span className="flex items-center gap-1 text-gray-500">
                                    <Briefcase className="h-4 w-4" />
                                    {service?.category}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="bg-teal-50 rounded-lg px-4 py-2 mb-3">
                                <p className="text-2xl font-bold text-teal-600">
                                  ₹{service.pricing || service.price}
                                </p>
                                <p className="text-xs text-gray-500">per hour</p>
                              </div>
                              <Button
                                onClick={() => handleServiceSelect(service)}
                                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                              >
                                Book Now
                                <ChevronRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Available</h3>
                    <p className="text-gray-500">This professional hasn't added any services yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Please check back later or try another professional.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}