import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import UploadDocuments from "./pages/UploadDocuments.tsx";
import ClientAccess from "./pages/ClientAccess.tsx";
import DeductionCalculator from "./pages/DeductionCalculator.tsx";
import AffiliateLogin from "./pages/AffiliateLogin.tsx";
import ClientIntake from "./pages/ClientIntake.tsx";
import CobraLetter from "./pages/CobraLetter.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/upload" element={<UploadDocuments />} />
          <Route path="/client-access" element={<ClientAccess />} />
          <Route path="/deduction-calculator" element={<DeductionCalculator />} />
          <Route path="/affiliate" element={<AffiliateLogin />} />
          <Route path="/client-intake" element={<ClientIntake />} />
          <Route path="/cobra-letter" element={<CobraLetter />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
