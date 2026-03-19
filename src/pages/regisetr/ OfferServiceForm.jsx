import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/AuthContextCustomer";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 chars"),
  phone: z.string().min(10, "Invalid phone"),
  categoryName: z.string().min(2, "Category required"),
  experience: z.coerce.number().min(1, "Experience required"),
  pricing: z.coerce.number().min(1, "Pricing required"),
});

export default function OfferServiceForm() {
  const { registerProfessional, loading,apiError } = useCustomerAuth();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      console.log("Sending:", data);



 
    

      // 🔥 call context function
      const user = await registerProfessional(data);
      console.log(user);
      // ✅ role based redirect
      if (user.role === "professional") {
        navigate("/service-provider-dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Professional Account
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: "name", label: "Name" },
              { name: "email", label: "Email" },
              { name: "password", label: "Password", type: "password" },
              { name: "phone", label: "Phone" },
              { name: "categoryName", label: "Category (e.g. Plumber)" },
              { name: "experience", label: "Experience", type: "number" },
              { name: "pricing", label: "Hourly Rate ₹", type: "number" },
            ].map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <Input type={item.type || "text"} {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
{apiError && (
  <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">
    {apiError}
  </div>
)}
            <Button
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
