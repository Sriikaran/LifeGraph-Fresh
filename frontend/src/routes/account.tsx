import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Package, Heart, MapPin, CreditCard, RotateCcw, Bell, Crown, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account")({
  component: Account,
});

const TILES = [
  { icon: Package, title: "Your Orders", desc: "Track, return, or buy things again", link: "/account/orders" },
  { icon: User, title: "Login & security", desc: "Edit name, email, mobile, password", link: "/account" },
  { icon: Heart, title: "Your Wish List", desc: "View and edit your wish lists", link: "/account/wishlist" },
  { icon: MapPin, title: "Your Addresses", desc: "Edit, remove or set default address", link: "/account/addresses" },
  { icon: CreditCard, title: "Payment options", desc: "Manage cards, UPI, wallets", link: "/account" },
];

function Account() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { returnUrl: router.latestLocation.pathname }, replace: true });
    }
  }, [user, loading, navigate, router.latestLocation.pathname]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth" });
  };

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6">
      <h1 className="text-3xl font-medium">Your Account</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {TILES.map(({ icon: Icon, title, desc, link }) => (
          <Link key={title} to={link} className="bg-card p-5 border hover:shadow-md transition-shadow flex gap-4">
            <div className="h-16 w-16 rounded-full bg-secondary grid place-items-center shrink-0">
              <Icon className="h-7 w-7 text-foreground/80" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold">{title}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          </Link>
        ))}
        
        <button onClick={handleLogout} className="text-left bg-card p-5 border hover:shadow-md transition-shadow flex gap-4 cursor-pointer">
          <div className="h-16 w-16 rounded-full bg-secondary grid place-items-center shrink-0">
            <LogOut className="h-7 w-7 text-foreground/80" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <h2 className="font-bold">Sign Out</h2>
            <p className="text-sm text-muted-foreground">Sign out of {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "your account"}</p>
          </div>
        </button>
      </div>
    </div>
  );
}
