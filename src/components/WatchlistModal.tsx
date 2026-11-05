import React from "react";
import { X, Play, Trash2, Bookmark } from "lucide-react";
import { AnimeItem } from "../types/anime.ts";

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: AnimeItem[];
  onPlayAnime: (anime: AnimeItem) => void;
  onRemoveFromWatchlist: (slug: string) => void;
  onClearWatchlist: () => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onPlayAnime,
  onRemoveFromWatchlist,
  onClearWatchlist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#1f222a] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#06C149]/20 text-[#06C149] rounded-xl">
              <Bookmark className="w-5 h-5 fill-[#06C149]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Your Watchlist</h2>
              <p className="text-xs text-gray-400">
                {watchlist.length} saved anime for quick access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {watchlist.length > 0 && (
              <button
                onClick={onClearWatchlist}
                className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {watchlist.map((item) => (
            <div
              key={item.slug}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#181a20] border border-white/5 hover:border-white/10 transition-all group"
            >
              <div
                onClick={() => {
                  onPlayAnime(item);
                  onClose();
                }}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-18 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-[#06C149] transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span className="text-yellow-400 font-semibold">
                      ★ {item.score}
                    </span>
                    <span>•</span>
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.genres?.[0] || "Anime"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onPlayAnime(item);
                    onClose();
                  }}
                  className="p-2 rounded-xl bg-[#06C149] text-black hover:bg-emerald-400 transition-colors cursor-pointer shadow-md"
                  aria-label={`Stream ${item.title}`}
                >
                  <Play className="w-4 h-4 fill-black" />
                </button>

                <button
                  onClick={() => onRemoveFromWatchlist(item.slug)}
                  className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {watchlist.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <Bookmark className="w-12 h-12 text-gray-600 mx-auto" />
              <p className="text-sm font-medium text-gray-300">
                Your watchlist is empty
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Click the "Add to Watchlist" or bookmark button on any anime card
                to save it here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
