import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { IoReorderThreeSharp } from "react-icons/io5";

import logo from "../../assets/logo.jpeg";

import { Link } from "react-router-dom";

import { SidebarSection } from "./Sidebar";
import { useCustomerAuth } from "@/context/AuthContextCustomer";
import { Button } from "../ui/button";
export function Navbar() {
  const [isSidebar, setIsSidebar] = useState(false);
  const { userToken, handleLogout, user } = useCustomerAuth();
  console.log(userToken);
  const visibility = isSidebar
    ? "md:hidden block bg-gray-100"
    : "md:hidden block";

  return (
    <div>
      <div
        className={
          isSidebar
            ? "hidden"
            : "flex items-center justify-between py-1 px-5 shadow-md"
        }
      >
        <div className="md:w-20 md:h-20 h-16 w-16 rounded-full overflow-hidden">
          <img
            src={logo}
            alt="Daily local services"
            className="w-full h-full object-cover"
          />
        </div>

        <button
          className="md:hidden block cursor-pointer"
          onClick={() => setIsSidebar(!isSidebar)}
        >
          <IoReorderThreeSharp size={30} />
        </button>

        <NavigationMenu className={"md:block hidden"}>
          <NavigationMenuList>
            {/* home  */}
            <NavigationMenuLink asChild>
              <Link
                className="focus:text-red-500 focus:underline no-underline"
                to="/"
              >
                Home
              </Link>
            </NavigationMenuLink>
            {/* explore  */}
            <NavigationMenuLink asChild>
              <Link
                className="focus:text-red-500 focus:underline no-underline"
                to="/explore"
              >
                Explore
              </Link>
            </NavigationMenuLink>
            {user?.role!=="professional"&&<NavigationMenuLink asChild>
              <Link
                className="focus:text-red-500 focus:underline no-underline"
                to="/my-bookings"
              >
                Booking
              </Link>
            </NavigationMenuLink>}
            {userToken && (
              <NavigationMenuLink asChild>
                {user?.role !== "professional" ? (
                  <Link
                    className="focus:text-red-500 focus:underline no-underline"
                    to="/customer/profile/1"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    className="focus:text-red-500 focus:underline no-underline"
                    to="/service-provider-dashboard"
                  >
                   Dashboard
                  </Link>
                )}
              </NavigationMenuLink>
            )}
            {!userToken ? (
              <NavigationMenuLink asChild>
                <Link
                  className="focus:text-red-500 focus:underline no-underline"
                  to="/login"
                >
                  Login
                </Link>
              </NavigationMenuLink>
            ) : (
              <Button className={"cursor-pointer"} onClick={handleLogout}>
                Logout
              </Button>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {isSidebar && (
        <div
          isSidebar={isSidebar}
          className={`${visibility} fixed z-50 w-48  h-screen  top-0 left-0 bg-white shadow-md px-2`}
        >
          <SidebarSection
            isSidebar={isSidebar}
            setIsSidebar={setIsSidebar}
            className={""}
          />
        </div>
      )}
    </div>
  );
}
