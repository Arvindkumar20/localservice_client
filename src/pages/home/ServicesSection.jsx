import { getAllServicesCategories } from "@/services/api/customerApis";
import {
  Wrench,
  Zap,
  GraduationCap,
  Brush,
  CookingPot,
  Flower2,
  Hammer,
  Scissors,
  Loader,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const iconMap = {
  "Plumber": Wrench,
  "plumber": Wrench,
  "Electrician": Zap,
  "electrician": Zap,
  "Tutor": GraduationCap,
  "tutor": GraduationCap,
  "Cleaner": Brush,
  "cleaner": Brush,
  "Cook": CookingPot,
  "cook": CookingPot,
  "Gardener": Flower2,
  "gardener": Flower2,
  "Handyman": Hammer,
  "handyman": Hammer,
  "Beauty": Scissors,
  "beauty": Scissors,
};

const DefaultIcon = Wrench;

export default function ServicesSection() {
  const navigate = useNavigate();
  const [servicesCategories, setServicesCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceCounts, setServiceCounts] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllServicesCategories();
      console.log(res);
      setServicesCategories(res.services);
      if (res?.data?.services && Array.isArray(res.data.services)) {
        // Count occurrences of each category
        const counts = {};
        const uniqueCategoriesMap = new Map();
        
        res.data.services.forEach(service => {
          const categoryName = service.categoryName;
          // Count services per category
          counts[categoryName] = (counts[categoryName] || 0) + 1;
          
          // Store unique categories
          if (!uniqueCategoriesMap.has(categoryName)) {
            uniqueCategoriesMap.set(categoryName, {
              name: categoryName,
              displayName: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
              id: service._id,
            });
          }
        });
        
        setServiceCounts(counts);
        setServicesCategories(Array.from(uniqueCategoriesMap.values()));
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 text-teal-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading services...</span>
        </div>
      </section>
    );
  }

  if (servicesCategories.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center py-20">
          <p className="text-gray-500">No services available at the moment</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Services
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Choose from our professional services
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {servicesCategories.map((category, index) => {
          const Icon = iconMap[category.categoryName] || iconMap[category.name?.toLowerCase()] || DefaultIcon;
          const serviceCount = serviceCounts[category.name] || 0;
          
          return (
            <div
              key={category.id || index}
              className="flex flex-col items-center text-center group cursor-pointer"
              onClick={() => {
                navigate(`/services/${category.categoryName}`);
              }}
            >
              {/* Icon Box with Badge */}
              <div className="relative">
                <div className="w-24 h-24 flex flex-col items-center justify-center rounded-2xl bg-gray-100 group-hover:bg-teal-50 transition-all duration-300 group-hover:shadow-md">
                  <Icon
                    size={36}
                    className="text-teal-600 group-hover:scale-110 transition-transform duration-300"
                  />
                <p>{category.categoryName}</p>

                </div>
                {serviceCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                    {serviceCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <p className="mt-4 text-gray-700 font-medium group-hover:text-teal-600 transition-colors">
                {category.displayName}
              </p>
              {serviceCount > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {serviceCount} {serviceCount === 1 ? 'professional' : 'professionals'}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}