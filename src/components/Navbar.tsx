import React, { useState } from "react";
import {
  Search,
  Bookmark,
  History,
  Tv,
  Film,
  Flame,
  X,
  Volume2,
} from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  watchlistCount: number;
  historyCount: number;
  onOpenWatchlist: () => void;
  onOpenHistory: () => void;
  langFilter: string;
  onToggleLangFilter: (lang: string) => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  watchlistCount,
  historyCount,
  onOpenWatchlist,
  onOpenHistory,
  langFilter,
  onToggleLangFilter,
  onGoHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: "all", label: "All Anime", icon: Tv },
    { id: "trending", label: "Trending", icon: Flame },
    { id: "action", label: "Action", icon: null },
    { id: "fantasy", label: "Fantasy", icon: null },
    { id: "movie", label: "Movies", icon: Film },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={onGoHome}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            role="button"
            tabIndex={0}
            aria-label="AniStream Hub Homepage"
            onKeyDown={(e) => e.key === "Enter" && onGoHome()}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06C149] to-emerald-700 flex items-center justify-center shadow-lg shadow-[#06C149]/20 group-hover:scale-105 transition-transform">
              <Tv className="w-5 h-5 text-black font-extrabold" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                AniStream
                <span className="text-xs bg-[#06C149] text-black font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  HUB
                </span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium -mt-1 hidden sm:block">
                Ultra HD Anime Streamer
              </span>
            </div>
          </div>

          {/* Quick Categories (Desktop) */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {categories.map((c) => {
              const Icon = c.icon;
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#06C149] text-black font-bold shadow-md shadow-[#06C149]/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  aria-pressed={isActive}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {c.label}
                </button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anime, movies, genres..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#1f222a] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#06C149] focus:ring-1 focus:ring-[#06C149] transition-all"
                aria-label="Search anime"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 text-gray-400 hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions: Lang preference, Watchlist, History */}
          <div className="flex items-center gap-2">
            {/* Preferred Audio Quick Toggle */}
            <div className="hidden lg:flex items-center bg-[#1f222a] p-1 rounded-xl border border-white/5 text-[11px]">
              <span className="px-2 text-gray-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-[#06C149]" />
                Audio:
              </span>
              {(["hin", "eng", "sub"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => onToggleLangFilter(l)}
                  className={`px-2 py-1 rounded-md font-bold uppercase transition-all cursor-pointer ${
                    langFilter === l
                      ? "bg-[#06C149] text-black shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                  aria-label={`Switch audio to ${l}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Watchlist Button */}
            <button
              onClick={onOpenWatchlist}
              className="relative p-2 rounded-xl bg-[#1f222a] text-gray-300 hover:text-white hover:border-[#06C149]/40 border border-white/5 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
              aria-label={`Open Watchlist with ${watchlistCount} items`}
            >
              <Bookmark className="w-4 h-4 text-[#06C149]" />
              <span className="hidden sm:inline">Watchlist</span>
              {watchlistCount > 0 && (
                <span className="bg-[#06C149] text-black font-black text-[10px] px-1.5 py-0.2 rounded-full ml-0.5">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-xl bg-[#1f222a] text-gray-300 hover:text-white hover:border-[#06C149]/40 border border-white/5 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
              aria-label={`Open History with ${historyCount} items`}
            >
              <History className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="bg-emerald-500/20 text-[#06C149] font-bold text-[10px] px-1.5 py-0.2 rounded-full border border-[#06C149]/30">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
