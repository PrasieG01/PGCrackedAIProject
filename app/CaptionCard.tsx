"use client";

import { useState } from "react";

interface CaptionCardProps {
  caption: any;
}

const ADJECTIVES = [
  "Based", "Cringe", "Salty", "Spicy", "Glazed", "Goofy", "Chad", "Simp",
  "Dank", "Unhinged", "Feral", "Tubular", "Radical", "Sussy", "Cheugy", "Cracked"
];
const NOUNS = [
  "Enjoyer", "Poster", "Goblin", "Wojak", "Zoomer", "Boomer", "NPC",
  "MainCharacter", "CEO", "Warrior", "Legend", "Potato", "Memelord", "Vibe"
];

export default function CaptionCard({ caption }: CaptionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Attempt to find the main text content from common column names, or fallback
  const text = caption.text || caption.caption || caption.content || caption.description || "No text content";

  // Generate a deterministic funky name based on the ID
  const idStr = String(caption.id || "anon");
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  const funkyName = `${ADJECTIVES[Math.abs(hash) % ADJECTIVES.length]} ${NOUNS[Math.abs(hash >> 2) % NOUNS.length]}`;

  return (
    <div className="h-96 w-full" style={{ perspective: "1000px" }}>
      <div
        className="relative h-full w-full transition-all duration-500 cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Face - Instagram Style */}
        <div
          className="absolute inset-0 h-full w-full rounded-xl bg-white shadow-lg flex flex-col border border-gray-200 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Header */}
          <div className="flex items-center p-3 border-b border-gray-100 bg-white">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-gray-500">
                  {caption.id ? String(caption.id).slice(0, 2) : "??"}
                </span>
              </div>
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {funkyName}
            </span>
            <span className="ml-auto text-gray-400">•••</span>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
            <p className="text-lg text-gray-800 font-medium text-center leading-relaxed font-serif">
              &ldquo;{text}&rdquo;
            </p>
          </div>

          {/* Actions Footer */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              {/* Heart Button */}
              <button className="hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 text-red-500"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </button>
              {/* Share Button */}
              <button className="cursor-default hover:opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7 text-gray-800"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm font-bold text-gray-900">{caption.like_count || caption.LIKE_COUNT || 0} likes</p>
            <p suppressHydrationWarning className="text-[10px] text-gray-400 uppercase mt-1">
              {caption.created_at
                ? new Date(caption.created_at).toLocaleDateString()
                : "Just now"}
            </p>
          </div>
        </div>

        {/* Back Face - Metadata */}
        <div
          className="absolute inset-0 h-full w-full rounded-xl bg-slate-900 p-6 text-slate-200 overflow-y-auto shadow-xl border border-slate-700"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3 className="text-lg font-bold mb-4 text-white border-b border-slate-700 pb-2">
            Raw Data
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {Object.entries(caption).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-slate-500 uppercase text-[10px] tracking-wider">
                  {key}
                </span>
                <span className="break-all text-slate-300">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}