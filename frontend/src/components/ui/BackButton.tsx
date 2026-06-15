import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.history.back();
    }
  };

  return (
    <button 
      type="button"
      onClick={handleClick} 
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm mb-4"
    >
      <ArrowLeft className="w-5 h-5" />
      Back
    </button>
  );
}
