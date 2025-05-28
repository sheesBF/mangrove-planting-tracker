
import React from "react";
import { useNavigate } from "react-router-dom";
import { Trees } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur border-b border-white/10">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer container mx-auto px-4 py-4 flex items-center gap-3 text-white"
      >
        <Trees className="h-6 w-6 text-emerald-400" />
        <h1 className="text-xl font-semibold tracking-tight hover:text-emerald-400 transition-colors">
          Mangrove Planting Tracker
        </h1>
      </div>
    </header>
  );
};

export default Header;
