import { Package2 } from "lucide-react";

export default function AuthHeader() {
  return (
    <header className="flex items-center justify-center py-6 bg-white shadow-sm">
      <div className="flex items-center gap-2 text-2xl font-bold text-orange-500">
        <Package2 className="h-8 w-8" />
        <span>ShopVille</span>
      </div>
    </header>
  );
}
