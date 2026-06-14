import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAddresses } from "@/lib/address";
import { useAuth } from "@/lib/auth";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});

function AddressesPage() {
  const { user, loading } = useAuth();
  const { userAddresses, deleteAddress } = useAddresses();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { returnUrl: router.latestLocation.pathname }, replace: true });
    }
  }, [user, loading, navigate, router.latestLocation.pathname]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/account" className="hover:underline hover:text-[#c45500]">Your Account</Link>
        <span>›</span>
        <span className="text-[#c45500]">Your Addresses</span>
      </div>
      
      <h1 className="text-3xl font-medium mb-6">Your Addresses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/account/address-form" className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer min-h-[250px]">
          <Plus className="h-12 w-12 text-gray-400 mb-2" />
          <span className="font-bold text-xl text-gray-600">Add Address</span>
        </Link>
        
        {userAddresses.map((addr) => (
          <div key={addr.id} className="border border-gray-300 rounded-lg p-6 flex flex-col min-h-[250px]">
            <div className="border-b border-gray-200 pb-2 mb-2 font-bold text-sm">Default: <img src="/assets/amazon_logo.png" alt="" className="h-3 inline ml-1 opacity-50"/></div>
            <div className="font-bold text-[16px] mb-1">{addr.fullName}</div>
            <div className="text-sm text-gray-800 leading-relaxed flex-1">
              {addr.addressLine1} <br/>
              {addr.addressLine2 && <>{addr.addressLine2}<br/></>}
              {addr.city}, {addr.state} {addr.zip}<br/>
              India<br/>
              Phone number: {addr.phone || "N/A"}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-4 text-sm font-normal">
              <Link to="/account/address-form" search={{ id: addr.id }} className="text-[#007185] hover:text-[#c45500] hover:underline">Edit</Link>
              <span className="text-gray-300">|</span>
              <button onClick={() => deleteAddress(addr.id)} className="text-[#007185] hover:text-[#c45500] hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
