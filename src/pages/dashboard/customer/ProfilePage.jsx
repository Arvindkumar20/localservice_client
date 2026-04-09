"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Home,
  Clock,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Save,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerAuth } from "@/context/AuthContextCustomer";

/* =========================
   ZOD SCHEMA
========================= */
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  googleMapLink: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      return /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.google\.com|goo\.gl\/maps)/i.test(
        val,
      );
    }, "Only valid Google Maps URL allowed"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  alternatePhone: z.string().optional().or(z.literal("")),

  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const today = new Date();
      const selectedDate = new Date(date);

      if (selectedDate > today) return false; // future not allowed

      let age = today.getFullYear() - selectedDate.getFullYear();
      const m = today.getMonth() - selectedDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
        age--;
      }

      return age >= 18;
    }, "You must be at least 18 years old"),
});

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [serverImage, setServerImage] = useState(null);
  const [error, setError] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isMapLocation, setIsMapLocation] = useState("");
  const { userToken } = useCustomerAuth();
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      dob: "",
      address: "",
      googleMapLink: "",
      phone: "",
      alternatePhone: "",
    },
    mode: "onChange",
  });

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/user/get-profile`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      const userData = data.data;
      //
      console.log(userData);
      setIsMapLocation(userData.gMapUrl);
      if (userData.dob) {
        userData.dob = new Date(userData.dob).toISOString().split("T")[0];
      }

      form.reset(userData);

      if (userData.profilePicture) {
        setServerImage(userData.profilePicture);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching profile:", err);
    } finally {
      setIsFetching(false);
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const getCurrentLocationMapUrl = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject("Geolocation not supported");
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          resolve(mapUrl);
        },
        (error) => {
          reject(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
      );
    });
  };

  const handleUseCurrentLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const mapUrl = await getCurrentLocationMapUrl();
      form.setValue("googleMapLink", mapUrl, {
        shouldValidate: true,
      });
    } catch (error) {
      alert("Unable to fetch location: " + error);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Append all fields
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      if (imageFile) {
        formData.append("profilePicture", imageFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/user/update-profile`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setSaveSuccess(true);
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);

      // Refresh profile data
      await fetchProfile();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-xl">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentImage =
    imagePreview || `${import.meta.env.VITE_IMAGE_API}${serverImage}`;
// console.log(`${import.meta.env.VITE_IMAGE_API}${serverImage}`)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-2xl rounded-2xl overflow-hidden border-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                {currentImage ? (
                  <AvatarImage src={currentImage} alt="Profile" />
                ) : (
                  <AvatarImage src="" />
                )}
                <AvatarFallback className="bg-blue-900 text-white text-2xl">
                  {getInitials(form.watch("name"))}
                </AvatarFallback>
              </Avatar>

              {isEditing && (
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-white text-blue-600 rounded-full p-2 hover:bg-blue-50 transition-colors shadow-md"
                    title="Upload image"
                  >
                    <Upload size={16} />
                  </label>
                  {(imagePreview || imageFile) && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-md"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className="hidden"
              disabled={!isEditing}
            />

            {!isEditing && (
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {form.watch("name") || "Your Name"}
                </h1>
                <p className="text-blue-100 flex items-center gap-1 mt-1">
                  <Mail size={14} />{" "}
                  {form.watch("email") || "email@example.com"}
                </p>
                {form.watch("phone") && (
                  <p className="text-blue-100 flex items-center gap-1 mt-1">
                    <Phone size={14} /> {form.watch("phone")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Alerts */}
          {saveSuccess && (
            <Alert className="bg-green-50 border-green-200 text-green-800 animate-in slide-in-from-top">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Profile updated successfully!</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="animate-in slide-in-from-top"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* PERSONAL DETAILS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Personal Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            placeholder="Enter your full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            value={form.watch("email")}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            placeholder="your@email.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <Phone className="h-3 w-3 inline mr-1" /> Phone Number
                          *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            placeholder="9876543210"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                            placeholder="Optional"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => {
                      const today = new Date();
                      const maxDate = new Date(
                        today.getFullYear() - 18,
                        today.getMonth(),
                        today.getDate(),
                      )
                        .toISOString()
                        .split("T")[0];

                      return (
                        <FormItem>
                          <FormLabel>
                            <Calendar className="h-3 w-3 inline mr-1" /> Date of
                            Birth *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              max={maxDate}
                              disabled={!isEditing}
                              className={!isEditing ? "bg-gray-50" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <Separator />

              {/* ADDRESS DETAILS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Address & Location</h3>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!isEditing}
                          className={`min-h-[80px] ${!isEditing ? "bg-gray-50" : ""}`}
                          placeholder="Enter your full street address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="googleMapLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Maps Location</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              disabled={!isEditing}
                              className={`flex-1 ${!isEditing ? "bg-gray-50" : ""}`}
                              placeholder="https://maps.google.com/..."
                            />
                            {isEditing && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleUseCurrentLocation}
                                disabled={isFetchingLocation}
                                className="whitespace-nowrap"
                              >
                                {isFetchingLocation ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Current Location
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isMapLocation && !isEditing && (
                    <a
                      href={isMapLocation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" /> View on Google Maps
                    </a>
                  )}
                </div>
              </div>

              <Separator />

              {/* Validation Summary */}
              {isEditing && Object.keys(form.formState.errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please fix {Object.keys(form.formState.errors).length}{" "}
                    error(s) before saving.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={handleEditClick}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={
                        isLoading ||
                        Object.keys(form.formState.errors).length > 0
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1"
                      size="lg"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
