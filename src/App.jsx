import React from "react";
import { Navbar } from "./components/layout/Navbar";
import { useLocation } from "react-router-dom";
import RoutePath from "./RoutePath";
import Locationbar from "./components/layout/Locationbar";
import { CustomerAuthProvider } from "./context/AuthContextCustomer";
// import FindProfessionals from "./pages/FindProfessionals";
export default function App() {
  const url = useLocation();
  const commomPath = ["/service-provider-dashboard"];
  const isNavAndTopBar = url.pathname.startsWith(commomPath);
  return (
    <>
      <CustomerAuthProvider>
        {!isNavAndTopBar && <Locationbar />}
        {!isNavAndTopBar && <Navbar />}

        <RoutePath />
      </CustomerAuthProvider>
    </>
  );
}
