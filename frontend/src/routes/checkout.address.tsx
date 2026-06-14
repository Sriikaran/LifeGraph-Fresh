import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useCheckout } from "@/lib/checkout";
import { useAddresses, type SavedAddress } from "@/lib/address";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/checkout/address")({
  component: AddressStep,
});

function AddressStep() {
  const navigate = useNavigate();
  const { setAddress } = useCheckout();
  const { userAddresses, addAddress } = useAddresses();
  const { user } = useAuth();
  const router = useRouter();

  // If not logged in, redirect to auth with returnUrl
  useEffect(() => {
    if (!user) {
      navigate({ to: "/auth", search: { returnUrl: router.latestLocation.pathname }, replace: true });
    }
  }, [user, navigate, router.latestLocation.pathname]);

  const [showForm, setShowForm] = useState(userAddresses.length === 0);
  
  const [formData, setFormData] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });

  if (!user) return null;

  const handleSelectSaved = (addr: SavedAddress) => {
    setAddress(addr);
    navigate({ to: "/checkout/payment" });
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.state || !formData.zip) {
      return;
    }
    
    // Save to address book
    addAddress(formData);
    
    // Proceed with checkout
    setAddress(formData);
    navigate({ to: "/checkout/payment" });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-[#c45500]">Select a delivery address</h2>
      
      {userAddresses.length > 0 && !showForm && (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {userAddresses.map(addr => (
              <div key={addr.id} className="border rounded p-4 bg-[#fcfcfc] hover:bg-[#f3f3f3] cursor-pointer flex flex-col" onClick={() => handleSelectSaved(addr)}>
                <div className="font-bold">{addr.fullName}</div>
                <div className="text-sm mt-1">{addr.addressLine1}</div>
                {addr.addressLine2 && <div className="text-sm">{addr.addressLine2}</div>}
                <div className="text-sm">{addr.city}, {addr.state} {addr.zip}</div>
                <div className="text-sm mt-1">Phone: {addr.phone || "N/A"}</div>
                <div className="mt-4 pt-3 mt-auto">
                  <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded px-4 py-1.5 font-medium shadow-sm border border-[#FCD200] w-full text-sm">
                    Deliver to this address
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="text-[#007185] hover:text-[#c45500] hover:underline flex items-center">
            <span className="text-lg font-bold mr-1">+</span> Add a new address
          </button>
        </div>
      )}

      {showForm && (
        <div className="border border-gray-300 rounded p-6 max-w-lg">
          <h3 className="font-bold text-xl mb-4">Add a new address</h3>
          <form onSubmit={handleAddNew} className="space-y-4">
            <label className="block">
              <span className="font-bold text-sm">Full name (First and Last name)</span>
              <input required value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] focus:outline-none shadow-sm" />
            </label>
            <label className="block">
              <span className="font-bold text-sm">Mobile number</span>
              <input required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] focus:outline-none shadow-sm" />
            </label>
            <label className="block">
              <span className="font-bold text-sm">Pincode</span>
              <input required value={formData.zip} onChange={e=>setFormData({...formData, zip: e.target.value})} className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] focus:outline-none shadow-sm" />
            </label>
            <label className="block">
              <span className="font-bold text-sm">Flat, House no., Building, Company, Apartment</span>
              <input required value={formData.addressLine1} onChange={e=>setFormData({...formData, addressLine1: e.target.value})} className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] focus:outline-none shadow-sm" />
            </label>
            <label className="block">
              <span className="font-bold text-sm">Area, Street, Sector, Village</span>
              <input value={formData.addressLine2} onChange={e=>setFormData({...formData, addressLine2: e.target.value})} className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] focus:outline-none shadow-sm" />
            </label>
            <div className="flex gap-4">
              <label className="block flex-1">
                <span className="font-bold text-sm">Town/City</span>
                <input required value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] focus:outline-none shadow-sm" />
              </label>
              <label className="block flex-1">
                <span className="font-bold text-sm">State</span>
                <input required value={formData.state} onChange={e=>setFormData({...formData, state: e.target.value})} className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] focus:outline-none shadow-sm" />
              </label>
            </div>
            <div className="pt-4 flex gap-4">
              <button type="submit" className="bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-lg px-8 py-2 font-medium shadow-sm border border-[#FCD200]">
                Use this address
              </button>
              {userAddresses.length > 0 && (
                <button type="button" onClick={() => setShowForm(false)} className="text-[#007185] hover:text-[#c45500] hover:underline">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
