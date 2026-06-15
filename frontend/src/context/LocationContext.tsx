import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type LocationInfo = {
  city: string;
  state: string;
  pincode: string;
  locality: string;
};

type LocationCtx = {
  location: LocationInfo;
  setLocation: (loc: LocationInfo) => void;
};

const Ctx = createContext<LocationCtx | null>(null);

const KEY = "amazon-location-v1";

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationInfo>(() => {
    if (typeof window === "undefined") return { city: "Mumbai", state: "Maharashtra", pincode: "400001", locality: "Fort" };
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.state && parsed.locality) return parsed;
      }
    } catch {}
    return { city: "Mumbai", state: "Maharashtra", pincode: "400001", locality: "Fort" };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(location));
    }
  }, [location]);

  return (
    <Ctx.Provider value={{ location, setLocation }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLocationContext() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLocationContext must be used within LocationProvider");
  return c;
}
