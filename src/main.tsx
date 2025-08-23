import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes/routes.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./components/ErrorPage.tsx";

const queryClient = new QueryClient();

// if (process.env.NODE_ENV === "development") {
//   const { worker } = await import("./test/mock/browser.ts");
//   worker.start();
// }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
