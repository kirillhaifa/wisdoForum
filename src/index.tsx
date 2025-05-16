import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";
import { AuthProvider } from "./modules/Auth/AuthProvider";
import { BrowserRouter } from "react-router-dom"; 
const queryClient = new QueryClient();

const container = document.getElementById("root")!;
createRoot(container).render(
  <BrowserRouter> 
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </BrowserRouter>
);
