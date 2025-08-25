import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Donation from "./components/Donation/Donation.jsx";
import Recipient from "./components/Recepient/Recepient.jsx";
import Contact from "./components/Contact/Contact.jsx";
import {
  RegisterOptions,
  DonorSignIn,
  DonorSignUp,
  ReceiverSignIn,
  ReceiverSignUp,
} from "./components/Auth/index.js";

const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="donation" element={<Donation />} />
      <Route path="recipient" element={<Recipient />} />
      <Route path="contact" element={<Contact />} />
      
      {/* Authentication Routes */}
      <Route path="auth/register" element={<RegisterOptions />} />
      <Route path="auth/donor/signin" element={<DonorSignIn />} />
      <Route path="auth/donor/signup" element={<DonorSignUp />} />
      <Route path="auth/receiver/signin" element={<ReceiverSignIn />} />
      <Route path="auth/receiver/signup" element={<ReceiverSignUp />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
