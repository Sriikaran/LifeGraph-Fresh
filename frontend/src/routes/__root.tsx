import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/lib/checkout";
import { OrderProvider } from "@/lib/orders";
import { AuthProvider } from "@/lib/auth";
import { AddressProvider } from "@/lib/address";
import { WishlistProvider } from "@/lib/wishlist";
import { LocationProvider } from "@/context/LocationContext";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { Toaster } from "sonner";
import { useLocation, Link } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { validateCatalog } from "@/lib/validateCatalog";

// Run validation once on startup
validateCatalog();

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Amazon — Online Shopping for Electronics, Fashion, Home & more" },
      { name: "description", content: "Shop millions of products at the best prices with fast delivery across India." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-surface">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <a href="/" className="text-link hover:text-link-hover hover:underline mt-2 inline-block">Go home</a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center bg-surface p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isAuth = location.pathname === "/auth" || location.pathname.startsWith("/auth/");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AddressProvider>
          <WishlistProvider>
            <OrderProvider>
              <LocationProvider>
                <CartProvider>
                  <CheckoutProvider>
                    <div className="min-h-screen flex flex-col bg-surface">
                      {!isAuth && <Header />}
                      <main className="flex-1"><Outlet /></main>
                      {!isAuth && <Footer />}
                      

                    </div>
                    <Toaster position="bottom-right" />
                  </CheckoutProvider>
                </CartProvider>
              </LocationProvider>
            </OrderProvider>
          </WishlistProvider>
        </AddressProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
