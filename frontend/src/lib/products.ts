import { PRODUCT_IMAGE_REGISTRY } from "./productImageRegistry";

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;
  image: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  prime: boolean;
  deliveryDays: number;
  badge?: "Bestseller" | "Limited deal" | "Deal of the Day" | "New";
  tag?: string;
  dateAdded?: string;
};

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rng = rand(42);

function generate(
  category: string,
  items: { id: string; title: string; brand: string; subcategory: string; price: number; mrp: number }[]
): Product[] {
  return items.map((base) => {
    const dateOffset = Math.floor(rng() * 60);
    const dateAdded = new Date(Date.now() - dateOffset * 24 * 60 * 60 * 1000).toISOString();

    return {
      id: base.id,
      title: base.title,
      brand: base.brand,
      category,
      subcategory: base.subcategory,
      // Pull strictly from the new Product Image Registry
      image: PRODUCT_IMAGE_REGISTRY[base.id] || "/assets/categories/marketplace.jpg",
      price: base.price,
      mrp: base.mrp,
      rating: Math.round((4.0 + rng() * 0.9) * 10) / 10,
      reviews: Math.floor(500 + rng() * 15000),
      prime: rng() > 0.1,
      deliveryDays: Math.ceil(rng() * 4),
      badge: rng() > 0.85 ? "Deal of the Day" : rng() > 0.75 ? "Bestseller" : undefined,
      dateAdded
    };
  });
}

