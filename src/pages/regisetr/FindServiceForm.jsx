// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import {  useNavigate } from "react-router-dom"

// const schema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   phone: z.string().min(10),
//   password: z.string().min(6),
//   address: z.string().min(5),
// })

// export default function FindServiceForm() {
//   const navigate=useNavigate();
//   const form = useForm({
//     resolver: zodResolver(schema),
//   })

//   const onSubmit = (data) => {
//     console.log("Customer Data:", data)
//     navigate("/my-bookings")
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow">

//         <h2 className="text-2xl font-semibold mb-6 text-center">
//           Create Customer Account
//         </h2>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

//             {["name", "email","password", "phone", "address"].map((field) => (
//               <FormField
//                 key={field}
//                 control={form.control}
//                 name={field}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="capitalize">
//                       {field.name}
//                     </FormLabel>
//                     <Input {...field} />
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             ))}

//             <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
//               Create Account
//             </Button>

//           </form>
//         </Form>
//       </div>
//     </div>
//   )
// }

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
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be 10 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
  address: z.string().min(5, "Address required"),
});

export default function FindServiceForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { registerCustomerHandler ,apiError} = useCustomerAuth();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", // 🔥 validate on change
  });

  // const onSubmit = async (data) => {
  //   try {
  //     console.log(data)
  //     const res = await registerCustomerHandler(data);
  //     console.log(res);
  //     alert("account created successfully");
  //     navigate("/my-bookings");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const onSubmit = async (data) => {
    try {
     
      setLoading(true);

      const res = await registerCustomerHandler(data);
      console.log(res);
      if (!apiError) {
        alert("Account created successfully");
        navigate("/my-bookings");
      }
    }
    finally {
      setLoading(false);
    }
  };

  const fields = ["name", "email", "password", "phone", "address"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Customer Account
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {fields.map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{fieldName}</FormLabel>

                    <Input {...field} />

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
              type="submit"
              disabled={!form.formState.isValid || loading}
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
