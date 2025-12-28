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
import Bookings from "./components/pages/Bookings.tsx";
import InvoiceApp from "./components/invoice/Invoice.tsx";
import ManageRoom from "./components/pages/ManageRooms.tsx";
import CreateRoom from "./components/admin/room/CreateRoom.tsx";
import UpdateRoom from "./components/admin/room/UpdateRoom.tsx";

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
        path: "/admin/dashboard",
        element: (
          <ProtectPage roles={["admin"]}>
            <DashboardPage />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/rooms",
        element: (
          <ProtectPage roles={["admin"]}>
            <ManageRoom />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/rooms/create",
        element: (
          <ProtectPage roles={["admin"]}>
            <CreateRoom />
          </ProtectPage>
        ),
      },
      {
        path: "/admin/rooms/edit/:id",
        element: (
          <ProtectPage roles={["admin"]}>
            <UpdateRoom />
          </ProtectPage>
        ),
      },
      {
        path: "/",
        element: <ResetPassword />,
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
        path: "/bookings",
        element: (
          <ProtectPage>
            <Bookings />
          </ProtectPage>
        ),
      },
      {
        path: "/invoice/:id",
        element: (
          <ProtectPage>
            <InvoiceApp />
          </ProtectPage>
        ),
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
