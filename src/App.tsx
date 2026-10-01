import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import IPhones from "./pages/IPhones.tsx";
import Seminovos from "./pages/Seminovos.tsx";
import IPads from "./pages/IPads.tsx";
import Macs from "./pages/Macs.tsx";
import Relogios from "./pages/Relogios.tsx";
import Produto from "./pages/Produto.tsx";
import Carrinho from "./pages/Carrinho.tsx";
import Comparar from "./pages/Comparar.tsx";
import Catalogo from "./pages/Catalogo.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ScrollToTop } from "@/components/ScrollToTop";

const Admin = lazy(() => import("./pages/Admin.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/iphones" element={<IPhones />} />
          <Route path="/seminovos" element={<Seminovos />} />
          <Route path="/ipads" element={<IPads />} />
          <Route path="/macs" element={<Macs />} />
          <Route path="/relogios" element={<Relogios />} />
          <Route path="/produto/:id" element={<Produto />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/comparar" element={<Comparar />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <Admin />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;