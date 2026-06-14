import { Link } from "@tanstack/react-router";

const COLS = [
  {
    title: "Get to Know Us",
    links: ["About Us", "Careers", "Press Releases", "Amazon Science"],
  },
  {
    title: "Connect with Us",
    links: ["Facebook", "Twitter", "Instagram"],
  },
  {
    title: "Make Money with Us",
    links: [
      "Sell on Amazon",
      "Sell under Amazon Accelerator",
      "Protect and Build Your Brand",
      "Amazon Global Selling",
      "Become an Affiliate",
      "Fulfilment by Amazon",
      "Advertise Your Products",
      "Amazon Pay on Merchants",
    ],
  },
  {
    title: "Let Us Help You",
    links: [
      "COVID-19 and Amazon",
      "Your Account",
      "Returns Centre",
      "100% Purchase Protection",
      "Amazon App Download",
      "Help",
    ],
  },
];

import { useLocation } from "@tanstack/react-router";

export function Footer() {
  const location = useLocation();

  if (location.pathname.startsWith("/checkout")) {
    return (
      <footer className="bg-gray-100 py-6 border-t mt-auto text-center text-xs text-gray-500">
        <p>Need help? Check our Help pages or contact us</p>
        <p className="mt-2">© 1996-2026, Kart.in, Inc. or its affiliates</p>
      </footer>
    );
  }

  return (
    <footer id="navFooter" className="font-sans w-full min-w-[1000px] mt-[40px]">
      {/* 1. Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="block w-full bg-[#37475a] text-white text-center text-[13px] xl:text-[14px] py-[15px] xl:py-[18px] hover:bg-[#485769] transition cursor-pointer font-medium"
      >
        Back to top
      </button>
      
      {/* 2. Vertical Columns */}
      <div className="bg-[#232f3e] text-white flex justify-center pb-[40px] pt-[50px]">
        <div className="w-full max-w-[1400px] flex justify-between px-[30px] md:px-[60px]">
          {COLS.map((c) => (
            <div key={c.title} className="w-[200px]">
              <h3 className="font-bold text-[16px] mb-[14px] leading-tight text-white">{c.title}</h3>
              <ul className="space-y-[10px] text-[14px] text-[#dddddd]">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:underline">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* 3. Logo & Language Line */}
      <div className="bg-[#232f3e] border-t border-[#3a4553] flex justify-center py-[30px] xl:py-[40px]">
        <div className="flex items-center gap-[60px] xl:gap-[80px]">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-[34px] xl:text-[38px] leading-none font-bold tracking-tighter text-white mt-1">
              amazon<span className="text-[16px] xl:text-[18px] font-normal relative -top-[10px]">.in</span>
            </span>
          </Link>
          <div className="flex gap-[8px] text-[13px]">
            <button className="flex items-center justify-between min-w-[120px] border border-[#848688] px-[10px] py-[6px] rounded-[3px] text-[#cccccc] hover:border-white">
              <div className="flex items-center gap-2">
                <span className="text-[14px]">🌐</span>
                <span className="text-[14px]">English</span>
              </div>
              <span className="text-[10px] ml-4 font-serif">▼</span>
            </button>
            <button className="flex items-center border border-[#848688] px-[10px] py-[6px] rounded-[3px] text-[#cccccc] hover:border-white">
              <span className="text-[14px]">🇮🇳 India</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* 4. Desc Line (Amazon Services Grid) */}
      <div className="bg-[#131a22] text-[#dddddd] text-[12px] pt-[30px] pb-[10px] flex justify-center">
        <div className="w-full max-w-[1400px] grid grid-cols-2 md:grid-cols-4 gap-y-[25px] gap-x-[40px] px-[30px] md:px-[60px]">
          <div>
            <div className="text-[11px] font-bold text-[#dddddd]">AbeBooks</div>
            <div className="text-[11px] text-[#999] leading-tight">Books, art<br/>& collectibles</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#dddddd]">Amazon Web Services</div>
            <div className="text-[11px] text-[#999] leading-tight">Scalable Cloud<br/>Computing Services</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#dddddd]">Audible</div>
            <div className="text-[11px] text-[#999] leading-tight">Download<br/>Audio Books</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#dddddd]">IMDb</div>
            <div className="text-[11px] text-[#999] leading-tight">Movies, TV<br/>& Celebrities</div>
          </div>
          
          <div>
            <div className="text-[11px] font-bold text-[#dddddd]">Shopbop</div>
            <div className="text-[11px] text-[#999] leading-tight">Designer<br/>Fashion Brands</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#dddddd]">Amazon Business</div>
            <div className="text-[11px] text-[#999] leading-tight">Everything For<br/>Your Business</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#dddddd]">Prime Now</div>
            <div className="text-[11px] text-[#999] leading-tight">2-Hour Delivery<br/>on Everyday Items</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#dddddd]">Amazon Prime Music</div>
            <div className="text-[11px] text-[#999] leading-tight">100 million songs, ad-free<br/>Over 15 million podcast episodes</div>
          </div>
        </div>
      </div>

      {/* 5. Copyright */}
      <div className="bg-[#131a22] text-[#dddddd] flex flex-col items-center pb-[30px] pt-[10px]">
        <div className="flex justify-center gap-x-[30px] mb-[5px] text-[12px]">
          <a href="#" className="hover:underline">Conditions of Use & Sale</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Interest-Based Ads</a>
        </div>
        <div className="text-[12px] text-[#dddddd]">© 1996-2026, Amazon.com, Inc. or its affiliates</div>
      </div>
    </footer>
  );
}
