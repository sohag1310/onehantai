import React from "react";
import { Play, Star, Bookmark, ShieldCheck, Film, Tv } from "lucide-react";
import { AnimeItem } from "../types/anime.ts";

interface AnimeCardProps {
  anime: AnimeItem;
  onSelect: (anime: AnimeItem) => void;
  onPlayDirect: (anime: AnimeItem) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (anime: AnimeItem) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onSelect,
  onPlayDirect,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  return (
    <div className="group relative flex flex-col bg-[#1f222a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#06C149]/40 hover:shadow-xl hover:shadow-[#06C149]/10 transition-all duration-300">
      {/* Poster Image Container */}
      <div
        onClick={() => onSelect(anime)}
        className="relative aspect-[2/3] w-full overflow-hidden cursor-pointer bg-[#181a20]"
        role="button"
        tabIndex={0}
        aria-label={`View details for ${anime.title}`}
        onKeyDown={(e) => e.key === "Enter" && onSelect(anime)}
      >
        <img
          src={anime.image}
          alt={anime.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10 pointer-events-none">
          {/* Score */}
          <div className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-yellow-400 flex items-center gap-1 border border-white/10 shadow-sm">
            <Star className="w-2.5 h-2.5 fill-yellow-400" />
            <span>{anime.score}</span>
          </div>

          {/* Type Badge */}
          <div className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-semibold text-gray-200 border border-white/10 flex items-center gap-1">
            {anime.type === "Movie" ? (
              <Film className="w-2.5 h-2.5 text-[#06C149]" />
            ) : (
              <Tv className="w-2.5 h-2.5 text-[#06C149]" />
            )}
            <span>{anime.type}</span>
          </div>
        </div>

        {/* Bottom Poster Gradient & Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f222a] via-transparent to-transparent opacity-80" />

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] z-10 pointer-events-none">
          <span className="bg-[#06C149]/90 text-black font-extrabold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
            Verified
          </span>
          <span className="bg-black/60 text-gray-300 px-1.5 py-0.5 rounded text-[9px] font-medium backdrop-blur-xs">
            HIN • DUB • SUB
          </span>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayDirect(anime);
            }}
            className="w-12 h-12 rounded-full bg-[#06C149] text-black flex items-center justify-center shadow-lg shadow-[#06C149]/30 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label={`Stream ${anime.title} now`}
          >
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </button>

          <span className="text-[11px] font-bold text-white text-center">
            Click to Watch
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(anime);
            }}
            className="text-xs text-gray-300 hover:text-[#06C149] flex items-center gap-1 cursor-pointer bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md"
            aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isWatchlisted ? "text-[#06C149] fill-[#06C149]" : ""
              }`}
            />
            <span>{isWatchlisted ? "Saved" : "Watchlist"}</span>
          </button>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <h3
          onClick={() => onSelect(anime)}
          className="text-xs sm:text-sm font-bold text-white group-hover:text-[#06C149] transition-colors line-clamp-1 cursor-pointer"
          title={anime.title}
        >
          {anime.title}
        </h3>

        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
          <span className="truncate max-w-[120px]">
            {anime.genres && anime.genres[0] ? anime.genres[0] : "Anime"}
          </span>
          <span className="font-semibold text-emerald-400">
            {anime.year || "2024"}
          </span>
        </div>
      </div>
    </div>
  );
};
