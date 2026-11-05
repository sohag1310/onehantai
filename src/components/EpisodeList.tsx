import React, { useState } from "react";
import { Play, CheckCircle2, Clock, Search } from "lucide-react";
import { EpisodeItem } from "../types/anime.ts";

interface EpisodeListProps {
  episodes: EpisodeItem[];
  currentEp: number;
  currentSeason: number;
  totalSeasons: number;
  onSelectEpisode: (ep: number) => void;
  onSelectSeason: (season: number) => void;
  watchedEpisodes?: Set<number>;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  currentEp,
  currentSeason,
  totalSeasons,
  onSelectEpisode,
  onSelectSeason,
  watchedEpisodes = new Set(),
}) => {
  const [filterText, setFilterText] = useState("");

  const filteredEpisodes = episodes.filter((ep) => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (
      ep.title.toLowerCase().includes(q) ||
      String(ep.episode).includes(q) ||
      `episode ${ep.episode}`.includes(q)
    );
  });

  return (
    <div className="bg-[#1f222a] rounded-2xl p-4 sm:p-6 border border-white/5 space-y-4">
      {/* Header with Season Selector and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Episodes</span>
            <span className="text-xs bg-[#06C149]/20 text-[#06C149] font-bold px-2 py-0.5 rounded-full border border-[#06C149]/30">
              {episodes.length} Total
            </span>
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Season Switcher */}
          {totalSeasons > 1 && (
            <div className="flex items-center gap-1 bg-[#181a20] p-1 rounded-xl border border-white/5">
              <span className="text-[11px] text-gray-400 px-2 font-medium">
                Season:
              </span>
              {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                <button
                  key={s}
                  onClick={() => onSelectSeason(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    currentSeason === s
                      ? "bg-[#06C149] text-black shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  S{s}
                </button>
              ))}
            </div>
          )}

          {/* Episode Quick Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Find episode..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-[#181a20] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#06C149] transition-all w-32 sm:w-36"
            />
          </div>
        </div>
      </div>

      {/* Episode Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredEpisodes.map((ep) => {
          const isPlaying = ep.episode === currentEp;
          const isWatched = watchedEpisodes.has(ep.episode);

          return (
            <button
              key={ep.id || ep.episode}
              onClick={() => onSelectEpisode(ep.episode)}
              className={`group relative p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isPlaying
                  ? "bg-[#06C149]/15 border-[#06C149] shadow-lg shadow-[#06C149]/10"
                  : "bg-[#181a20] hover:bg-[#252833] border-white/5 hover:border-white/20"
              }`}
              aria-label={`Play Episode ${ep.episode}`}
            >
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <span
                  className={`text-xs font-black ${
                    isPlaying
                      ? "text-[#06C149]"
                      : "text-white group-hover:text-[#06C149]"
                  }`}
                >
                  EP {ep.episode}
                </span>

                {isPlaying ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06C149] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06C149]"></span>
                  </span>
                ) : isWatched ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Play className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors" />
                )}
              </div>

              <div className="text-[11px] text-gray-300 font-medium truncate w-full">
                {ep.title}
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {ep.duration || "24m"}
                </span>
                {isPlaying && (
                  <span className="text-[#06C149] font-bold text-[9px] uppercase tracking-wider">
                    Playing
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredEpisodes.length === 0 && (
        <div className="text-center py-8 text-xs text-gray-400">
          No episodes found matching "{filterText}".
        </div>
      )}
    </div>
  );
};
