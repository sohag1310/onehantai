export interface AnimeItem {
  mal_id: string;
  slug: string;
  title: string;
  title_english?: string;
  image: string;
  banner?: string;
  score: number;
  type: "TV" | "Movie" | string;
  year?: number;
  genres?: string[];
  status?: string;
  synopsis?: string;
  seasonsCount?: number;
  hasVideo?: boolean;
  firstEpUrl?: string;
  episodesCount?: number;
}

export interface EpisodeItem {
  id: number;
  episode: number;
  season: number;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: string;
}

export interface StreamServer {
  name: string;
  url: string;
}

export interface LanguageOption {
  code: string;
  name: string;
}

export interface SeriesDetail {
  success: boolean;
  slug: string;
  title: string;
  synopsis: string;
  season: number;
  lang: string;
  isMovie: boolean;
  banner?: string;
  image?: string;
  score?: number;
  genres?: string[];
  seasonsCount: number;
  episodesCount: number;
  episodes: EpisodeItem[];
}

export interface WatchHistoryItem {
  slug: string;
  title: string;
  image: string;
  season: number;
  episode: number;
  progressPercent: number;
  timestamp: number;
}
