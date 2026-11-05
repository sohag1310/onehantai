import React, { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  Minimize2,
  Tv,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { EpisodeItem } from "../types/anime.ts";

interface VideoPlayerProps {
  slug: string;
  animeTitle: string;
  season: number;
  ep: number;
  totalEpisodes: number;
  currentEpisodeTitle?: string;
  onSeasonChange: (newSeason: number) => void;
  onEpChange: (newEp: number) => void;
  onClosePlayer?: () => void;
  onProgressUpdate?: (ep: number, percent: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  slug,
  animeTitle,
  season,
  ep,
  totalEpisodes,
  currentEpisodeTitle,
  onSeasonChange,
  onEpChange,
  onClosePlayer,
  onProgressUpdate,
}) => {
  const [server, setServer] = useState("multi-1");
  const [lang, setLang] = useState("hin");
  const [servers, setServers] = useState<{ name: string; url: string }[]>([]);
  const [selectedServerIdx, setSelectedServerIdx] = useState(0);
  const [directUrl, setDirectUrl] = useState("");
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Player mode toggles
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [autoplayNext, setAutoplayNext] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch episode stream details whenever slug, season, ep, server, or lang changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingStream(true);
    setErrorMsg("");

    fetch(
      `/api/hanime.tv/episode?slug=${slug}&season=${season}&ep=${ep}&server=${server}&lang=${lang}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (isCancelled) return;
        if (d.success) {
          setServers(d.servers || []);
          setDirectUrl(d.directUrl || "");
          setSelectedServerIdx(0);
        } else {
          setErrorMsg(d.error || "Failed to load episode stream");
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setErrorMsg(err.message || "Network error loading stream");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingStream(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [slug, season, ep, server, lang]);

  const activeServer = servers[selectedServerIdx];

  const handleNextEp = () => {
    if (ep < totalEpisodes) {
      onEpChange(ep + 1);
    }
  };

  const handlePrevEp = () => {
    if (ep > 1) {
      onEpChange(ep - 1);
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const isDirectVideo =
    activeServer?.url?.endsWith(".mp4") ||
    activeServer?.url?.includes(".mp4?") ||
    activeServer?.url?.includes("sample");

  return (
    <>
      {/* Cinema Mode Backdrop */}
      {isCinemaMode && (
        <div
          onClick={() => setIsCinemaMode(false)}
          className="fixed inset-0 bg-black/90 z-40 transition-opacity backdrop-blur-sm"
          title="Click to exit cinema mode"
        />
      )}

      <div
        ref={containerRef}
        className={`w-full transition-all duration-300 ${
          isCinemaMode ? "relative z-50 py-4" : ""
        } ${isTheaterMode ? "max-w-none" : "max-w-5xl mx-auto"}`}
      >
        {/* Top Player Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#06C149] text-black font-black text-xs px-2 py-0.5 rounded uppercase">
              S{season} : EP{ep}
            </span>
            <h2 className="text-sm font-bold text-white truncate max-w-md">
              {animeTitle} – {currentEpisodeTitle || `Episode ${ep}`}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Cinema mode toggle */}
            <button
              onClick={() => setIsCinemaMode(!isCinemaMode)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                isCinemaMode
                  ? "bg-[#06C149] text-black font-bold"
                  : "bg-[#1f222a] text-gray-300 hover:text-white"
              }`}
              title="Toggle Cinema Mode"
              aria-label="Cinema mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cinema</span>
            </button>

            {/* Theater mode toggle */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                isTheaterMode
                  ? "bg-[#06C149] text-black font-bold"
                  : "bg-[#1f222a] text-gray-300 hover:text-white"
              }`}
              title="Toggle Theater Mode"
              aria-label="Theater mode"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Theater</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 rounded-lg bg-[#1f222a] text-gray-300 hover:text-white cursor-pointer"
              title="Fullscreen"
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Close button if provided */}
            {onClosePlayer && (
              <button
                onClick={onClosePlayer}
                className="px-2.5 py-1 text-xs rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 cursor-pointer"
              >
                Close Player
              </button>
            )}
          </div>
        </div>

        {/* Video Canvas Container (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
          {isLoadingStream ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#181a20] text-white">
              <div className="w-10 h-10 border-4 border-[#06C149] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400 font-medium">
                Loading stream servers...
              </p>
              <span className="text-[10px] text-gray-500">
                Checking VidHide, StreamWish & HGCloud nodes
              </span>
            </div>
          ) : activeServer?.url ? (
            isDirectVideo ? (
              <video
                key={activeServer.url}
                src={activeServer.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
                onEnded={handleNextEp}
                onTimeUpdate={(e) => {
                  const target = e.currentTarget;
                  if (target.duration > 0 && onProgressUpdate) {
                    const pct = Math.round(
                      (target.currentTime / target.duration) * 100
                    );
                    onProgressUpdate(ep, pct);
                  }
                }}
              />
            ) : (
              <iframe
                key={activeServer.url}
                src={activeServer.url}
                className="w-full h-full border-0"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                title={`${animeTitle} - Episode ${ep}`}
              />
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-[#181a20]">
              <AlertCircle className="w-10 h-10 text-yellow-400 mb-2" />
              <p className="text-sm font-semibold text-gray-200 mb-1">
                No direct embed server response
              </p>
              <p className="text-xs text-gray-400 mb-4 max-w-sm">
                Stream node is currently under heavy traffic. You can switch
                servers or open the source player:
              </p>
              {directUrl && (
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#06C149] hover:bg-emerald-400 text-black font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Watch on External Server
                </a>
              )}
            </div>
          )}
        </div>

        {/* Server switcher */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs text-gray-400 font-bold uppercase shrink-0">
            Servers:
          </span>
          {servers.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedServerIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-all ${
                selectedServerIdx === idx
                  ? "bg-[#06C149] text-black font-bold shadow-md shadow-[#06C149]/20"
                  : "bg-[#1f222a] text-gray-300 hover:text-white hover:bg-[#2b303c]"
              }`}
            >
              {s.name || `Server ${idx + 1}`}
            </button>
          ))}
          {servers.length === 0 && !isLoadingStream && (
            <span className="text-xs text-gray-500 italic">No servers listed</span>
          )}
        </div>

        {/* Episode navigation & language controls */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-[#1f222a] p-3 rounded-2xl border border-white/5">
          {/* Language Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-[#06C149]" />
              Language:
            </span>
            {[
              { v: "hin", l: "Hindi Dub" },
              { v: "eng", l: "English Dub" },
              { v: "sub", l: "Japanese (Sub)" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setLang(opt.v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  lang === opt.v
                    ? "bg-[#06C149] text-black font-bold shadow-md shadow-[#06C149]/20"
                    : "bg-[#181a20] text-gray-300 hover:text-white"
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>

          {/* Episode Prev / Next controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevEp}
              disabled={ep <= 1}
              className="px-3 py-1.5 rounded-xl bg-[#181a20] hover:bg-[#252833] disabled:opacity-40 disabled:cursor-not-allowed text-xs text-gray-300 hover:text-white flex items-center gap-1 cursor-pointer font-medium transition-colors"
              aria-label="Previous episode"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev Ep
            </button>

            <span className="text-xs font-bold text-white px-2">
              Ep {ep} of {totalEpisodes}
            </span>

            <button
              onClick={handleNextEp}
              disabled={ep >= totalEpisodes}
              className="px-3 py-1.5 rounded-xl bg-[#06C149] hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-black font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              aria-label="Next episode"
            >
              Next Ep
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
