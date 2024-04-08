import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../components/Login";
import AddUser from "../components/AddUser";
import UpdateUser from "../components/UpdateUser";
import Dashboard from "../components/Dashboard";
import Publications from "../components/Publications";
import { UploadDoc } from "../components/UploadDoc";
import { Mainpage } from "../components/Mainpage";

const RoutesComp = () => {
  const { token } = useAuth();

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <Mainpage />,
        },
        {
          path: "/adduser/",
          element: <AddUser />
        },
        {
          path: "/updateUser/",
          element: <UpdateUser />
        },
        {
          path: "/dashboard/",
          element: <Dashboard />
        },
        {
          path: "/publications/",
          element: <Publications />
        },
        {
          path: "/uploaddoc/",
          element: <UploadDoc />
        },

      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForAuthenticatedOnly,
    ...(!token ? routesForNotAuthenticatedOnly : []),
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default RoutesComp;
