import React from "react";
import { Play, Bookmark, Star, Sparkles, Volume2, ShieldCheck } from "lucide-react";
import { AnimeItem } from "../types/anime.ts";

interface HeroBannerProps {
  anime: AnimeItem;
  onWatch: (anime: AnimeItem) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (anime: AnimeItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  anime,
  onWatch,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  if (!anime) return null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl bg-[#1f222a]">
      {/* Background with layered gradients */}
      <div className="absolute inset-0">
        <img
          src={anime.banner || anime.image}
          alt={anime.title}
          className="w-full h-full object-cover object-top opacity-40 scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] via-[#181a20]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181a20] via-[#181a20]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 min-h-[380px]">
        <div className="max-w-2xl space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#06C149] text-black font-extrabold text-[11px] px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 fill-black" />
              Featured Spotlight
            </span>
            <span className="bg-white/10 text-white font-semibold text-[11px] px-2.5 py-1 rounded-md backdrop-blur-md border border-white/10 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {anime.score} Rating
            </span>
            <span className="bg-emerald-500/10 text-[#06C149] font-bold text-[11px] px-2.5 py-1 rounded-md border border-[#06C149]/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Multi-Server
            </span>
            <span className="bg-white/5 text-gray-300 text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-[#06C149]" />
              Hin • Eng • Sub
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {anime.title}
          </h1>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed max-w-xl">
            {anime.synopsis ||
              "Follow the high-stakes journey of power, mysterious entities, and breathtaking battles. Stream all episodes in uncompressed 1080p with instant server failover."}
          </p>

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {anime.genres.map((g) => (
                <span
                  key={g}
                  className="text-[10px] text-gray-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onWatch(anime)}
              className="bg-[#06C149] hover:bg-emerald-400 text-black font-extrabold px-6 py-3 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-[#06C149]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              Stream Episode 1
            </button>

            <button
              onClick={() => onToggleWatchlist(anime)}
              className={`px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all border ${
                isWatchlisted
                  ? "bg-[#06C149]/20 text-[#06C149] border-[#06C149]/50"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/10"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isWatchlisted ? "text-[#06C149] fill-[#06C149]" : "text-white"
                }`}
              />
              {isWatchlisted ? "Saved in Watchlist" : "Add to Watchlist"}
            </button>
          </div>
        </div>

        {/* Poster preview on right */}
        <div className="hidden md:block shrink-0">
          <div className="relative group w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group-hover:border-[#06C149]/50 transition-all">
            <img
              src={anime.image}
              alt={anime.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                onClick={() => onWatch(anime)}
                className="w-12 h-12 rounded-full bg-[#06C149] text-black flex items-center justify-center shadow-lg cursor-pointer"
                aria-label="Play now"
              >
                <Play className="w-5 h-5 fill-black ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
