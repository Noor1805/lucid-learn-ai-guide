import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Home from "./pages/Home";
import Simplify from "./pages/Simplify";
import Planner from "./pages/Planner";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import Notes from "./pages/Notes";
import Sandbox from "./pages/Sandbox";
import CareerConnect from "./pages/CareerConnect";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simplify" element={<Simplify />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/sandbox" element={<Sandbox />} />
              <Route path="/career-connect" element={<CareerConnect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
