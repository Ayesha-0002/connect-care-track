import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import SelectRole from "./pages/SelectRole";
import ProtectedRoute from "./components/ProtectedRoute";
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
          <Route path="/donor" element={<ProtectedRoute requiredRole="donor"><DonorDashboard /></ProtectedRoute>} />
          <Route path="/donor/post" element={<ProtectedRoute requiredRole="donor"><PostFood /></ProtectedRoute>} />
          <Route path="/donor/history" element={<ProtectedRoute requiredRole="donor"><DonorHistory /></ProtectedRoute>} />
          <Route path="/donor/chat" element={<ProtectedRoute requiredRole="donor"><DonorChat /></ProtectedRoute>} />
          <Route path="/donor/profile" element={<ProtectedRoute requiredRole="donor"><DonorProfile /></ProtectedRoute>} />
          
          {/* Volunteer Routes */}
          <Route path="/volunteer" element={<ProtectedRoute requiredRole="volunteer"><VolunteerDashboard /></ProtectedRoute>} />
          <Route path="/volunteer/tracking" element={<ProtectedRoute requiredRole="volunteer"><LiveTracking /></ProtectedRoute>} />
          <Route path="/volunteer/pickups" element={<ProtectedRoute requiredRole="volunteer"><VolunteerPickups /></ProtectedRoute>} />
          <Route path="/volunteer/chat" element={<ProtectedRoute requiredRole="volunteer"><VolunteerChat /></ProtectedRoute>} />
          <Route path="/volunteer/profile" element={<ProtectedRoute requiredRole="volunteer"><VolunteerProfile /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
