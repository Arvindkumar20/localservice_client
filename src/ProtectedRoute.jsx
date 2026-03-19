import { Navigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/AuthContextCustomer";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { userToken, user } = useCustomerAuth();
console.log(allowedRoles)
  // 🔒 Not logged in
  console.log(userToken)
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }
console.log(user)
  // 🚫 Role not allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}