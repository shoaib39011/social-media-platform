import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout.js";
import HomePage from "./pages/HomePage.js";
import LoginPage from "./pages/LoginPage.js";
import ProfilePage from './pages/ProfilePage.js';
import MessagesPage from './pages/MessagesPage.js';
import NotFound from './pages/NotFound.js';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><div className="p-8 text-center"><h1 className="text-2xl font-bold">Explore</h1><p className="text-muted-foreground">Discover new people and content</p></div></ProtectedRoute>} />
            <Route path="/activity" element={<ProtectedRoute><div className="p-8 text-center"><h1 className="text-2xl font-bold">Activity</h1><p className="text-muted-foreground">See your likes, comments, and mentions</p></div></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

