import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/apolloClient.ts";
import Layout from "./components/layout/Layout.tsx";

import HomePage from "./components/pages/HomePage.tsx";
import DetailPage from "./components/pages/DetailPage.tsx";
import RegisterPage from "./components/pages/RegisterPage.tsx";

import { Toaster } from "@/components/ui/sonner";
import LoginPage from "./components/pages/LoginPage.tsx";
import ProfilePage from "./components/pages/ProfilePage.tsx";
import DashboardPage from "./components/pages/DashboardPage.tsx";
import ProtectPage from "./components/pages/ProtectPage.tsx";
import ResetPassword from "./components/pages/ResetPassword.tsx";
import ForgetPasswordPage from "./components/pages/ForgetPassword.tsx";
import PaymentPage from "./components/pages/Payment.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/rooms/:id",
        element: <DetailPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/reset",
        element: <ForgetPasswordPage />,
      },
      {
        path: "/profile",
        element: (
          <ProtectPage>
            <ProfilePage />
          </ProtectPage>
        ),
      },
      {
        path: "/bookings/:id/payment",
        element: (
          <ProtectPage>
            <PaymentPage />
          </ProtectPage>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectPage roles={["admin"]}>
            <DashboardPage />
          </ProtectPage>
        ),
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Toaster richColors />
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>
);
