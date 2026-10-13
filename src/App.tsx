import { Route, Routes } from "react-router"

import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Home } from "@/pages/home"
import { NotFound } from "@/pages/not-found"

// Every page is a route here. Hosting serves index.html for any path without a file
// extension, so deep links and reloads land on the right page.
export function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </TooltipProvider>
    </ErrorBoundary>
  )
}
