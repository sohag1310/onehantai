import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Flame,
  Film,
  Tv,
  Filter,
  CheckCircle2,
  RefreshCw,
  Search,
  AlertCircle,
  Play,
  Bookmark,
  Share2,
} from "lucide-react";
import { AnimeItem, SeriesDetail, WatchHistoryItem } from "./types/anime.ts";
import { Navbar } from "./components/Navbar.tsx";
import { HeroBanner } from "./components/HeroBanner.tsx";
import { VideoPlayer } from "./components/VideoPlayer.tsx";
import { AnimeCard } from "./components/AnimeCard.tsx";
import { EpisodeList } from "./components/EpisodeList.tsx";
import { WatchlistModal } from "./components/WatchlistModal.tsx";
import { WatchHistoryModal } from "./components/WatchHistoryModal.tsx";
import { Footer } from "./components/Footer.tsx";

export default function App() {
  // Feed state
  const [animes, setAnimes] = useState<AnimeItem[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [feedError, setFeedError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Active streaming state
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem | null>(null);
  const [seriesDetails, setSeriesDetails] = useState<SeriesDetail | null>(null);
  const [isLoadingSeries, setIsLoadingSeries] = useState(false);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEp, setCurrentEp] = useState(1);
  const [activeLang, setActiveLang] = useState("hin");

  // User features: Watchlist & History
  const [watchlist, setWatchlist] = useState<AnimeItem[]>(() => {
    try {
      const saved = localStorage.getItem("anistream_watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("anistream_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Watched episode IDs for current series
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<number>>(new Set());

  // Ref to scroll to player
  const playerSectionRef = useRef<HTMLDivElement>(null);

  // Save watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("anistream_watchlist", JSON.stringify(watchlist));
    } catch {}
  }, [watchlist]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("anistream_history", JSON.stringify(history));
    } catch {}
  }, [history]);

  // Fetch Feed
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingFeed(true);
    setFeedError("");

    const params = new URLSearchParams({
      page: String(currentPage),
      search: searchQuery,
      category: activeCategory,
    });

    fetch(`/api/hanime.tv/feed?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (isCancelled) return;
        if (data.success) {
          setAnimes(data.animes || []);
        } else {
          setFeedError(data.error || "Failed to load feed");
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setFeedError(err.message || "Failed to reach backend stream server");
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingFeed(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [searchQuery, activeCategory, currentPage]);

  // Fetch Series Details when selectedAnime or currentSeason changes
  useEffect(() => {
    if (!selectedAnime) {
      setSeriesDetails(null);
      return;
    }

    let isCancelled = false;
    setIsLoadingSeries(true);

    fetch(
      `/api/hanime.tv/series?slug=${selectedAnime.slug}&season=${currentSeason}&lang=${activeLang}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (isCancelled) return;
        if (data.success) {
          setSeriesDetails(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!isCancelled) setIsLoadingSeries(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedAnime?.slug, currentSeason, activeLang]);

  // Handle direct play from card or hero
  const handleStartWatching = (anime: AnimeItem, ep: number = 1, season: number = 1) => {
    setSelectedAnime(anime);
    setCurrentSeason(season);
    setCurrentEp(ep);

    // Record in history
    addToHistory(anime, season, ep, 10);

    // Scroll to player smoothly
    setTimeout(() => {
      playerSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Add / Remove from Watchlist
  const handleToggleWatchlist = (anime: AnimeItem) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.slug === anime.slug);
      if (exists) {
        return prev.filter((item) => item.slug !== anime.slug);
      } else {
        return [anime, ...prev];
      }
    });
  };

  const handleRemoveFromWatchlist = (slug: string) => {
    setWatchlist((prev) => prev.filter((item) => item.slug !== slug));
  };

  // Add to History
  const addToHistory = (
    anime: AnimeItem,
    season: number,
    episode: number,
    progressPercent: number
  ) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.slug !== anime.slug);
      const newItem: WatchHistoryItem = {
        slug: anime.slug,
        title: anime.title,
        image: anime.image,
        season,
        episode,
        progressPercent,
        timestamp: Date.now(),
      };
      return [newItem, ...filtered];
    });

    setWatchedEpisodes((prev) => new Set([...prev, episode]));
  };

  // Resume from History
  const handleResumeHistory = (item: WatchHistoryItem) => {
    const matched = animes.find((a) => a.slug === item.slug) || {
      mal_id: item.slug,
      slug: item.slug,
      title: item.title,
      image: item.image,
      score: 9.0,
      type: "TV",
    };
    handleStartWatching(matched, item.episode, item.season);
  };

  // Categories list
  const categoryTabs = [
    { id: "all", label: "All" },
    { id: "trending", label: "Trending" },
    { id: "action", label: "Action" },
    { id: "shounen", label: "Shounen" },
    { id: "fantasy", label: "Fantasy" },
    { id: "supernatural", label: "Supernatural" },
    { id: "sci-fi", label: "Sci-Fi" },
    { id: "movie", label: "Movies" },
  ];

  const featuredHeroAnime = animes[0] || null;

  return (
    <div className="min-h-screen bg-[#181a20] text-gray-100 flex flex-col font-sans selection:bg-[#06C149] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery("");
        }}
        watchlistCount={watchlist.length}
        historyCount={history.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        langFilter={activeLang}
        onToggleLangFilter={setActiveLang}
        onGoHome={() => {
          setSelectedAnime(null);
          setActiveCategory("all");
          setSearchQuery("");
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Active Streaming Video Player Section */}
        {selectedAnime && (
          <div ref={playerSectionRef} className="mb-12 space-y-6 animate-in fade-in duration-300">
            {/* Player Container */}
            <VideoPlayer
              slug={selectedAnime.slug}
              animeTitle={selectedAnime.title}
              season={currentSeason}
              ep={currentEp}
              totalEpisodes={
                seriesDetails?.episodesCount ||
                (selectedAnime.type === "Movie" ? 1 : 12)
              }
              currentEpisodeTitle={
                seriesDetails?.episodes?.find((e) => e.episode === currentEp)
                  ?.title
              }
              onSeasonChange={setCurrentSeason}
              onEpChange={(newEp) => {
                setCurrentEp(newEp);
                addToHistory(selectedAnime, currentSeason, newEp, 15);
              }}
              onClosePlayer={() => setSelectedAnime(null)}
              onProgressUpdate={(ep, pct) => {
                addToHistory(selectedAnime, currentSeason, ep, pct);
              }}
            />

            {/* Series Info & Episode Selection Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Synopsis & Metadata */}
              <div className="lg:col-span-1 bg-[#1f222a] rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAnime.image}
                    alt={selectedAnime.title}
                    className="w-16 h-22 object-cover rounded-xl shadow-md border border-white/10"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white truncate">
                      {selectedAnime.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span className="text-yellow-400 font-bold">
                        ★ {selectedAnime.score}
                      </span>
                      <span>•</span>
                      <span className="text-[#06C149] font-bold">
                        {selectedAnime.type}
                      </span>
                      <span>•</span>
                      <span>{selectedAnime.year || "2024"}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed max-h-32 overflow-y-auto pr-1">
                  {seriesDetails?.synopsis || selectedAnime.synopsis}
                </p>

                <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleWatchlist(selectedAnime)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border transition-colors ${
                      watchlist.some((w) => w.slug === selectedAnime.slug)
                        ? "bg-[#06C149]/20 text-[#06C149] border-[#06C149]/50"
                        : "bg-[#181a20] text-gray-300 border-white/5 hover:text-white"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {watchlist.some((w) => w.slug === selectedAnime.slug)
                      ? "In Watchlist"
                      : "Save Watchlist"}
                  </button>
                </div>
              </div>

              {/* Right Column: Episode Grid */}
              <div className="lg:col-span-2">
                <EpisodeList
                  episodes={seriesDetails?.episodes || []}
                  currentEp={currentEp}
                  currentSeason={currentSeason}
                  totalSeasons={seriesDetails?.seasonsCount || 1}
                  onSelectEpisode={(ep) => {
                    setCurrentEp(ep);
                    addToHistory(selectedAnime, currentSeason, ep, 10);
                  }}
                  onSelectSeason={(season) => {
                    setCurrentSeason(season);
                    setCurrentEp(1);
                  }}
                  watchedEpisodes={watchedEpisodes}
                />
              </div>
            </div>
          </div>
        )}

        {/* Featured Hero Spotlight (if not searching and no video selected) */}
        {!selectedAnime && !searchQuery && featuredHeroAnime && (
          <HeroBanner
            anime={featuredHeroAnime}
            onWatch={(anime) => handleStartWatching(anime, 1, 1)}
            isWatchlisted={watchlist.some((w) => w.slug === featuredHeroAnime.slug)}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}

        {/* Catalog Section Header & Category Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                <span>{searchQuery ? `Search: "${searchQuery}"` : "Discover & Stream Anime"}</span>
                <span className="text-xs bg-emerald-500/10 text-[#06C149] font-bold px-2 py-0.5 rounded-full border border-[#06C149]/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {animes.length} Streams Verified
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Real-time multi-server streaming • 780p / 1080p upscaled posters • Sub / Dub
              </p>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setSearchQuery("");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    activeCategory === tab.id && !searchQuery
                      ? "bg-[#06C149] text-black font-bold shadow-md shadow-[#06C149]/20"
                      : "bg-[#1f222a] text-gray-300 hover:text-white hover:bg-[#282c37]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Anime Feed Grid */}
        {isLoadingFeed ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-[#1f222a] rounded-2xl animate-pulse flex flex-col justify-end p-3 space-y-2 border border-white/5"
              >
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : feedError ? (
          <div className="bg-[#1f222a] rounded-3xl p-8 text-center space-y-3 border border-red-500/20 max-w-lg mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Stream Feed Alert</h3>
            <p className="text-xs text-gray-400">{feedError}</p>
            <button
              onClick={() => setCurrentPage(1)}
              className="mt-2 px-4 py-2 bg-[#06C149] text-black font-bold text-xs rounded-xl cursor-pointer"
            >
              Retry Stream Engine
            </button>
          </div>
        ) : animes.length === 0 ? (
          <div className="bg-[#1f222a] rounded-3xl p-12 text-center space-y-3 border border-white/5 max-w-md mx-auto my-12">
            <Search className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Verified Anime Found</h3>
            <p className="text-xs text-gray-400">
              No streams matching "{searchQuery}". Try searching for popular titles like Solo Leveling, Jujutsu Kaisen, or Demon Slayer.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-2 px-4 py-2 bg-[#06C149] text-black font-bold text-xs rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animes.map((anime) => (
              <AnimeCard
                key={anime.slug}
                anime={anime}
                onSelect={(selected) => handleStartWatching(selected, 1, 1)}
                onPlayDirect={(selected) => handleStartWatching(selected, 1, 1)}
                isWatchlisted={watchlist.some((w) => w.slug === anime.slug)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </div>
        )}
      </main>

      {/* Watchlist Modal */}
      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onPlayAnime={(item) => handleStartWatching(item, 1, 1)}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onClearWatchlist={() => setWatchlist([])}
      />

      {/* History Modal */}
      <WatchHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onResume={handleResumeHistory}
        onClearHistory={() => setHistory([])}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
