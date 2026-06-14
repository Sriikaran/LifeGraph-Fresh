import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const BANNERS = [
  "/assets/header1.jpg",
  "/assets/header2.jpg",
  "/assets/header3.jpg",
  "/assets/header4.jpg",
  "/assets/header5.jpg",
  "/assets/header6.jpg",
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full mx-auto group bg-[#e3e6e6]">
      <div className="relative h-[250px] sm:h-[350px] md:h-[600px] lg:h-[750px] xl:h-[850px] overflow-hidden">
        {BANNERS.map((src, i) => (
          <Link
            to="/browse"
            key={i}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out block"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 10 : 0 }}
          >
            <img
              src={src}
              alt="Banner"
              className="w-full h-full object-cover object-top"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </Link>
        ))}

        {/* Amazon's precise bottom gradient fade to #e3e6e6 */}
        <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-[#e3e6e6] via-[#e3e6e6]/70 to-transparent pointer-events-none z-10" />
      </div>

      <button
        onClick={(e) => { e.preventDefault(); setCurrent((c) => (c - 1 + BANNERS.length) % BANNERS.length); }}
        className="absolute left-0 top-[10%] md:top-[15%] h-[250px] w-[50px] md:w-[80px] place-items-center opacity-0 group-hover:opacity-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f90] hidden sm:grid z-20 cursor-pointer"
      >
        <ChevronLeft className="h-[40px] w-[40px] md:h-[60px] md:w-[60px] text-[#222]" strokeWidth={1} />
      </button>

      <button
        onClick={(e) => { e.preventDefault(); setCurrent((c) => (c + 1) % BANNERS.length); }}
        className="absolute right-0 top-[10%] md:top-[15%] h-[250px] w-[50px] md:w-[80px] place-items-center opacity-0 group-hover:opacity-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f90] hidden sm:grid z-20 cursor-pointer"
      >
        <ChevronRight className="h-[40px] w-[40px] md:h-[60px] md:w-[60px] text-[#222]" strokeWidth={1} />
      </button>
    </div>
  );
}
