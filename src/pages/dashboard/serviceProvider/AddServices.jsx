"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { professionalSchema } from "@/utils/validations";
import { useCustomerAuth } from "@/context/AuthContextCustomer";
import { useProfessionalApi } from "@/hooks/useProfessionalApi";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddServices() {
  // Get authenticated user data from auth context
  const { user } = useCustomerAuth();

  // Get professional API methods and states from custom hook
  const { addService, isLoading, data } = useProfessionalApi();
  const navigate = useNavigate();
  
  // Local state for form submission feedback
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  // State to store expertise as string for UI
  const [expertiseString, setExpertiseString] = useState("");

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name:  "",
      title: "",
      location: "",
      experience: 0,
      rating: 0,
      jobs: 0,
      startingPrice: 0,
      expertise: [],
      services: [{ serviceTitle: "", description: "", price: 0 }],
    },
  });

  // Setup dynamic field array for services
  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  // Watch expertise field to sync with string state
  const expertiseArray = watch("expertise");

  // Initialize expertiseString from existing array when form loads
  useEffect(() => {
    if (
      expertiseArray &&
      Array.isArray(expertiseArray) &&
      expertiseArray.length > 0
    ) {
      setExpertiseString(expertiseArray.join(", "));
    } else if (expertiseArray === "") {
      setExpertiseString("");
    }
  }, []);

  /**
   * Handles expertise input change
   * Converts string input to array for validation
   */
  const handleExpertiseChange = (e) => {
    const value = e.target.value;
    setExpertiseString(value);

    // Convert comma-separated string to array for form validation
    const expertiseArray = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    // Update the form value with array for validation
    setValue("expertise", expertiseArray, { shouldValidate: true });
  };

  /**
   * Handles form submission with proper array conversion
   */
  const onSubmit = async (formData) => {
    setSubmitError(null);
    setShowSuccess(false);

    console.log("Form submitted with data:", formData);

    // Clone the data to avoid mutating the original
    const submissionData = { ...formData };

    // Ensure expertise is always an array
    if (!submissionData.expertise || !Array.isArray(submissionData.expertise)) {
      submissionData.expertise = [];
    }

    // Filter out empty services before submission
    if (submissionData.services && Array.isArray(submissionData.services)) {
      submissionData.services = submissionData.services.filter(
        (service) => service.serviceTitle && service.serviceTitle.trim() !== "",
      );

      // If no services left, add a default one
      if (submissionData.services.length === 0) {
        submissionData.services = [
          { serviceTitle: "", description: "", price: 0 },
        ];
      }
    }

    console.log("Processed data for API:", submissionData);

    try {
      // Call the API through our custom hook
      const res = await addService(user?._id, submissionData, {
        redirectTo: "/professional/dashboard",
        successMessage: "Professional profile created successfully!",
      });

      setShowSuccess(true);
      navigate("/service-provider-dashboard/services");
      console.log("API Response:", res);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(
        error.message ||
          "Failed to create professional profile. Please try again.",
      );

      // Auto-hide error message after 5 seconds
      setTimeout(() => setSubmitError(null), 5000);
    }
  };

  /**
   * Handle form submission errors
   */
  const onError = (errors) => {
    console.log("Form validation errors:", errors);

    // Scroll to first error field
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      let errorElement;
      if (firstErrorField === "expertise") {
        errorElement = document.querySelector('[name="expertise-input"]');
      } else {
        errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      }

      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    }
  };

  /**
   * Get error message with better formatting
   */
  const getErrorMessage = (fieldError) => {
    if (!fieldError) return null;
    return fieldError.message;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-8 max-w-4xl mx-auto p-8"
      noValidate
    >
      {/* Success Message */}
      {showSuccess && (
        <Alert className="bg-green-50 border-green-500 text-green-700">
          <AlertDescription>
            ✓ Professional profile created successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {submitError && (
        <Alert className="bg-red-50 border-red-500 text-red-700">
          <AlertDescription>✗ {submitError}</AlertDescription>
        </Alert>
      )}

      {/* BASIC INFORMATION SECTION */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          {/* Full Name Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Service Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter your service name"
              {...register("name")}
              disabled={isLoading || isSubmitting}
              className={errors.name ? "border-red-500 focus:ring-red-500" : ""}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠️</span> {getErrorMessage(errors.name)}
              </p>
            )}
          </div>

          {/* Professional Title Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Service Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., Senior Electrician, HVAC Specialist"
              {...register("title")}
              disabled={isLoading || isSubmitting}
              className={
                errors.title ? "border-red-500 focus:ring-red-500" : ""
              }
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠️</span> {getErrorMessage(errors.title)}
              </p>
            )}
          </div>

          {/* Location Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="City, State or Full Address"
              {...register("location")}
              disabled={isLoading || isSubmitting}
              className={
                errors.location ? "border-red-500 focus:ring-red-500" : ""
              }
              aria-invalid={errors.location ? "true" : "false"}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠️</span> {getErrorMessage(errors.location)}
              </p>
            )}
          </div>

          {/* Professional Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Experience (Years)
              </label>
              <Input
                type="number"
                placeholder="Years of experience"
                {...register("experience", { valueAsNumber: true })}
                disabled={isLoading || isSubmitting}
                min="0"
                step="1"
                className={errors.experience ? "border-red-500" : ""}
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">
                  {getErrorMessage(errors.experience)}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Rating (0-5)
              </label>
              <Input
                type="number"
                placeholder="Average rating"
                step="0.1"
                min="0"
                max="5"
                {...register("rating", { valueAsNumber: true })}
                disabled={isLoading || isSubmitting}
              />
              <p className="text-xs text-gray-500">Optional - Will be updated automatically</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Jobs Completed
              </label>
              <Input
                type="number"
                placeholder="Total jobs"
                {...register("jobs", { valueAsNumber: true })}
                disabled={isLoading || isSubmitting}
                min="0"
                step="1"
              />
              <p className="text-xs text-gray-500">Optional - Will be updated automatically</p>
            </div>
          </div>

          {/* Starting Price Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Starting Price ($) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="Minimum service price"
              {...register("startingPrice", { valueAsNumber: true })}
              disabled={isLoading || isSubmitting}
              min="0"
              step="0.01"
              className={errors.startingPrice ? "border-red-500" : ""}
            />
            {errors.startingPrice && (
              <p className="text-red-500 text-sm">
                {getErrorMessage(errors.startingPrice)}
              </p>
            )}
            <p className="text-xs text-gray-500">
              This is your base hourly rate or starting price
            </p>
          </div>
        </CardContent>
      </Card>

    

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving service...
          </>
        ) : (
          "Save Service"
        )}
      </Button>
    </form>
  );
}