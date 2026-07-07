import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import BookingWizard from "@/components/BookingWizard";

export const metadata = {
  title: "Book Your Experience | Glenda Royale Events",
  description: "Secure your exclusive date, customize your theme, and select your curated menu.",
};

export default function BookPage() {
  return (
    <div 
      className="relative min-h-screen bg-zinc-100 text-zinc-950 flex flex-col overflow-hidden font-sans"
      style={{ 
        backgroundImage: "url('/images/luxury_bg.png')", 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundAttachment: "fixed" 
      }}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-amber-400/5 to-transparent pointer-events-none blur-3xl" />
      
      {/* Header / Navbar */}
      <header className="relative z-10 border-b border-amber-500/20 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-6 py-4 shadow-md shadow-amber-500/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="group flex items-center gap-2 text-xs font-bold text-zinc-900 hover:text-zinc-950 transition-all uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-zinc-900" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 min-w-0 flex-shrink-1">
            <Sparkles className="w-4 h-4 text-zinc-950 flex-shrink-0" />
            <span className="font-serif font-bold text-xs sm:text-sm tracking-wider uppercase text-zinc-950 truncate">
              Glenda Royale Events
            </span>
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10 w-full flex flex-col justify-center">
        <div className="text-center mb-10 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-600 text-xs font-bold mb-3 tracking-wider uppercase">
            <Sparkles className="w-3 h-3" /> Intimate Event Booking
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-950 mb-3 tracking-tight">
            Reserve Your Celebration
          </h1>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Select a date, pick a style theme, customize your menu, and submit your reservation draft instantly.
          </p>
        </div>

        <BookingWizard />
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-200 bg-zinc-100/50 text-center relative z-10">
        <p className="text-xs text-zinc-500 tracking-wider">
          © {new Date().getFullYear()} Glenda Royale Events • Batangas
        </p>
      </footer>
    </div>
  );
}
