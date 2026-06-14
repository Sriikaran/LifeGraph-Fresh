import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useAddresses } from "@/lib/address";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/account/address-form")({
  component: AddressFormPage,
});

function AddressFormPage() {
  const router = useRouter();
  const search: any = router.latestLocation.search;
  const id = search.id;
  const navigate = useNavigate();
  
  const { user, loading } = useAuth();
  const { userAddresses, addAddress, updateAddress } = useAddresses();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { returnUrl: router.latestLocation.pathname }, replace: true });
    }
  }, [user, loading, navigate, router.latestLocation.pathname]);

  if (loading || !user) return null;
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    zip: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (id) {
      const addr = userAddresses.find(a => a.id === id);
      if (addr) {
        setFormData({
          fullName: addr.fullName,
          phone: addr.phone || "",
          zip: addr.zip,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2 || "",
          city: addr.city,
          state: addr.state,
        });
      }
    }
  }, [id, userAddresses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateAddress(id, formData);
      toast.success("Address updated");
    } else {
      addAddress(formData);
      toast.success("Address added");
    }
    navigate({ to: "/account/addresses" });
  };

  return (
    <div className="mx-auto max-w-[600px] px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/account" className="hover:underline hover:text-[#c45500]">Your Account</Link>
        <span>›</span>
        <Link to="/account/addresses" className="hover:underline hover:text-[#c45500]">Your Addresses</Link>
        <span>›</span>
        <span className="text-[#c45500]">{id ? "Edit Address" : "New Address"}</span>
      </div>
      
      <h1 className="text-3xl font-medium mb-6">{id ? "Edit your address" : "Add a new address"}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-[450px]">
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
          <input required value={formData.zip} onChange={e=>setFormData({...formData, zip: e.target.value})} className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] focus:outline-none shadow-sm placeholder-gray-400" placeholder="6 digits [0-9] PIN code" />
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

        <button type="submit" className="bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-lg px-8 py-2 font-medium shadow-sm border border-[#FCD200] mt-4">
          {id ? "Save changes" : "Add address"}
        </button>
      </form>
    </div>
  );
}
