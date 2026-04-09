// hooks/useProfessionalApi.js
import { professionalService } from "@/services/api/professional.service";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

export const useProfessionalApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  // Create professional profile
  const createProfessionalProfile = async (formData, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await professionalService.createProfessionalProfile(formData);
      console.log(response);
      setData(response.data);

      // Show success alert
      alert(
        options.successTitle || "Success",

        options.successMessage || "Professional profile created successfully!",
        "default",
      );

      // Redirect if specified
      if (options.redirectTo) {
        navigate(options.redirectTo);
      }

      // Call onSuccess callback if provided
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response;
    } catch (error) {
      console.log(error);

      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setError(errorMessage);

      // Show error alert
      alert(
        options.errorTitle || "Error",
        options.errorMessage || errorMessage,
        "destructive",
      );

      // Call onError callback if provided
      if (options.onError) {
        options.onError(error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add service to professional
  const addService = async (professionalId, serviceData, options = {}) => {
    console.log("service data : ", serviceData);
    setIsLoading(true);
    setError(null);

    try {
      const response = await professionalService.addService(
        professionalId,
        serviceData,
      );
      setData(response.data);

      alert(
        options.successTitle || "Success",
        options.successMessage || "Service added successfully!",
        "default",
      );

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add service";
      setError(errorMessage);

      alert(
        options.errorTitle || "Error",
        options.errorMessage || errorMessage,
        "destructive",
      );

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update service
  const updateService = async (serviceId, serviceData, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await professionalService.updateService(
        serviceId,
        serviceData,
      );
      setData(response.data);

      alert(
        options.successTitle || "Success",
        options.successMessage || "Service updated successfully!",
        "default",
      );

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update service";
      setError(errorMessage);

      alert(
        options.errorTitle || "Error",
        options.errorMessage || errorMessage,
        "destructive",
      );

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete service
  const deleteService = async (serviceId, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await professionalService.deleteService(serviceId);
      setData(response.data);

      alert(
        options.successTitle || "Success",
        options.successMessage || "Service deleted successfully!",
        "default",
      );

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete service";
      setError(errorMessage);

      alert(
        options.errorTitle || "Error",
        options.errorMessage || errorMessage,
        "destructive",
      );

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add availability to service
  const addAvailability = async (serviceId, availabilityData, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await professionalService.addAvailability(
        serviceId,
        availabilityData,
      );
      setData(response.data);

      alert(
        options.successTitle || "Success",

        options.successMessage || "Availability added successfully!",
        "default",
      );

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add availability";
      setError(errorMessage);

      alert(
        options.errorTitle || "Error",
        options.errorMessage || errorMessage,
        "destructive",
      );

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get professional profile
  const getProfessionalProfile = async (options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await professionalService.getProfessionalProfile();
      console.log(response)
      setData(response.data);

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile";
      setError(errorMessage);

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update professional profile
  const updateProfessionalProfile = async (
    professionalId,
    profileData,
    options = {},
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await professionalService.updateProfessionalProfile(
        professionalId,
        profileData,
      );
      setData(response.data);

      alert(
        options.successTitle || "Success",
        options.successMessage || "Profile updated successfully!",
        "default",
      );

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      setError(errorMessage);

      alert(
        options.errorTitle || "Error",
        options.errorMessage || errorMessage,
        "destructive",
      );

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  // Reset state
  const resetState = () => {
    setIsLoading(false);
    setError(null);
    setData(null);
  };

  return {
    // State
    isLoading,
    error,
    data,

    // Methods
    createProfessionalProfile,
    addService,

    updateService,
    deleteService,
    addAvailability,
    getProfessionalProfile,
    updateProfessionalProfile,
    resetState,
  };
};
