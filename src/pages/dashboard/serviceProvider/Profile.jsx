"use client";

import { useEffect, useState } from "react";
import { 
  Bell, DollarSign, TrendingUp, Clock, CheckCircle, 
  AlertCircle, Loader2, User, Calendar, MapPin 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfessionalProfile } from "@/services/api/professional.service";


export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(null);
  const [error, setError] = useState(null);
  const [showAllRequests, setShowAllRequests] = useState(false);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const data = await getProfessionalProfile();
      console.log(data)
      setProfile(data);
    } catch (err) {
      console.log(err)
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    }
  };

  useEffect(()=>{
    fetchProfile();
  },[])
  // Fetch booking requests
  const fetchBookingRequests = async () => {
    try {
      const data = "await getBookingRequests()";
      setBookingRequests(data);
    } catch (err) {
      console.error("Error fetching booking requests:", err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchBookingRequests()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Handle availability toggle
  const handleAvailabilityToggle = async (checked) => {
    setUpdatingAvailability(true);
    try {
      // await updateAvailability(checked);
      setProfile(prev => prev ? { ...prev, isAvailable: checked } : null);
    } catch (err) {
      console.error("Error updating availability:", err);
      setError("Failed to update availability status");
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  // Handle accept booking request
  const handleAcceptRequest = async (requestId) => {
    setProcessingRequest(requestId);
    try {
      // await acceptBookingRequest(requestId);
      // Update local state
      setBookingRequests(prev =>
        prev.map(req =>
          req._id === requestId ? { ...req, status: "accepted" } : req
        )
      );
      // Refresh stats
      await fetchProfile();
    } catch (err) {
      console.error("Error accepting request:", err);
      setError("Failed to accept booking request");
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Handle decline booking request
  const handleDeclineRequest = async (requestId) => {
    setProcessingRequest(requestId);
    try {
      // await declineBookingRequest(requestId);
      // Update local state
      setBookingRequests(prev =>
        prev.map(req =>
          req._id === requestId ? { ...req, status: "declined" } : req
        )
      );
    } catch (err) {
      console.error("Error declining request:", err);
      setError("Failed to decline booking request");
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Filter pending requests
  const pendingRequests = bookingRequests.filter(req => req.status === "pending");
  const displayedRequests = showAllRequests ? pendingRequests : pendingRequests.slice(0, 2);

  // Get urgency badge color
  const getUrgencyBadge = (isUrgent) => {
    if (isUrgent) {
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "URGENT"
      };
    }
    return {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "PENDING"
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Failed to load profile</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Error Toast */}
        {error && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={profile.user?.avatar || "/avatar.jpg"} />
              <AvatarFallback>
                {profile.user?.name?.split(" ").map(n => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Welcome Back
              </p>
              <h1 className="text-2xl font-bold">{profile.user?.name || "Professional"}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {profile.categoryName || "Service Provider"} • {profile.experience || 0} years experience
              </p>
            </div>
          </div>

          <div className="bg-white rounded-full p-3 shadow cursor-pointer hover:shadow-md transition-shadow">
            <Bell className="h-5 w-5" />
          </div>
        </div>

        {/* Availability + Earnings Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Availability Card */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${profile.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                  Availability Status
                </h2>
                <p className="text-muted-foreground mt-2">
                  {profile.isAvailable 
                    ? "You are appearing as online for new jobs" 
                    : "You are currently offline. New job requests won't be sent."}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Switch 
                  checked={profile.isAvailable}
                  onCheckedChange={handleAvailabilityToggle}
                  disabled={updatingAvailability}
                  className="data-[state=checked]:bg-teal-600"
                />
                {updatingAvailability && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Earnings Card */}
          <Card className="bg-teal-700 text-white rounded-2xl shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-lg">Monthly Earnings</p>
                <DollarSign className="h-5 w-5" />
              </div>

              <h2 className="text-4xl font-bold">
                ${profile.monthlyEarnings?.toLocaleString() || "0.00"}
              </h2>

              {profile.earningsGrowth && (
                <div className="inline-flex items-center gap-2 bg-teal-600 px-4 py-1 rounded-full text-sm">
                  <TrendingUp className="h-4 w-4" />
                  {profile.earningsGrowth}% from last month
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Today's Jobs</p>
              <h2 className="text-3xl font-bold mt-2">{profile.stats?.todayJobs || 0}</h2>
              <p className="text-sm text-teal-600 mt-1">active</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Pending</p>
              <h2 className="text-3xl font-bold mt-2">{profile.stats?.pendingJobs || 0}</h2>
              <p className="text-sm text-yellow-500 mt-1">awaiting response</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Completed</p>
              <h2 className="text-3xl font-bold mt-2">{profile.stats?.completedJobs || 0}</h2>
              <p className="text-sm text-green-500 mt-1">this month</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <p className="text-muted-foreground">Total Earnings</p>
              <h2 className="text-3xl font-bold mt-2">${profile.stats?.totalEarnings?.toLocaleString() || "0"}</h2>
              <p className="text-sm text-blue-500 mt-1">lifetime</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Requests */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Booking Requests</h2>
              <p className="text-sm text-gray-500 mt-1">
                {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
              </p>
            </div>
            {pendingRequests.length > 2 && (
              <button 
                onClick={() => setShowAllRequests(!showAllRequests)}
                className="text-teal-600 font-medium hover:underline"
              >
                {showAllRequests ? "Show less" : "View all"}
              </button>
            )}
          </div>

          {displayedRequests.length > 0 ? (
            displayedRequests.map((request) => {
              const urgency = getUrgencyBadge(request.urgency);
              const isProcessing = processingRequest === request._id;
              
              return (
                <Card key={request._id} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`${urgency.bg} ${urgency.text} px-3 py-1 rounded-full text-xs font-semibold`}>
                          {urgency.label}
                        </span>
                        {request.urgency && (
                          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                            Immediate Action Required
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {request.clientId?.name || "Client"}
                          {request.serviceId && (
                            <span className="text-sm font-normal text-gray-500">
                              • {request.serviceId.title}
                            </span>
                          )}
                        </h3>
                        
                        {request.location && (
                          <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {request.location.address} • {request.location.distance} miles away
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(request.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{request.scheduledTime?.start} - {request.scheduledTime?.end}</span>
                        </div>
                        {request.serviceId?.pricing && (
                          <div className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="h-4 w-4" />
                            <span>${request.serviceId.pricing}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <Button 
                        onClick={() => handleAcceptRequest(request._id)}
                        disabled={isProcessing}
                        className="bg-teal-700 hover:bg-teal-800 rounded-xl disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Accept Request
                      </Button>
                      <Button 
                        onClick={() => handleDeclineRequest(request._id)}
                        disabled={isProcessing}
                        variant="secondary" 
                        className="rounded-xl disabled:opacity-50"
                      >
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle className="h-12 w-12 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600">No pending requests</h3>
                  <p className="text-sm text-gray-400">
                    When clients book your services, you'll see them here
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity Section */}
        {bookingRequests.filter(req => req.status !== "pending").length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <div className="grid gap-3">
              {bookingRequests
                .filter(req => req.status !== "pending")
                .slice(0, 3)
                .map((request) => (
                  <Card key={request._id} className="rounded-xl shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          request.status === "accepted" ? "bg-green-500" : "bg-red-500"
                        }`} />
                        <div>
                          <p className="font-medium">
                            {request.status === "accepted" ? "Accepted" : "Declined"} - {request.clientId?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {request.serviceId?.title}
                      </span>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}