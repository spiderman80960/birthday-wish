/* Polaroid & Scrapbook Photo Frame with Support for Images, GIFs & Videos */

import { useState } from "react";
import { Sparkles, X, ZoomIn, Play, Film } from "lucide-react";

interface PhotoSlotProps {
  storageKey?: string;
  initialImage?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  slotLabel?: string;
  className?: string;
  aspect?: "portrait" | "square" | "landscape";
  tapePosition?: "top" | "top-left" | "top-right" | "cross";
  tiltDeg?: number;
  stickerText?: string;
  captionPrompt?: string;
}

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".mov") ||
    url.endsWith(".ogg") ||
    url.includes("video")
  );
}

export function PhotoSlot({
  initialImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
  slotLabel = "MEM ✦",
  className = "",
  aspect = "portrait",
  tapePosition = "top",
  tiltDeg = 0,
  stickerText,
  captionPrompt = "Pure sunshine and happiness",
}: PhotoSlotProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const isVideo = isVideoUrl(initialImage);
  const aspectClass =
    aspect === "square" ? "aspect-square" : aspect === "landscape" ? "aspect-[4/3]" : "aspect-[3/4]";

  return (
    <>
      <div
        className={`polaroid-container relative group transition-transform duration-300 hover:z-20 ${className}`}
        style={{ transform: tiltDeg ? `rotate(${tiltDeg}deg)` : undefined }}
      >
        {/* Decorative Translucent Washi Tape */}
        {tapePosition === "top" && <span className="tape-strip center-tape" />}
        {tapePosition === "top-left" && <span className="tape-strip left-tape" />}
        {tapePosition === "top-right" && <span className="tape-strip right-tape" />}
        {tapePosition === "cross" && (
          <>
            <span className="tape-strip left-tape" />
            <span className="tape-strip right-tape" />
          </>
        )}

        {/* Polaroid Outer Frame Box */}
        <div className="polaroid-card bg-[#fffefc] dark:bg-[#1a0f2e] p-3.5 pb-4 rounded-xl border border-purple-200/60 dark:border-purple-500/30 shadow-[0_10px_25px_-5px_rgba(29,18,56,0.12),0_4px_10px_-4px_rgba(29,18,56,0.06)] dark:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.6),0_0_20px_rgba(121,82,232,0.18)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_36px_-8px_rgba(121,82,232,0.28)] flex flex-col justify-between">
          {/* Inner Image / Video Frame */}
          <div
            className={`relative overflow-hidden rounded-lg bg-[#241440]/10 dark:bg-[#10061e] border border-purple-300/40 dark:border-purple-700/40 flex flex-col items-center justify-center text-center ${aspectClass} transition-colors cursor-pointer shadow-inner`}
            onClick={() => setIsZoomed(true)}
          >
            {isVideo ? (
              <video
                src={initialImage}
                autoPlay
                loop
                muted
                playsInline
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              <img
                src={initialImage}
                alt="Birthday memory"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            )}

            {/* Protective transparent overlay to prevent right click / long press saving */}
            <div
              className="absolute inset-0 z-10"
              onContextMenu={(e) => e.preventDefault()}
            />

            {/* Hover overlay with zoom / play prompt */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
              <span className="px-3 py-1.5 bg-white/95 dark:bg-[#20113b]/95 text-[#1d1238] dark:text-[#f7f1ff] text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs border border-purple-200/50 dark:border-purple-600/50">
                {isVideo ? <Play size={12} className="fill-current text-[#7952e8]" /> : <ZoomIn size={12} className="text-[#7952e8]" />}
                {isVideo ? "Play video" : "Zoom photo"}
              </span>
            </div>

            {/* Label Stamp in Corner */}
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/65 backdrop-blur-md text-[8.5px] font-black uppercase tracking-widest text-white rounded-md pointer-events-none flex items-center gap-1 border border-white/20 shadow-sm">
              {isVideo && <Film size={10} className="text-[#fedc77]" />}
              {slotLabel}
            </span>
          </div>

          {/* Caption & Story Area (Only if captionPrompt is provided) */}
          {captionPrompt ? (
            <div className="mt-3 px-1">
              <p className="text-xs font-['Fraunces'] italic text-slate-800 dark:text-[#ede4ff] leading-relaxed select-text">
                “{captionPrompt}”
              </p>
            </div>
          ) : null}

          {/* Decorative Sticker Tag */}
          {stickerText && (
            <span className="card-tab absolute -bottom-3 -right-2 px-2.5 py-0.5 bg-[#fedc77] text-[#1d1238] font-black text-[9px] uppercase tracking-wider shadow-md rotate-[-4deg] pointer-events-none border border-[#1d1238]/20 rounded-sm">
              {stickerText}
            </span>
          )}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {isZoomed && initialImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-3xl max-h-[92vh] bg-[#fffefc] dark:bg-[#180d2d] p-5 rounded-2xl shadow-2xl border-2 border-[#7952e8]/60 flex flex-col items-center animate-in zoom-in-90 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-3.5 -right-3.5 w-8 h-8 bg-[#7952e8] hover:bg-[#673ee0] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
              aria-label="Close zoomed view"
            >
              <X size={18} />
            </button>
            {isVideo ? (
              <video
                src={initialImage}
                controls
                autoPlay
                playsInline
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-md select-none"
              />
            ) : (
              <div className="relative select-none" onContextMenu={(e) => e.preventDefault()}>
                <img
                  src={initialImage}
                  alt="Zoomed view"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md select-none pointer-events-none"
                />
                <div
                  className="absolute inset-0 z-10"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            )}
            {captionPrompt && (
              <div className="mt-4 px-4 py-2 bg-purple-50/70 dark:bg-[#23123f]/80 rounded-xl border border-purple-200/50 dark:border-purple-700/50 max-w-xl text-center">
                <p className="font-['Fraunces'] text-sm md:text-base text-slate-800 dark:text-[#f5edff] italic">
                  “{captionPrompt}”
                </p>
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#7952e8] dark:text-[#fedc77] font-bold uppercase tracking-widest mt-1">
                  <Sparkles size={11} /> {slotLabel}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
