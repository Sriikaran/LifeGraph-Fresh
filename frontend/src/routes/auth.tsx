import { createFileRoute, useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ShieldCheck, Lock, RefreshCcw, Database } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const router = useRouter();
  const search: any = router.latestLocation.search;
  const returnUrl = search.returnUrl || "/";
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate({ to: returnUrl, replace: true });
    }
  }, [user, navigate, returnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message, { id: "auth" });
      } else {
        toast.success("Welcome back!", { id: "auth" });
      }
    } else {
      if (!name.trim()) {
        setLoading(false);
        return toast.error("Please enter your name");
      }
      if (password.length < 6) {
        setLoading(false);
        return toast.error("Password must be at least 6 characters");
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("An account with this email already exists.");
        } else {
          toast.error(error.message, { id: "auth" });
        }
      } else {
        toast.success("Account created successfully!", { id: "auth" });
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + returnUrl }
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <Link to="/" className="text-4xl font-extrabold mb-8 tracking-tight text-gray-900">
        kart<span className="text-[#c45500]">.in</span>
      </Link>

      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button 
            type="button"
            className={`flex-1 py-5 text-base font-semibold transition-colors ${mode === 'signin' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            onClick={() => setMode('signin')}
            disabled={loading}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`flex-1 py-5 text-base font-semibold transition-colors ${mode === 'signup' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            onClick={() => setMode('signup')}
            disabled={loading}
          >
            Create Account
          </button>
        </div>

        <div className="p-8">
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl h-[60px] text-base font-semibold hover:bg-gray-50 transition-colors bg-white mb-6 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            Continue with Google
          </button>

          <div className="relative flex items-center py-4 mb-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Your name</label>
                <input 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full border border-gray-300 rounded-xl px-5 h-[60px] text-base focus:ring-2 focus:ring-[#ffd814] focus:border-[#ffd814] outline-none transition-all placeholder:text-gray-400" 
                  placeholder="First and last name" 
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full border border-gray-300 rounded-xl px-5 h-[60px] text-base focus:ring-2 focus:ring-[#ffd814] focus:border-[#ffd814] outline-none transition-all placeholder:text-gray-400" 
                placeholder="name@example.com"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full border border-gray-300 rounded-xl px-5 h-[60px] text-base focus:ring-2 focus:ring-[#ffd814] focus:border-[#ffd814] outline-none transition-all placeholder:text-gray-400" 
                placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"} 
                disabled={loading}
              />
            </div>

            <button 
              disabled={loading} 
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-xl h-[60px] text-lg font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
            
            <p className="text-xs text-gray-500 leading-relaxed pt-2">
              By continuing, you agree to Kart.in's <span className="text-[#007185] hover:text-[#c45500] cursor-pointer hover:underline">Conditions of Use</span> and <span className="text-[#007185] hover:text-[#c45500] cursor-pointer hover:underline">Privacy Notice</span>.
            </p>
          </form>
        </div>
      </div>

      <div className="w-full max-w-[500px] mt-8 grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span>Secure Authentication</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-green-600" />
          <span>Encrypted Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCcw className="w-5 h-5 text-green-600" />
          <span>Synced Across Devices</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-green-600" />
          <span>Backed by Supabase</span>
        </div>
      </div>
    </div>
  );
}
