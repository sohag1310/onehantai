import React from "react";
import { Tv, ShieldCheck, Zap, Globe, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#14151b] border-t border-white/5 py-12 text-xs text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#06C149] flex items-center justify-center">
                <Tv className="w-4 h-4 text-black font-extrabold" />
              </div>
              <span className="text-base font-extrabold text-white">
                AniStream <span className="text-[#06C149]">HUB</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              High-speed anime and movie streaming engine with real-time multi-server failover, sub/dub audio switching, and anti-dead link pre-verification.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#06C149]" />
                Ad-filtered Streams
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#06C149]" />
                780p / 1080p Upscaling
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#06C149]" />
                Multi-Language
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-white tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#browse" className="hover:text-[#06C149] transition-colors">
                  Top Trending Anime
                </a>
              </li>
              <li>
                <a href="#action" className="hover:text-[#06C149] transition-colors">
                  Action & Shounen
                </a>
              </li>
              <li>
                <a href="#movies" className="hover:text-[#06C149] transition-colors">
                  Full Feature Movies
                </a>
              </li>
              <li>
                <a href="#new" className="hover:text-[#06C149] transition-colors">
                  Recently Verified
                </a>
              </li>
            </ul>
          </div>

          {/* Controls & shortcut guide */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-white tracking-wider">
              Hotkeys & Tips
            </h4>
            <ul className="space-y-1.5 text-[11px] text-gray-400">
              <li>
                <kbd className="bg-[#1f222a] px-1.5 py-0.5 rounded border border-white/10 text-gray-300 font-mono">
                  Space
                </kbd>{" "}
                Play / Pause stream
              </li>
              <li>
                <kbd className="bg-[#1f222a] px-1.5 py-0.5 rounded border border-white/10 text-gray-300 font-mono">
                  F
                </kbd>{" "}
                Toggle Fullscreen
              </li>
              <li>
                <kbd className="bg-[#1f222a] px-1.5 py-0.5 rounded border border-white/10 text-gray-300 font-mono">
                  C
                </kbd>{" "}
                Toggle Cinema mode
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>
            © {new Date().getFullYear()} AniStream Hub. Video contents are provided by third-party external servers.
          </p>
          <div className="flex items-center gap-1">
            <span>Crafted for high-speed anime lovers</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
