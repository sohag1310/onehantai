import React from "react";
import { X, Play, Trash2, History, RotateCcw } from "lucide-react";
import { WatchHistoryItem } from "../types/anime.ts";

interface WatchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: WatchHistoryItem[];
  onResume: (item: WatchHistoryItem) => void;
  onClearHistory: () => void;
}

export const WatchHistoryModal: React.FC<WatchHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onResume,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#1f222a] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#06C149]/20 text-[#06C149] rounded-xl">
              <History className="w-5 h-5 text-[#06C149]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Watch History</h2>
              <p className="text-xs text-gray-400">
                Continue watching right where you left off
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                Clear History
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
          {history.map((item) => (
            <div
              key={`${item.slug}-${item.season}-${item.episode}`}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#181a20] border border-white/5 hover:border-white/10 transition-all group"
            >
              <div
                onClick={() => {
                  onResume(item);
                  onClose();
                }}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              >
                <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-[#252833]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Progress Bar at bottom of thumbnail */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60">
                    <div
                      className="h-full bg-[#06C149]"
                      style={{
                        width: `${Math.min(100, item.progressPercent || 25)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-[#06C149] transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-xs text-[#06C149] font-semibold mt-1">
                    Season {item.season} • Episode {item.episode}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Watched {item.progressPercent || 10}%
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => {
                    onResume(item);
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl bg-[#06C149] hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Resume
                </button>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <RotateCcw className="w-12 h-12 text-gray-600 mx-auto" />
              <p className="text-sm font-medium text-gray-300">
                No watch history recorded yet
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Episodes you stream will be automatically saved here with your
                current playback point.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
