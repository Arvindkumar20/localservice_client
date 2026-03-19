// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import FindProfessionals from "./pages/FindProfessionals";
// import ProfessionalProfile from "./pages/ProfessionalProfile";
// import BookServiceman from "./pages/BookServiceman";
// import MyBookings from "./pages/MyBookings";
// import LandingPage from "./pages/regisetr/LandingPage";
// import Login from "./pages/Login";
// import ServiceProviderDashboard from "./pages/ServiceProdiderDashboard";
// import Layout from "./pages/dashboard/Layout";
// import EarningsPage from "./pages/dashboard/serviceProvider/EarningsPage";
// import ProfilePro from "./pages/dashboard/serviceProvider/profile/ProfilePro";
// import AddServices from "./pages/dashboard/serviceProvider/AddServices";
// import ProfilePage from "./pages/dashboard/customer/ProfilePage";
// import { useCustomerAuth } from "./context/AuthContextCustomer";
// export default function RoutePath() {
//   const { userToken,user } = useCustomerAuth();
//   console.log(userToken);
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/create-account" element={<LandingPage />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/customer/profile/:id" element={<ProfilePage />} />
//       <Route path="/services/:serviceName" element={<FindProfessionals />} />
//       <Route
//         path="/service-provider-dashboard"
//         element={
//           <Layout>
//             <ServiceProviderDashboard />
//           </Layout>
//         }
//       />
//       <Route
//         path="/service-provider-dashboard/add-services"
//         element={
//           <Layout>
//             <AddServices />
//           </Layout>
//         }
//       />

//       <Route
//         path="/service-provider-dashboard/earnings"
//         element={
//           <Layout>
//             <EarningsPage />
//           </Layout>
//         }
//       />
//       <Route
//         path="/service-provider-dashboard/profile"
//         element={
//           <Layout>
//             <ProfilePro />
//           </Layout>
//         }
//       />

//       <Route path="/profile/:id" element={<ProfessionalProfile />} />
//       <Route path="/book-serviceman" element={<BookServiceman />} />
//       <Route
//         path={"/my-bookings"}
//         element={
//           userToken ? (
//             user?.role !== "professional" ? (
//               <MyBookings />
//             ) : (
//               <ServiceProviderDashboard />
//             )
//           ) : (
//             <Login></Login>
//           )
//         }
//       />
//       <Route path="/explore" element={<FindProfessionals />} />
//     </Routes>
//   );
// }



import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import FindProfessionals from "./pages/FindProfessionals";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import BookServiceman from "./pages/BookServiceman";
import MyBookings from "./pages/MyBookings";
import LandingPage from "./pages/regisetr/LandingPage";
import Login from "./pages/Login";

// Dashboard
import ServiceProviderDashboard from "./pages/ServiceProdiderDashboard";
import Layout from "./pages/dashboard/Layout";
import EarningsPage from "./pages/dashboard/serviceProvider/EarningsPage";
import ProfilePro from "./pages/dashboard/serviceProvider/profile/ProfilePro";
import AddServices from "./pages/dashboard/serviceProvider/AddServices";

// Customer
import ProfilePage from "./pages/dashboard/customer/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

// Protected Route


export default function RoutePath() {
  return (
    <Routes>
      {/* 🌍 Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/create-account" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/services/:serviceName" element={<FindProfessionals />} />
      <Route path="/profile/:id" element={<ProfessionalProfile />} />
      <Route path="/explore" element={<FindProfessionals />} />

      {/* 👤 Customer Routes */}
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/book-serviceman"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <BookServiceman />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/profile/:id"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 🧑‍🔧 Professional Routes */}
      <Route
        path="/service-provider-dashboard"
        element={
          <ProtectedRoute allowedRoles={["professional"]}>
            <Layout>
              <ServiceProviderDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/service-provider-dashboard/add-services"
        element={
          <ProtectedRoute allowedRoles={["professional"]}>
            <Layout>
              <AddServices />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/service-provider-dashboard/earnings"
        element={
          <ProtectedRoute allowedRoles={["professional"]}>
            <Layout>
              <EarningsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/service-provider-dashboard/profile"
        element={
          <ProtectedRoute allowedRoles={["professional"]}>
            <Layout>
              <ProfilePro />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}