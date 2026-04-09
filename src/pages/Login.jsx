import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/AuthContextCustomer";
// Inline schema since we are in a single-file environment
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number"),
});

export default function Login() {
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login,user } = useCustomerAuth();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError(null);
      setLoading(true);

      const res = await login(data);
      console.log(res);
      // login success
      setIsSuccess(true);


    if(res?.role=="customer"){
          navigate("/my-bookings");
    }
    if(res?.role=="professional"){
          navigate("/service-provider-dashboard");
    }
    
    
    } finally {
      setLoading(false);
    }
  };

  // if (isSuccess) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
  //       <Card className="w-full max-w-md text-center p-8 animate-in fade-in zoom-in duration-300">
  //         <div className="flex justify-center mb-4">
  //           <CheckCircle2 className="h-16 w-16 text-green-500" />
  //         </div>
  //         <CardTitle className="text-2xl font-bold mb-2">
  //           Login Successful!
  //         </CardTitle>
  //         <CardDescription className="text-lg">
  //           Welcome back to Local Service Connect.
  //         </CardDescription>
  //         <Button
  //           className="mt-6 w-full"
  //           onClick={() => window.location.reload()}
  //         >
  //           Go to Dashboard
  //         </Button>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-white">
      {/* Visual Side Panel - Hidden on Mobile */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Find the best local <span className="text-blue-400">experts</span>{" "}
            in seconds.
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Join thousands of users who connect with reliable service providers
            every day. Quality service, guaranteed.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400">15k+</div>
              <div className="text-sm text-slate-400">Verified Pros</div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400">4.9/5</div>
              <div className="text-sm text-slate-400">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-slate-50">
        <Card className="w-full max-w-md border-none shadow-2xl sm:shadow-none bg-transparent">
          <CardHeader className="space-y-1 pb-8 text-center sm:text-left">
            <div className="flex justify-center sm:justify-start mb-4 lg:hidden">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                LSC
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Social Login Section */}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            type="email"
                            placeholder="name@company.com"
                            className="pl-10 h-11 rounded-xl bg-white border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      {/* <div className="flex items-center justify-between">
                        <FormLabel className="font-semibold">Password</FormLabel>
                        <button type="button" className="text-xs text-blue-600 hover:underline font-medium">
                            Forgot password?
                        </button>
                      </div> */}
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 h-11 rounded-xl bg-white border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                            {...field}
                          />
                          <div onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                              <EyeOff className={"absolute right-1 top-2"} />
                            ) : (
                              <Eye className={"absolute right-1 top-2"} />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <div className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                    {serverError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !form.formState.isValid}
                  className="w-full h-12 rounded-xl text-md font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm mt-8 text-slate-600">
              Don’t have an account yet?{" "}
              <Link
                to={"/create-account"}
                className="text-blue-600 font-bold hover:underline"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
