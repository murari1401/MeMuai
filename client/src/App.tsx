import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AvatarProvider } from "@/contexts/avatar-context";
import { ChatProvider } from "@/contexts/chat-context";
import NotFound from "@/pages/not-found";
import Chat from "@/pages/chat";
import About from "@/pages/about";
import Safety from "@/pages/safety";
import LoginPage from "@/pages/login-page";
import { useState, useEffect } from "react";
import { useChat } from "@/contexts/chat-context";

// Protected route component to ensure user is logged in
const ProtectedRoute = ({ component: Component, ...rest }: { component: React.FC, path: string }) => {
  const { user } = useChat();
  
  if (!user || !user.nickname) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
};

function Router() {
  const [location] = useLocation();
  const { user } = useChat();
  
  // Apply background effects based on current path
  useEffect(() => {
    const body = document.body;
    body.className = "text-white transition-colors duration-500";
    
    // Add background gradient based on current route
    if (location === "/login") {
      body.classList.add("bg-gradient-to-b", "from-primary", "to-primary/80");
    } else if (location === "/") {
      body.classList.add("bg-gradient-to-b", "from-neutral", "to-neutral/80");
    } else if (location === "/about") {
      body.classList.add("bg-gradient-to-b", "from-happy", "to-happy/80");
    } else if (location === "/safety") {
      body.classList.add("bg-gradient-to-b", "from-caring", "to-caring/80");
    } else {
      body.classList.add("bg-gradient-to-b", "from-neutral", "to-neutral/80");
    }
    
    return () => {
      // Clean up classes when component unmounts
      body.className = "text-white";
    };
  }, [location]);

  // Auto-redirect based on login status
  useEffect(() => {
    if (location === "/" && (!user || !user.nickname)) {
      window.location.href = "/login";
    } else if (location === "/login" && user && user.nickname) {
      window.location.href = "/";
    }
  }, [location, user]);
  
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={Chat} />
      <Route path="/about" component={About} />
      <Route path="/safety" component={Safety} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  useEffect(() => {
    // Check local storage to see if user has visited before
    const hasVisited = localStorage.getItem("memu_visited");
    if (hasVisited) {
      setIsFirstVisit(false);
    }
  }, []);
  
  const handleFirstVisitComplete = () => {
    localStorage.setItem("memu_visited", "true");
    setIsFirstVisit(false);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <AvatarProvider>
        <ChatProvider>
          <div className="min-h-screen font-sans text-white">
            <Router />
            <Toaster />
          </div>
        </ChatProvider>
      </AvatarProvider>
    </QueryClientProvider>
  );
}

export default App;
