import Searchbar from "@/components/Searchbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { loadAllServices } from "@/services/api/customerApis";
import { useNavigate } from "react-router-dom";

import React, { useEffect, useMemo, useState } from "react";

export default function ServiceCards() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 IMAGE FUNCTION SAME
  const getUnsplashImage = (categoryName) => {
    const unsplashImages = {
      Plumbing:
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format",
      Electrical:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format",
      Cleaning:
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format",
    };

    const cleanCategory = categoryName?.toLowerCase().trim();

    for (const [key, url] of Object.entries(unsplashImages)) {
      if (cleanCategory === key.toLowerCase()) return url;
    }

    return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format";
  };

  // ✅ FIXED availability check
  const hasAvailability = (service) => {
    if (service.availability && service.availability.length > 0) return true;
    if (service.availabilityStatus === "available") return true;
    return false;
  };

  // ✅ 🔥 MAIN FIX HERE
  const transformServiceData = (services) => {
    return services
      .filter(
        (service) => hasAvailability(service) && service.professional !== null, // ❗ null remove
      )
      .map((service, index) => {
        const category = service.professional?.categoryName || "Service";

        const user = service.professional?.user;

        return {
          id: service._id || index,

          btnText: service.serviceName,

          heading: `${service.serviceName} Service`,

          desc: `My name is ${user?.name} ${service.title}
          and My services started with ₹${service.pricing}`,

          image: getUnsplashImage(category),

          available: true,

          originalData: {
            serviceId: service._id,
            serviceName: category,
            serviceCategory: category,
            servicePrice: service.pricing,

            // ✅ FIXED
            professionalId: service.professional?._id,
            professionalName: user?.name || "Professional",

            availability: service.availability,
            availabilityStatus: service.availabilityStatus,
          },
        };
      });
  };

  // ✅ BOOK NOW (NO CHANGE IN UI)
  const handleBookNow = (card) => {
    const bookingData = {
      service: {
        id: card.id,
        name: card.heading,
        category: card.btnText,
        description: card.desc,
        price: card.originalData?.servicePrice || 0,
        image: card.image,
        professionalId: card.originalData?.professionalId,
        professionalName: card.originalData?.professionalName,
        availability: card.originalData?.availability,
      },
      professional: {
        id: card.originalData?.professionalId,
        name: card.originalData?.professionalName || "Professional",
        category: card.btnText,
      },
    };

    navigate("/booking", { state: { bookingData } });
  };

  // 🔥 FETCH
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await loadAllServices();

        let services = [];

        if (Array.isArray(response)) {
          services = response;
        } else if (response.services) {
          services = response.services;
        } else if (response.data) {
          services = response.data;
        }

        const transformed = transformServiceData(services);

        setAllServices(transformed);
        setFilteredCards(transformed);

        if (transformed.length === 0) {
          setError("No available services found");
        } else {
          setError(null);
        }
      } catch (err) {
        console.log(err);
        setError("Services Not Available ");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // 🔍 SEARCH SAME
  const filteredResults = useMemo(() => {
    if (!searchValue.trim()) return allServices;

    return allServices.filter((card) =>
      card.heading.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [searchValue, allServices]);

  useEffect(() => {
    setFilteredCards(searchValue ? filteredResults : allServices);
  }, [filteredResults, searchValue, allServices]);

  // ⏳ LOADING SAME
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error && filteredCards.length === 0) {
    return <div className="text-center text-red-500 py-2">{error}</div>;
  }

  // 🎨 UI SAME
  return (
    <div>
      <div className="flex justify-center my-5">
        <Searchbar searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      <div className="flex gap-5 overflow-x-auto px-4">
        {filteredCards.map((card, index) => (
          <Card key={card.id} className="max-w-[350px] flex-shrink-0">
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={card.image}
                  className="h-[200px] w-full object-cover rounded"
                />

                <Button
                  onClick={() => handleBookNow(card)}
                  className="absolute bottom-3 left-3"
                >
                  {card.btnText}
                </Button>
              </div>

              <CardTitle className="mt-3">{card.heading}</CardTitle>

              <CardDescription>{card.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
