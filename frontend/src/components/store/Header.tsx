import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, MapPin, Search, ShoppingCart, Menu, Lock, CheckCircle2, BrainCircuit } from "lucide-react";
import { useCartContext } from "@/context/CartContext";
import { useLocationContext } from "@/context/LocationContext";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/products";

export function Header({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const { getCartCount } = useCartContext();
  const { location: userLocation, setLocation } = useLocationContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = location.search as Record<string, unknown>;
  const initialQ = (searchParams?.q as string) || "";
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState("All Categories");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [postOffices, setPostOffices] = useState<any[]>([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState<any>(null);
  const [tempPincode, setTempPincode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/browse",
      search: {
        q: q.trim(),
        cat: cat === "All Categories" ? undefined : cat,
      },
    });
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (location.pathname.startsWith("/checkout")) {
    return (
      <header className="bg-white border-b border-gray-300 py-4 px-6 flex justify-between items-center z-40 relative">
        <Link to="/" className="text-3xl font-black text-gray-900 tracking-tighter">
          Kart<span className="text-indigo-600">.in</span>
        </Link>
        <h1 className="text-3xl font-normal text-gray-800">Checkout</h1>
        <div className="text-gray-500">
          <Lock className="inline-block h-5 w-5 mr-1" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header id="navbar" className="flex flex-col font-sans w-full min-w-[1000px] relative z-40">
        {/* nav-belt */}
        <div id="nav-belt" className="bg-[#131921] text-white flex items-center h-[86px] px-[20px] w-full gap-[12px]">
          
          <div className="nav-left flex items-center shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center px-[8px] pt-[12px] pb-[4px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] h-[72px] mt-[2px]">
              <img src="/assets/amazon_logo.png" alt="Amazon" className="h-[58px] w-auto object-contain mt-1" />
              <span className="text-[20px] font-normal relative -top-[18px] ml-1">.in</span>
            </Link>



            <button onClick={() => setIsLocationModalOpen(true)} className="hidden md:flex items-end px-[12px] pb-[16px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] h-[72px] ml-[4px] cursor-pointer text-left">
              <MapPin className="h-[20px] w-[20px] text-white mb-[1px] mr-[4px]" strokeWidth={2} />
              <div className="flex flex-col justify-end pb-[1px]">
                <span className="text-[13px] leading-[15px] text-[#cccccc]">Deliver to {user?.user_metadata?.full_name?.split(' ')[0] || "User"}</span>
                <span className="text-[15px] leading-[17px] font-bold text-white mt-0.5">{userLocation.locality ? `${userLocation.locality}, ` : ''}{userLocation.city} {userLocation.pincode}</span>
              </div>
            </button>
          </div>

          <div className="nav-fill flex-1 flex items-center min-w-0 ml-[16px]" id="nav-fill-search">
            {/* nav-search */}
            <form
              id="nav-search"
              onSubmit={handleSearch}
              className="flex flex-1 min-w-0 h-[58px] rounded-[6px] overflow-hidden focus-within:ring-[3px] focus-within:ring-[#f90] mx-[10px] bg-white relative border-[2px] focus-within:border-[#f90] border-transparent shadow-sm"
            >
              <div id="nav-search-dropdown-card" className="relative group flex items-center bg-[#f3f3f3] hover:bg-[#dadada] border-r border-[#cdcdcd] text-[#555] px-[16px] cursor-pointer focus-within:ring-[3px] focus-within:ring-[#f90] z-10">
                <span className="text-[16px] whitespace-nowrap overflow-hidden max-w-[80px] truncate">{cat === "All Categories" ? "All" : cat}</span>
                <img src="/assets/dropdown_icon.png" alt="dropdown" className="h-[8px] ml-[8px] opacity-70" />
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer text-[16px] w-full"
                >
                  <option>All Categories</option>
                  {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <input
                id="nav-search-bar-form"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Amazon.in"
                className="flex-1 min-w-0 px-[16px] text-[#111] text-[20px] outline-none bg-white placeholder-[#777]"
              />
              <button id="nav-search-submit-button" type="submit" className="bg-[#febd69] hover:bg-[#f3a847] w-[72px] flex items-center justify-center cursor-pointer focus:outline-none focus:ring-[3px] focus:ring-[#f90] z-10 transition-colors">
                <img src="/assets/search_icon.png" alt="Search" className="h-[34px]" />
              </button>
            </form>
          </div>

          <div className="nav-right flex items-center shrink-0 gap-[4px] ml-[16px]">
            {/* Language */}
            <button className="hidden lg:flex items-center px-[12px] py-[16px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] h-[72px] gap-1.5 cursor-pointer">
              <img src="/assets/us_flag.png" alt="EN" className="h-[22px] w-auto object-cover mt-2" />
              <span className="text-[19px] font-bold mt-2">EN</span>
              <img src="/assets/dropdown_icon.png" alt="dropdown" className="h-[8px] opacity-70 mt-3" />
            </button>

            {/* Account & Lists */}
            {user ? (
              <div className="hidden md:flex flex-col justify-center px-[12px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] h-[72px] cursor-pointer group relative">
                <span className="text-[15px] leading-[17px] font-normal text-white">Hello, {String(user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User").split(' ')[0]}</span>
                <span className="text-[19px] leading-[19px] font-bold flex items-center gap-[2px] text-white mt-1">
                  Account & Lists <img src="/assets/dropdown_icon.png" alt="dropdown" className="h-[8px] opacity-70" />
                </span>
                
                <div className="absolute top-full right-0 hidden group-hover:block w-[260px] bg-white text-black shadow-lg rounded-b border-t-2 border-transparent z-50 pt-2">
                  <div className="p-5 border-b">
                    <Link to="/account" className="text-base font-bold hover:text-[#c45500] hover:underline block mb-3">Your Account</Link>
                    <Link to="/account/orders" className="text-base hover:text-[#c45500] hover:underline block mb-3">Your Orders</Link>
                    <Link to="/mission-history" className="text-base hover:text-[#c45500] hover:underline block mb-3">Mission History</Link>
                    <Link to="/why-amazon" className="text-base hover:text-[#c45500] hover:underline block mb-3 flex items-center gap-1.5"><BrainCircuit className="w-4 h-4 text-indigo-500" /> Why Amazon?</Link>
                    <Link to="/account/wishlist" className="text-base hover:text-[#c45500] hover:underline block mb-3">Your Wish List</Link>
                    <Link to="/account" className="text-base hover:text-[#c45500] hover:underline block">Your Addresses</Link>
                  </div>
                  <div className="p-5 bg-gray-50 text-center">
                    <button onClick={logout} className="text-base text-[#007185] hover:text-[#c45500] hover:underline">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:flex flex-col justify-center px-[12px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] h-[72px]">
                <span className="text-[15px] leading-[17px] font-normal text-white">Hello, sign in</span>
                <span className="text-[19px] leading-[19px] font-bold flex items-center gap-[2px] text-white mt-1">
                  Account & Lists <img src="/assets/dropdown_icon.png" alt="dropdown" className="h-[8px] opacity-70" />
                </span>
              </Link>
            )}

            {/* Returns & Orders */}
            <Link to="/account" className="hidden lg:flex flex-col justify-center px-[12px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] h-[72px]">
              <span className="text-[15px] leading-[17px] font-normal text-white">Returns</span>
              <span className="text-[19px] leading-[19px] font-bold text-white mt-1">& Orders</span>
            </Link>

            {/* Cart */}
            <Link id="nav-cart" to="/cart" className="flex items-end px-[12px] pt-[14px] pb-[10px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] h-[72px] relative ml-[4px]">
              <div className="relative flex items-end">
                <img src="/assets/cart_icon.png" alt="Cart" className="h-[56px] w-[58px]" />
                <span className="absolute top-[3px] left-[26px] text-[#f08804] font-bold text-[24px] leading-none">
                  {getCartCount()}
                </span>
                <span className="hidden md:inline text-[20px] font-bold leading-[24px] mb-[3px] ml-[3px]">Cart</span>
              </div>
            </Link>
          </div>
        </div>

        {/* nav-main */}
        <div id="nav-main" className="bg-[#232f3e] text-white flex items-center h-[50px] px-[14px] overflow-hidden whitespace-nowrap w-full relative z-30">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1 px-[10px] py-[10px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] font-bold text-[16px] shrink-0 cursor-pointer"
          >
            <Menu className="h-5 w-5 mr-1" /> All
          </button>
          
          <div className="flex items-center gap-1 overflow-x-auto min-w-0 w-full ml-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link to="/fresh" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Fresh</Link>
            <Link to="/" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">MX Player</Link>
            <Link to="/" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Sell</Link>
            <Link to="/browse" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Bestsellers</Link>
            <Link to="/browse" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Today's Deals</Link>
            <Link to="/mobiles" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Mobiles</Link>
            <Link to="/" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white flex items-center">Prime <ChevronDown className="w-3 h-3 ml-1 text-gray-400"/></Link>
            <Link to="/browse" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">New Releases</Link>
            <Link to="/" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Customer Service</Link>
            <Link to="/electronics" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Electronics</Link>
            <Link to="/" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Amazon Pay</Link>
            <Link to="/fashion" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Fashion</Link>
            <Link to="/browse?cat=Home%20%26%20Kitchen" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Home & Kitchen</Link>
            <Link to="/browse?cat=Computers" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Computers</Link>
            <Link to="/browse?cat=Toys%20%26%20Games" className="px-[8px] py-[6px] hover:outline hover:outline-1 hover:outline-white rounded-[2px] text-[15px] cursor-pointer font-normal text-white">Toys & Games</Link>
          </div>
        </div>
      </header>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex font-sans">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80"
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          
          {/* Drawer Panel */}
          <div className="relative w-[365px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="absolute -right-[50px] top-[10px] text-white hover:text-gray-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="bg-[#232f3e] text-white p-[15px] pl-[35px] flex items-center gap-[10px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <h2 className="text-[19px] font-bold">Hello, sign in</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="py-[10px] border-b border-gray-300">
                <h3 className="px-[35px] py-[10px] font-bold text-[16px] text-[#111]">Trending</h3>
                <ul className="text-[#111] text-[14px]">
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer">Best Sellers</li>
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer">New Releases</li>
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer">Movers and Shakers</li>
                </ul>
              </div>

              <div className="py-[10px] border-b border-gray-300">
                <h3 className="px-[35px] py-[10px] font-bold text-[16px] text-[#111]">Digital Content And Devices</h3>
                <ul className="text-[#111] text-[14px]">
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer flex justify-between">Amazon miniTV - FREE entertainment <ChevronDown className="h-[16px] w-[16px] -rotate-90 text-gray-500" /></li>
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer flex justify-between">Echo & Alexa <ChevronDown className="h-[16px] w-[16px] -rotate-90 text-gray-500" /></li>
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer flex justify-between">Fire TV <ChevronDown className="h-[16px] w-[16px] -rotate-90 text-gray-500" /></li>
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer flex justify-between">Kindle E-Readers & eBooks <ChevronDown className="h-[16px] w-[16px] -rotate-90 text-gray-500" /></li>
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer flex justify-between">Audible Audiobooks <ChevronDown className="h-[16px] w-[16px] -rotate-90 text-gray-500" /></li>
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer flex justify-between">Amazon Prime Video <ChevronDown className="h-[16px] w-[16px] -rotate-90 text-gray-500" /></li>
                  <li className="px-[35px] py-[13px] hover:bg-[#eaeded] cursor-pointer flex justify-between">Amazon Prime Music <ChevronDown className="h-[16px] w-[16px] -rotate-90 text-gray-500" /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsLocationModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[400px] max-h-[85vh] overflow-hidden flex flex-col">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Choose your location</h3>
            </div>
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              <p className="text-sm text-gray-500">
                Delivery options and delivery speeds may vary for different locations.
              </p>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  id="pincode-input"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#f90] focus:border-transparent outline-none" 
                  defaultValue={userLocation.pincode}
                  onChange={() => {
                    if (postOffices.length > 0) {
                      setPostOffices([]);
                      setSelectedPostOffice(null);
                    }
                  }}
                />
                <button 
                  disabled={isFetchingLocation}
                  onClick={async () => {
                    const val = (document.getElementById("pincode-input") as HTMLInputElement).value;
                    if(val) {
                      setIsFetchingLocation(true);
                      setLocationError("");
                      setPostOffices([]);
                      setSelectedPostOffice(null);
                      setTempPincode(val);
                      try {
                        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                        const data = await res.json();
                        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
                          setPostOffices(data[0].PostOffice);
                        } else {
                          setLocationError("Invalid pincode.");
                        }
                      } catch (e) {
                        setLocationError("Invalid pincode.");
                      } finally {
                        setIsFetchingLocation(false);
                      }
                    }
                  }}
                  className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingLocation ? "Finding locations..." : "Fetch Locations"}
                </button>
              </div>
              {locationError && <p className="text-red-600 text-xs font-medium">{locationError}</p>}
              
              {!isFetchingLocation && postOffices.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Select a locality</h4>
                  {postOffices.map((po, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedPostOffice(po)}
                      className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between transition-colors ${selectedPostOffice?.Name === po.Name ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 font-medium text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {po.Name}
                        </div>
                        <div className="text-xs text-gray-500 ml-[22px] mt-0.5">
                          {po.District}, {po.State} {tempPincode}
                        </div>
                      </div>
                      {selectedPostOffice?.Name === po.Name && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isFetchingLocation && <div className="text-sm text-gray-500 py-4 text-center">Finding locations...</div>}
              {!isFetchingLocation && postOffices.length === 0 && !locationError && tempPincode && (
                <div className="text-sm text-gray-500 py-4 text-center">No locations found.</div>
              )}
              
              <div className="text-center text-gray-400 text-xs my-2">or</div>
              
              <button 
                disabled={postOffices.length > 0 && !selectedPostOffice}
                onClick={() => {
                  if (selectedPostOffice) {
                    setLocation({ 
                      city: selectedPostOffice.District, 
                      state: selectedPostOffice.State, 
                      locality: selectedPostOffice.Name,
                      pincode: tempPincode 
                    });
                    setIsLocationModalOpen(false);
                    setPostOffices([]);
                    setSelectedPostOffice(null);
                  } else {
                    setIsLocationModalOpen(false);
                  }
                }}
                className="w-full bg-[#f0c14b] hover:bg-[#f4d078] disabled:opacity-50 disabled:cursor-not-allowed border border-[#a88734] px-4 py-2.5 rounded-md text-sm font-bold shadow-sm"
              >
                {postOffices.length > 0 ? "Save Location" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
