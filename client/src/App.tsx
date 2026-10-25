/* Cute Birthday Universe — App Shell with star trail, music player & purple theme */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StarTrail } from "./components/StarTrail";
import { MusicButton } from "./components/MusicButton";
import Home from "./pages/Home";
import Letter from "./pages/Letter";
import Memories from "./pages/Memories";
import Arcade from "./pages/Arcade";
import Wish from "./pages/Wish";
import NotFound from "./pages/NotFound";

import { useEffect } from "react";

export function SiteShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Prevent right-click context menu on all images, videos, and media containers
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.tagName === "IMG" ||
        target.tagName === "VIDEO" ||
        target.closest("img") ||
        target.closest("video") ||
        target.closest(".polaroid-container") ||
        target.closest(".polaroid-card")
      ) {
        e.preventDefault();
      }
    };

    // Prevent dragging images or videos to save
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.tagName === "IMG" ||
        target.tagName === "VIDEO" ||
        target.closest("img") ||
        target.closest("video")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return (
    <div className="site-shell relative min-h-screen">
      <StarTrail />
      <MusicButton />
      {children}
    </div>
  );
}

function Router() {
  return (
    <SiteShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/letter" component={Letter} />
        <Route path="/memories" component={Memories} />
        <Route path="/arcade" component={Arcade} />
        <Route path="/wish" component={Wish} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </SiteShell>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
