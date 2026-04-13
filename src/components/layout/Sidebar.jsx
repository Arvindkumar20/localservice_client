import React, { useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/logo.jpeg";
import { useCustomerAuth } from "@/context/AuthContextCustomer";
import { Button } from "../ui/button";

export function SidebarSection({ isSidebar, setIsSidebar, className }) {
  const { user } = useCustomerAuth();
  console.log(user);
  const url = useLocation();
  const { userToken, handleLogout } = useCustomerAuth();
  const redirectTo = "/service-provider-dashboard";
  const isDashboard = user?.role || false;
  return (
    <div className="relative ">
      <div className={` h-screen ${className}`}>
        {isSidebar && (
          <button
            onClick={() => setIsSidebar(!isSidebar)}
            className="absolute -right-5 top-2 cursor-pointer sm:p-3 p-4 bg-gray-200 text-red-500 hover:bg-gray-100 hover:font-bold  rounded-full "
          >
            <RxCross2 size={25} />
          </button>
        )}
        <div className={""}>
          <div className="w-28 h-28 rounded-full overflow-hidden mx-auto">
            <img
              src={logo}
              alt="Daily local services"
              className="w-full h-full object-cover"
            />
          </div>
          <NavigationMenu className={"  "}>
            <NavigationMenuList
              className={
                "flex flex-col items-center justify-center text-start w-44 mt-2"
              }
            >
              {/* home  */}
              <NavigationMenuLink asChild className={"w-44"}>
                <Link
                  className="focus:text-red-500 focus:underline no-underline w-44"
                  to="/"
                >
                  Home
                </Link>
              </NavigationMenuLink>
              {/* explore  */}
              <NavigationMenuLink asChild className={"w-44"}>
                <Link
                  className="focus:text-red-500 focus:underline no-underline"
                  // to={!isDashboard ? "/explore" : redirectTo}
                  to={!isDashboard ? "/explore" : "/service-provider-dashboard"}
                >
                  {isDashboard ? "Dashboard" : "Explore"}
                </Link>
              </NavigationMenuLink>
              {isDashboard && (
                <NavigationMenuLink asChild className={"w-44"}>
                  <Link
                    className="focus:text-red-500 focus:underline no-underline"
                    to={"/service-provider-dashboard/add-services"}
                  >
                    Add Services
                  </Link>
                </NavigationMenuLink>
              )}
              <NavigationMenuLink asChild className={"w-44"}>
                <Link
                  className="focus:text-red-500 focus:underline no-underline"
                  to={
                    !isDashboard
                      ? "/my-bookings"
                      : "/service-provider-dashboard/earnings"
                  }
                >
                  {isDashboard ? "Earnings" : "Bookings"}
                </Link>
              </NavigationMenuLink>
              {userToken && (
                <NavigationMenuLink asChild className={"w-44"}>
                  <Link
                    className="focus:text-red-500 focus:underline no-underline"
                    to={
                      !isDashboard
                        ? "/"
                        : "/service-provider-dashboard/services"
                    }
                  >
                    Services
                  </Link>
                </NavigationMenuLink>
              )}
              {userToken && (
                <NavigationMenuLink asChild className={"w-44"}>
                  <Link
                    className="focus:text-red-500 focus:underline no-underline"
                    to={
                      !isDashboard
                        ? "/customer/profile/1"
                        : "/service-provider-dashboard/profile"
                    }
                  >
                    Profile
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="absolute bottom-7 left-2 w-44 ">
          {!userToken ? (
            <Link
              className="px-10 hover:bg-gray-100 py-2 text-center rounded focus:text-red-500 focus:underline no-underline"
              to="/login"
            >
              Login
            </Link>
          ) : (
            <Button className={"cursor-pointer"} onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
