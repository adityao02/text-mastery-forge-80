
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import Dashboard from "./pages/Dashboard";
import Compete from "./pages/Compete";
import Settings from "./pages/Settings";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import LoadingPage from "./components/LoadingPage";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  if (isLoading) {
    return <LoadingPage onComplete={() => setIsLoading(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={isFirstVisit ? <Index /> : <Navigate to="/practice" replace />} />
      <Route path="/practice" element={<Layout><Practice /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/compete" element={<Layout><Compete /></Layout>} />
      <Route path="/game" element={<Layout><Game /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