export const PRODUCTS: Product[] = [
  ...generate("Mobiles", [
    { id: "iphone15promax", title: "Apple iPhone 15 Pro Max (256 GB) - Natural Titanium", brand: "Apple", subcategory: "Smartphones", price: 159900, mrp: 159900 },
    { id: "samsungs24ultra", title: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB)", brand: "Samsung", subcategory: "Smartphones", price: 129999, mrp: 134999 },
    { id: "oneplus12", title: "OnePlus 12 (Flowy Emerald, 12GB RAM, 256GB Storage)", brand: "OnePlus", subcategory: "Smartphones", price: 64999, mrp: 69999 },
    { id: "iqooneo9pro", title: "iQOO Neo 9 Pro 5G (Fiery Red, 8GB RAM, 256GB Storage)", brand: "iQOO", subcategory: "Smartphones", price: 35999, mrp: 39999 },
    { id: "apple20wcharger", title: "Apple 20W USB-C Power Adapter", brand: "Apple", subcategory: "Accessories", price: 1699, mrp: 1900 },
    { id: "spigencase", title: "Spigen Liquid Air Back Cover Case for iPhone 15 Pro Max", brand: "Spigen", subcategory: "Accessories", price: 1099, mrp: 1699 },
    { id: "spigenscreen", title: "Spigen AlignMaster Tempered Glass Screen Protector for iPhone 15 Pro Max", brand: "Spigen", subcategory: "Accessories", price: 899, mrp: 1499 },
    { id: "oneplusbudspro2", title: "OnePlus Buds Pro 2 Bluetooth TWS Earbuds", brand: "OnePlus", subcategory: "Audio", price: 9999, mrp: 11999 },
  ]),
  
  ...generate("Electronics", [
    { id: "sonybravia55", title: "Sony Bravia 139 cm (55 inches) 4K Ultra HD Smart LED TV", brand: "Sony", subcategory: "Televisions", price: 57990, mrp: 99900 },
    { id: "samsungcrystal43", title: "Samsung 108 cm (43 inches) Crystal 4K Vivid Pro Ultra HD Smart TV", brand: "Samsung", subcategory: "Televisions", price: 32990, mrp: 49900 },
    { id: "sonyhts20r", title: "Sony HT-S20R Real 5.1ch Dolby Digital Soundbar", brand: "Sony", subcategory: "Audio", price: 17990, mrp: 23990 },
    { id: "amazonhdmicable", title: "Amazon Basics High-Speed HDMI Cable (6 Feet)", brand: "Amazon Basics", subcategory: "Accessories", price: 399, mrp: 850 },
    { id: "hppavilion15", title: "HP Pavilion 15, 12th Gen Intel Core i5, 16GB RAM/512GB SSD", brand: "HP", subcategory: "Laptops", price: 62990, mrp: 78000 },
    { id: "asusrogstrix", title: "Asus ROG Strix G16 Gaming Laptop, RTX 4060", brand: "Asus", subcategory: "Laptops", price: 104990, mrp: 135990 },
    { id: "macbookairm3", title: "Apple MacBook Air M3 chip (13-inch, 8GB RAM, 256GB)", brand: "Apple", subcategory: "Laptops", price: 114900, mrp: 114900 },
    { id: "sonywh1000xm5", title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", brand: "Sony", subcategory: "Audio", price: 29990, mrp: 34990 },
    { id: "ps5console", title: "Sony PlayStation 5 Console (Disc Edition)", brand: "Sony", subcategory: "Gaming", price: 54990, mrp: 54990 },
    { id: "dualsense", title: "DualSense Wireless Controller - Midnight Black", brand: "Sony", subcategory: "Gaming", price: 5990, mrp: 6490 },
  ]),

  ...generate("Fashion", [
    { id: "allensollyshirt", title: "Allen Solly Men's Regular Fit Cotton Shirt", brand: "Allen Solly", subcategory: "Men", price: 1299, mrp: 2199 },
    { id: "levis511jeans", title: "Levi's Men's 511 Slim Fit Jeans", brand: "Levi's", subcategory: "Men", price: 2100, mrp: 3500 },
    { id: "pumarunning", title: "Puma Men's Running Shoes", brand: "Puma", subcategory: "Footwear", price: 2999, mrp: 4999 },
    { id: "bibakurta", title: "Biba Women's Printed A-Line Kurta", brand: "Biba", subcategory: "Women", price: 1999, mrp: 3299 },
    { id: "tommywallet", title: "Tommy Hilfiger Men's Leather Wallet", brand: "Tommy Hilfiger", subcategory: "Accessories", price: 1499, mrp: 2499 },
    { id: "casiowatch", title: "Casio Vintage Series Digital Watch", brand: "Casio", subcategory: "Watches", price: 1695, mrp: 1695 },
    { id: "americantourister", title: "American Tourister 68 cms Medium Suitcase", brand: "American Tourister", subcategory: "Luggage", price: 3499, mrp: 7500 },
  ]),

  ...generate("Home & Kitchen", [
    { id: "philipsmixer", title: "Philips 750W Mixer Grinder with 3 Jars", brand: "Philips", subcategory: "Kitchen Appliances", price: 3499, mrp: 5495 },
    { id: "prestigecooker", title: "Prestige Deluxe Plus Aluminum Pressure Cooker, 5L", brand: "Prestige", subcategory: "Cookware", price: 1899, mrp: 2450 },
    { id: "borosiljars", title: "Borosil Glass Storage Jar Set of 4", brand: "Borosil", subcategory: "Storage", price: 850, mrp: 1100 },
    { id: "solimocomforter", title: "Solimo Microfibre Reversible Comforter (Double)", brand: "Solimo", subcategory: "Bedding", price: 1299, mrp: 2500 },
    { id: "miltonbottle", title: "Milton Thermosteel Hot and Cold Water Bottle 1L", brand: "Milton", subcategory: "Kitchen", price: 899, mrp: 1150 },
    { id: "wakefitmattress", title: "Wakefit Orthopedic Memory Foam Mattress", brand: "Wakefit", subcategory: "Furniture", price: 12499, mrp: 18500 },
  ]),

  ...generate("Grocery", [
    { id: "indiagaterice", title: "India Gate Premium Basmati Rice 5kg", brand: "India Gate", subcategory: "Daily essentials", price: 850, mrp: 1050 },
    { id: "fortuneoil", title: "Fortune Refined Sunflower Oil 5L", brand: "Fortune", subcategory: "Daily essentials", price: 750, mrp: 850 },
    { id: "tatasalt", title: "Tata Salt, Vacuum Evaporated Iodised Salt, 1kg", brand: "Tata", subcategory: "Daily essentials", price: 28, mrp: 28 },
    { id: "liptontea", title: "Lipton Honey Lemon Green Tea Bags (100 pcs)", brand: "Lipton", subcategory: "Beverages", price: 450, mrp: 600 },
    { id: "layschips", title: "Lay's Potato Chips, American Style Cream & Onion", brand: "Lay's", subcategory: "Snacks", price: 50, mrp: 50 },
    { id: "surfexcel", title: "Surf Excel Easy Wash Detergent Powder 3kg", brand: "Surf Excel", subcategory: "Household", price: 420, mrp: 450 },
  ]),

  ...generate("Beauty", [
    { id: "garnierserum", title: "Garnier Vitamin C Face Serum 30ml", brand: "Garnier", subcategory: "Skincare", price: 549, mrp: 699 },
    { id: "minimalistsunscreen", title: "Minimalist SPF 50 Sunscreen", brand: "Minimalist", subcategory: "Skincare", price: 399, mrp: 399 },
    { id: "maybellinelipstick", title: "Maybelline New York Super Stay Matte Ink Liquid Lipstick", brand: "Maybelline", subcategory: "Makeup", price: 650, mrp: 699 },
    { id: "mamaearthoil", title: "Mamaearth Onion Hair Oil 200ml", brand: "Mamaearth", subcategory: "Haircare", price: 399, mrp: 419 },
    { id: "lorealshampoo", title: "L'Oreal Paris Moisture Sealing Shampoo", brand: "L'Oreal Paris", subcategory: "Haircare", price: 449, mrp: 550 },
  ]),

  ...generate("Books", [
    { id: "atomichabits", title: "Atomic Habits by James Clear", brand: "James Clear", subcategory: "Self-Help", price: 499, mrp: 799 },
    { id: "psychologyofmoney", title: "The Psychology of Money", brand: "Morgan Housel", subcategory: "Finance", price: 399, mrp: 499 },
    { id: "ikigai", title: "Ikigai: The Japanese Secret to a Long and Happy Life", brand: "Hector Garcia", subcategory: "Philosophy", price: 450, mrp: 550 },
    { id: "richdad", title: "Rich Dad Poor Dad", brand: "Robert Kiyosaki", subcategory: "Finance", price: 350, mrp: 499 },
  ]),
];

export const CATEGORIES = [
  { name: "Mobiles", image: "/assets/categories/smartphones.jpg" },
  { name: "Electronics", image: "/assets/categories/laptops.jpg" },
  { name: "Fashion", image: "/assets/categories/marketplace.jpg" },
  { name: "Grocery", image: "/assets/categories/grocery.jpg" },
  { name: "Home & Kitchen", image: "/assets/categories/kitchen.jpg" },
  { name: "Beauty", image: "/assets/categories/marketplace.jpg" },
  { name: "Books", image: "/assets/categories/books.jpg" },
];

export const byCategory = (cat: string) => PRODUCTS.filter((p) => p.category === cat);
export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
