
import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingAnimation from "@/components/LoadingAnimation";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load pages for better performance with explicit default exports
const Index = lazy(() => import("./pages/Index").then(module => ({ default: module.default })));
const ChatAgent = lazy(() => import("./pages/ChatAgent").then(module => ({ default: module.default })));
const Login = lazy(() => import("./pages/Login").then(module => ({ default: module.default })));
const Register = lazy(() => import("./pages/Register").then(module => ({ default: module.default })));
const NotFound = lazy(() => import("./pages/NotFound").then(module => ({ default: module.default })));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Router configuration with enhanced error handling
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Outlet />,
      errorElement: (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Application Error</h1>
            <p className="text-red-600 mb-4">Something went wrong while loading the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      ),
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: "chat-agent",
          element: <ChatAgent />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    // Enhanced error handling for development
    future: {
      v7_normalizeFormMethod: true,
    },
  }
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
                <LoadingAnimation />
              </div>
            }
          >
            <RouterProvider router={router} />
          </Suspense>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
