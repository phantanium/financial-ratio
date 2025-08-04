import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import LiquidityAnalysis from "./pages/LiquidityAnalysis";
import ProfitabilityAnalysis from "./pages/ProfitabilityAnalysis";
import LeverageAnalysis from "./pages/LeverageAnalysis";
import ActivityAnalysis from "./pages/ActivityAnalysis";
import CompanyComparison from "./pages/CompanyComparison";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/liquidity" element={<LiquidityAnalysis />} />
          <Route path="/profitability" element={<ProfitabilityAnalysis />} />
          <Route path="/leverage" element={<LeverageAnalysis />} />
          <Route path="/activity" element={<ActivityAnalysis />} />
          <Route path="/comparison" element={<CompanyComparison />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
