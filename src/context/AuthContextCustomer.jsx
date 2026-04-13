// import {
//   createAccount,
//   createProfessionalService,
//   loginUser,
// } from "@/services/api";
// // import { createContext, useContext, useEffect, useState } from "react";

// // const AuthContextCustomer = createContext();

// // export const CustomerAuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [userToken, setUserToken] = useState(
// //     localStorage.getItem("token") || null
// //   );
// //   const [loading, setLoading] = useState(false);

// //   // ✅ Restore user on refresh
// //   useEffect(() => {
// //     const storedUser = localStorage.getItem("user");
// //     if (storedUser && userToken) {
// //       setUser(JSON.parse(storedUser));
// //     }
// //   }, [userToken]);

// //   // ✅ Register
// //   const register = async (data) => {
// //     try {
// //       setLoading(true);
// //       const res = await createAccount(data);

// //       const { user, token } = res.data.data;

// //       // Save
// //       localStorage.setItem("token", token);
// //       localStorage.setItem("user", JSON.stringify(user));

// //       // Update state (IMPORTANT for real-time UI)
// //       setUser(user);
// //       setUserToken(token);

// //       return res.data;
// //     } catch (error) {
// //       throw error.response?.data || error.message;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ Login
// //   const login = async (data) => {
// //     try {
// //       setLoading(true);
// //       const res = await loginUser(data);

// //       const { user, token } = res.data.data;

// //       localStorage.setItem("token", token);
// //       localStorage.setItem("user", JSON.stringify(user));

// //       setUser(user);
// //       setUserToken(token);

// //       return res.data;
// //     } catch (error) {
// //       throw error.response?.data || error.message;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ Logout (REAL-TIME FIX)
// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");

// //     setUser(null);        // 🔥 important
// //     setUserToken(null);  // 🔥 important
// //   };

// //   return (
// //     <AuthContextCustomer.Provider
// //       value={{
// //         user,
// //         userToken,
// //         loading,
// //         isAuthenticated: !!userToken,
// //         register,
// //         login,
// //         handleLogout,
// //       }}
// //     >
// //       {children}
// //     </AuthContextCustomer.Provider>
// //   );
// // };

// // export const useCustomerAuth = () => useContext(AuthContextCustomer);

// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContextCustomer = createContext();

// export const CustomerAuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [apiError, setApiError] = useState("");
//   const [userToken, setUserToken] = useState(
//     localStorage.getItem("token") || null,
//   );

//   const [loading, setLoading] = useState(false);

//   // Restore user
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");

//     if (storedUser && userToken) {
//       if (storedUser !== "undefined") {
//         setUser(JSON.parse(storedUser));
//       } else {
//         setUser(storedUser);
//       }
//     }
//   }, [userToken]);

//   // 🔐 CUSTOMER REGISTER
//   const registerCustomerHandler = async (data) => {
//     try {
//       setLoading(true);
//       const res = await createAccount(data);
//       console.log(res);
//       const { user, token } = res.data.data;

//       saveAuth(user, token);

//       return user;
//     } catch (error) {
//       console.log(error);
//       console.log("STATUS:", error?.response?.status);
//       console.log("BACKEND MESSAGE:", error?.response?.data);
//       // 🔥 Smart error handling
//       if (error?.response?.data?.message) {
//         setApiError(error.response.data.message);
//       } else if (error?.message) {
//         setApiError(error.message);
//       } else {
//         setApiError("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔐 PROFESSIONAL REGISTER (FILE UPLOAD)
//   const registerProfessional = async (data) => {
//     try {
//       setLoading(true);
//       const res = await createProfessionalService(data);
//       console.log(res);
//       const { user, token } = res.data.data;

//       saveAuth(user, token);

//       return user;
//     } catch (error) {
//       console.log(error);
//       // 🔥 Smart error handling
//       if (error?.response?.data?.message) {
//         setApiError(error.response.data.message);
//       } else if (error?.message) {
//         setApiError(error.message);
//       } else {
//         setApiError("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔐 LOGIN
//   const login = async (data) => {
//     try {
//       setLoading(true);

