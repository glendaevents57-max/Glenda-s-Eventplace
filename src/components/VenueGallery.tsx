"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryImage {
  src: string;
  title: string;
  tag: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/images/v1.jpg", title: "✨ Glenda Royale Events Venue", tag: "Exclusive Venue" },
  { src: "/images/v2.jpg", title: "🧀 Customized Grazing Table Selection", tag: "Grazing Table" },
  { src: "/images/v3.jpg", title: "🥂 Elegant Gold & White Styling Theme", tag: "Styling & Decor" },
  { src: "/images/v4.jpg", title: "🧁 Delicious Dessert & Pastry Selection", tag: "Sweet Bites" },
  { src: "/images/v5.jpg", title: "🏛️ Private Intimate Gathering Space", tag: "Private Space" },
  { src: "/images/v6.jpg", title: "🌸 Floral Accents & Venue Details", tag: "Styling & Decor" },
  { src: "/images/v7.jpg", title: "🍽️ Premium Dining Table Setting", tag: "Table Setting" },
  { src: "/images/v8.jpg", title: "🥪 Savory Signature Siomai & Sliders", tag: "Savory Bites" },
  { src: "/images/v9.jpg", title: "☕ Hot Coffee, Tea & Juice Station", tag: "Refreshments" },
  { src: "/images/v10.jpg", title: "🎉 Unforgettable Celebration Moments", tag: "Celebration" },
];

export default function VenueGallery() {
  const [index, setIndex] = useState<number | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === null) return;
    setIndex((index - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === null) return;
    setIndex((index + 1) % GALLERY_IMAGES.length);
  };

  return (
    <div className="space-y-8">
      {/* Premium Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
        {/* Main large featured image */}
        <div 
          onClick={() => setIndex(0)}
          className="md:col-span-6 md:row-span-2 group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 cursor-pointer aspect-[4/3] sm:aspect-auto sm:h-[450px]"
        >
          <img 
            src={GALLERY_IMAGES[0].src} 
            alt={GALLERY_IMAGES[0].title}
            className="w-full h-full object-cover transition-all duration-750 ease-out group-hover:scale-[1.03] group-hover:brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute top-4 left-4 bg-amber-400/90 text-zinc-950 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            {GALLERY_IMAGES[0].tag}
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <h4 className="text-lg font-serif font-bold text-zinc-100 group-hover:text-amber-300 transition-colors flex items-center gap-2">
              {GALLERY_IMAGES[0].title}
            </h4>
            <p className="text-xs text-zinc-400 mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Click to view full screen gallery
            </p>
          </div>
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-950/60 border border-zinc-800 flex items-center justify-center text-zinc-300 opacity-0 group-hover:opacity-100 transition-all">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>

        {/* Next 4 grid items */}
        <div className="md:col-span-6 grid grid-cols-2 gap-4">
          {GALLERY_IMAGES.slice(1, 5).map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setIndex(idx + 1)}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 cursor-pointer aspect-square"
            >
              <img 
                src={img.src} 
                alt={img.title}
                className="w-full h-full object-cover transition-all duration-750 ease-out group-hover:scale-[1.03] group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-40 group-hover:opacity-75 transition-opacity" />
              <div className="absolute top-3 left-3 bg-zinc-950/80 border border-zinc-850 text-amber-400 text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full">
                {img.tag}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-xs font-bold text-zinc-100 group-hover:text-amber-300 transition-colors truncate">
                  {img.title}
                </h4>
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-zinc-950/60 border border-zinc-800 flex items-center justify-center text-zinc-300 opacity-0 group-hover:opacity-100 transition-all">
                <Maximize2 className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show more text link */}
      <div className="flex justify-center">
        <button 
          onClick={() => setIndex(0)}
          className="px-6 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-850 hover:text-amber-400 hover:border-amber-400/30 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
        >
          View All Venue Photos ({GALLERY_IMAGES.length})
        </button>
      </div>

      {/* Luxury Lightbox Modal */}
      {index !== null && (
        <div 
          onClick={() => setIndex(null)}
          className="fixed inset-0 z-50 flex flex-col justify-between p-4 bg-zinc-950/95 backdrop-blur-md transition-all animate-in fade-in duration-300"
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center max-w-6xl mx-auto w-full py-2 z-10">
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase font-mono">
              Photo {index + 1} of {GALLERY_IMAGES.length}
            </span>
            <button 
              onClick={() => setIndex(null)}
              className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-50 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="relative flex items-center justify-center flex-grow max-w-5xl mx-auto w-full my-4">
            {/* Prev Button */}
            <button 
              onClick={handlePrev}
              className="absolute left-0 sm:left-4 z-10 w-12 h-12 rounded-full border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/80 text-zinc-300 hover:text-zinc-50 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Selected Image */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="max-h-[70vh] max-w-full rounded-2xl overflow-hidden border border-zinc-850 shadow-2xl relative select-none animate-in zoom-in-95 duration-300"
            >
              <img 
                src={GALLERY_IMAGES[index].src} 
                alt={GALLERY_IMAGES[index].title} 
                className="max-h-[70vh] w-auto max-w-full object-contain mx-auto"
              />
              <div className="absolute top-4 left-4 bg-amber-400 text-zinc-950 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                {GALLERY_IMAGES[index].tag}
              </div>
            </div>

            {/* Next Button */}
            <button 
              onClick={handleNext}
              className="absolute right-0 sm:right-4 z-10 w-12 h-12 rounded-full border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/80 text-zinc-300 hover:text-zinc-50 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div className="max-w-xl mx-auto w-full text-center pb-4 z-10" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif font-bold text-zinc-100 text-lg sm:text-xl md:text-2xl mb-1">
              {GALLERY_IMAGES[index].title}
            </h3>
            <p className="text-xs text-zinc-400">
              Glenda Royale Events Batangas • Intimate Experience Package
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
