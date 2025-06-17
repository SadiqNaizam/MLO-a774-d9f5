import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import CustomerAnalyticsPage from "./pages/CustomerAnalyticsPage";
import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import LoginPage from "./pages/LoginPage";
import ProductPerformancePage from "./pages/ProductPerformancePage";
import ReportsPage from "./pages/ReportsPage";
import SalesAnalyticsPage from "./pages/SalesAnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<DashboardOverviewPage />} />
          <Route path="/customer-analytics" element={<CustomerAnalyticsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product-performance" element={<ProductPerformancePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/sales-analytics" element={<SalesAnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;