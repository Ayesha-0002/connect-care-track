import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import SelectRole from "./pages/SelectRole";
import DonorDashboard from "./pages/donor/DonorDashboard";
import PostFood from "./pages/donor/PostFood";
import DonorHistory from "./pages/donor/DonorHistory";
import DonorChat from "./pages/donor/DonorChat";
import DonorProfile from "./pages/donor/DonorProfile";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import LiveTracking from "./pages/volunteer/LiveTracking";
import VolunteerPickups from "./pages/volunteer/VolunteerPickups";
import VolunteerChat from "./pages/volunteer/VolunteerChat";
import VolunteerProfile from "./pages/volunteer/VolunteerProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/notifications" element={<Notifications />} />
          
          {/* Donor Routes */}
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/donor/post" element={<PostFood />} />
          <Route path="/donor/history" element={<DonorHistory />} />
          <Route path="/donor/chat" element={<DonorChat />} />
          <Route path="/donor/profile" element={<DonorProfile />} />
          
          {/* Volunteer Routes */}
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/volunteer/tracking" element={<LiveTracking />} />
          <Route path="/volunteer/pickups" element={<VolunteerPickups />} />
          <Route path="/volunteer/chat" element={<VolunteerChat />} />
          <Route path="/volunteer/profile" element={<VolunteerProfile />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
