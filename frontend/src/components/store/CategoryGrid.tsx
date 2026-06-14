import { Link } from "@tanstack/react-router";
import { useProducts } from "@/lib/api/products";
import { handleImageError } from "@/lib/categoryImageMap";

export function CategoryGrid() {
  const { data: products = [] } = useProducts();

  // Dynamically pull from live products
  const getTop4 = (catName: string) => products.filter(p => p.category === catName).slice(0, 4);

  const GRID_DATA = [
    {
      title: "Fresh daily essentials",
      link: "/fresh",
      items: getTop4("GROCERY")
    },
    {
      title: "Fruits & Vegetables",
      link: "/fresh",
      items: getTop4("FRUITS_&_VEGETABLES")
    },
    {
      title: "Beverages you'll love",
      link: "/browse?cat=BEVERAGES",
      items: getTop4("BEVERAGES")
    },
    {
      title: "Beauty & Hygiene",
      link: "/browse?cat=BEAUTY_%26_HYGIENE",
      items: getTop4("BEAUTY_&_HYGIENE")
    },
    {
      title: "Baby Care",
      link: "/browse?cat=BABY_CARE",
      items: getTop4("BABY_CARE")
    },
    {
      title: "Pet Care Essentials",
      link: "/browse?cat=PET_CARE",
      items: getTop4("PET_CARE")
    },
    {
      title: "Cleaning & Household",
      link: "/browse?cat=CLEANING_%26_HOUSEHOLD",
      items: getTop4("CLEANING_&_HOUSEHOLD")
    },
    {
      title: "Snacks & Sweets",
      link: "/browse?cat=SNACKS_%26_SWEETS",
      items: getTop4("SNACKS_&_SWEETS")
    },
  ];

  return (
    <div id="desktop-grid" className="w-full -mt-[150px] sm:-mt-[250px] md:-mt-[350px] lg:-mt-[420px] xl:-mt-[380px] relative z-20 px-[20px] xl:px-[25px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
      {GRID_DATA.map((card, i) => (
        <div key={i} className="bg-white p-[24px] pb-[20px] flex flex-col h-[460px] shadow-[0_1px_4px_rgba(0,0,0,0.15)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl relative group/card">
          <div className="h-[64px] mb-[12px]">
            <h2 className="text-[24px] font-bold leading-[1.2] text-gray-900 line-clamp-2">
              {card.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-[16px] flex-1 mb-[16px]">
            {card.items.length === 0 ? (
              <div className="col-span-2 flex items-center justify-center text-gray-400 text-sm text-center">
                Products loading...
              </div>
            ) : card.items.map((c: any, idx: number) => c && (
              <Link
                key={`${c.id}-${idx}`}
                to={`/product/${c.id}`}
                className="group flex flex-col items-start"
              >
                <div className="h-[120px] w-full bg-gray-50 mb-[8px] flex items-center justify-center rounded-lg overflow-hidden border border-gray-100 group-hover:border-indigo-200 transition-colors">
                  <img src={c.image} alt={c.title} loading="lazy" onError={(e) => handleImageError(e, c)}
                    className="max-h-full max-w-[85%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="text-[14px] text-gray-800 leading-[18px] group-hover:text-indigo-600 font-medium line-clamp-1 w-full transition-colors">
                  {c.title}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pt-[8px]">
            <Link to={card.link} className="text-indigo-600 hover:text-indigo-800 hover:underline text-[15px] font-bold block transition-colors">
              Explore {card.title.split(' ')[1] || 'More'}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SignInCard() {
  return (
    <div className="bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center text-center h-full">
      <h2 className="text-[21px] font-bold mb-2 leading-tight text-[#0f1111]">Sign in for your best experience</h2>
      <Link to="/auth" className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] w-full max-w-[250px] py-1.5 rounded-[8px] text-[13px] border border-[#fcd200] shadow-[0_1px_2px_rgba(0,0,0,0.2)] mb-2 mt-2">
        Sign in securely
      </Link>
    </div>
  );
}