//       const res = await loginUser(data);
//       console.log("res : ",res);
//       const { user, token } = res.data.data;

//       saveAuth(user, token);

//       return user;
//     } catch (error) {

//       console.log("errro : ",error);
//       // 🔥 Smart error handling
//       if (error?.response?.data?.message) {
//         setApiError(error.response.data.message);
//       } else if (error?.message) {
//         setApiError(error.message);
//       } else {
//         setApiError("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ SAVE AUTH (COMMON FUNCTION)
//   const saveAuth = (user, token) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));

//     setUser(user);
//     setUserToken(token);
//   };

//   // 🔥 ROLE BASED LOGOUT
//   const handleLogout = () => {
//     localStorage.clear();
//     setUser(null);
//     setUserToken(null);
//   };

//   return (
//     <AuthContextCustomer.Provider
//       value={{
//         user,
//         role: user?.role,
//         isAuthenticated: !!userToken,
//         loading,
//         userToken,
//         apiError,
//         // methods
//         registerCustomerHandler,
//         registerProfessional,
//         login,
//         handleLogout,
//       }}
//     >
//       {children}
//     </AuthContextCustomer.Provider>
//   );
// };

// export const useCustomerAuth = () => useContext(AuthContextCustomer);



import { createContext, useContext, useEffect, useState } from "react";
import {
  createAccount,
  createProfessionalService,
  loginUser,
} from "@/services/api";

const AuthContextCustomer = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiError, setApiError] = useState("");
  const [userToken, setUserToken] = useState(
    localStorage.getItem("token") || null,
  );
  const [loading, setLoading] = useState(false);

  // Restore user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && userToken && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, [userToken]);

  // ✅ Clear error helper
  const clearError = () => setApiError("");

  // ✅ Handle errors consistently
  const handleError = (error) => {
    console.error("Auth error:", error);
    
    if (error?.response?.data?.message) {
      setApiError(error.response.data.message);
    } else if (error?.message) {
      setApiError(error.message);
    } else {
      setApiError("Something went wrong. Please try again.");
    }
    
    // Clear error after 5 seconds
    setTimeout(clearError, 5000);
  };

  // ✅ Save auth data
  const saveAuth = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setUserToken(token);
    clearError(); // Clear any previous errors on success
  };

  // 🔐 CUSTOMER REGISTER
  const registerCustomerHandler = async (data) => {
    setLoading(true);
    try {
      const res = await createAccount(data);
      const { user, token } = res.data.data;
      saveAuth(user, token);
      return user;
    } catch (error) {
      handleError(error);
      throw error; // Re-throw so component knows it failed
    } finally {
      setLoading(false);
    }
  };

  // 🔐 PROFESSIONAL REGISTER
  const registerProfessional = async (data) => {
    setLoading(true);
    try {
      const res = await createProfessionalService(data);
      console.log(res)
      const { user, token } = res.data.data;
      saveAuth(user, token);
      return user;
    } catch (error) {
      handleError(error);
      throw error; // Re-throw so component knows it failed
    } finally {
      setLoading(false);
    }
  };

  // 🔐 LOGIN
  const login = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      const { user, token } = res.data.data;
      saveAuth(user, token);
      return user;
    } catch (error) {
      handleError(error);
      throw error; // Re-throw so component knows it failed
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setUserToken(null);
    clearError();
  };

  return (
    <AuthContextCustomer.Provider
      value={{
        user,
        setUser,
        role: user?.role,
        isAuthenticated: !!userToken,
        loading,
        userToken,
        apiError,
        clearError,
        // methods
        registerCustomerHandler,
        registerProfessional,
        login,
        saveAuth,
        handleLogout,
      }}
    >
      {children}
    </AuthContextCustomer.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(AuthContextCustomer);
  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return context;
};