import "./index.css";

import { Toast } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { StoreProvider } from "./store/StoreProvider.tsx";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <StoreProvider>
        <App />
      </StoreProvider>
      <Toast.Provider placement="bottom end" />
    </QueryClientProvider>
  </StrictMode>,
);
