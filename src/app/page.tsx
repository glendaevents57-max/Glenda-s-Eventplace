import Link from "next/link";
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  CreditCard, 
  ArrowRight, 
  Award, 
  Shield, 
  Coffee, 
  UtensilsCrossed 
} from "lucide-react";
import VenueGallery from "@/components/VenueGallery";

export const metadata = {
  title: "Glenda Royale Events | Intimate Event Venue Batangas",
  description: "Curated experiences for your special day. Exclusive 4-hour venue access, customized grazing tables, and exquisite menu offerings in Batangas.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0b0b0c] text-zinc-100 flex flex-col overflow-hidden font-sans">
      {/* Dynamic Background Glow */}
      <div className="glow-bg" />

      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation / Header */}
      <header className="relative z-10 border-b border-zinc-900 bg-zinc-950/30 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-serif font-bold text-lg tracking-wider uppercase bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Glenda Royale Events
            </span>
          </div>
          <Link 
            href="/book"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-zinc-950 hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-400/5 active:scale-[0.98]"
          >
            Book Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-500/5 text-amber-400 text-xs font-bold mb-6 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Where Art Meets Taste
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-zinc-100 max-w-4xl leading-[1.1] mb-6">
          Curated Experiences for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 italic block sm:inline">Special Day</span>
        </h1>
        
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-10">
          Every celebration deserves a touch of elegance. At Glenda Royale Events, we create unforgettable experiences with a beautifully styled venue, exquisite grazing table, and exceptional food—perfectly curated to make your special moments truly memorable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link 
            href="/book"
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/10 active:scale-[0.98]"
          >
            Customize & Book Your Event <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#package-details"
            className="h-12 px-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-sm flex items-center justify-center transition-all"
          >
            Explore Inclusions
          </a>
        </div>
      </section>

      {/* Package Specs Grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm text-center flex flex-col items-center">
            <Users className="w-10 h-10 text-amber-400/80 mb-4" />
            <h3 className="font-bold text-zinc-200 mb-2">10–20 Guests</h3>
            <p className="text-xs text-zinc-500 leading-normal">
              Intimate and micro-events perfectly hosted in Batangas. Up to 30 max option available on request.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm text-center flex flex-col items-center">
            <Clock className="w-10 h-10 text-amber-400/80 mb-4" />
            <h3 className="font-bold text-zinc-200 mb-2">4-Hour Exclusive Access</h3>
            <p className="text-xs text-zinc-500 leading-normal">
              Enjoy complete, uninterrupted private access to the beautifully styled venue for your celebrations.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-sm text-center flex flex-col items-center">
            <CreditCard className="w-10 h-10 text-amber-400/80 mb-4" />
            <h3 className="font-bold text-zinc-200 mb-2">₱30,000 Flat Rate</h3>
            <p className="text-xs text-zinc-500 leading-normal">
              Base package covers full venue styling, custom grazing setup, refreshments, and savory appetizers.
            </p>
          </div>
        </div>
      </section>

      {/* Inclusions Detail Section */}
      <section id="package-details" className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100 mb-3">
            Premium Inclusions
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Everything you need for an elegant, stress-free intimate occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inclusion 1: Venue & Grazing */}
          <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-zinc-100">Elegant Styling & Venue</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enjoy exclusive access to our beautifully styled event venue. Includes a customizable grazing table set up according to your event's theme (e.g. Royal Gold, Rustic, Bohemian) filled with high-end appetizers, cheese selections, and fruits.
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-850 pt-4 flex gap-4 text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span>🏛️ Private Venue</span>
              <span>🧀 Grazing Setup</span>
            </div>
          </div>

          {/* Inclusion 2: Food & Drinks */}
          <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-zinc-100">Curated Culinary Bites</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Taste our savory favorites prepared for your special day. Includes our homemade signature Big Siomai, assorted sandwiches, and gourmet mini beef sliders, paired with complete refreshments like fresh fruit juices and hot coffee & tea.
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-850 pt-4 flex gap-4 text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span>🥪 Savory Menu</span>
              <span>🥤 Refreshments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Gallery Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100 mb-3">
            Explore Our Curated Venue
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Take a look at the styled elegance and details designed for your special day.
          </p>
        </div>
        <VenueGallery />
      </section>

      {/* Occasions Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full text-center">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100 mb-8">
          Perfect For All Intimate Celebrations
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "🎂 Birthdays",
            "👶 Baptisms",
            "💍 Bridal Showers",
            "🎉 Anniversaries",
            "👨‍👩‍👧 Family Gatherings",
            "🏢 Corporate Meetings",
            "🥂 Intimate Celebrations"
          ].map((tag) => (
            <span 
              key={tag} 
              className="px-4 py-2.5 rounded-full border border-zinc-800 bg-zinc-900/20 text-xs font-bold text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Payment Split & Rates */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-24 w-full">
        <div className="rounded-3xl border border-amber-400/10 bg-gradient-to-r from-zinc-900/60 to-zinc-950/60 p-8 md:p-12 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-amber-400/20 bg-amber-500/5 text-amber-400 text-[10px] font-bold tracking-widest uppercase">
                <Shield className="w-3 h-3" /> Booking Terms
              </span>
              <h3 className="text-2xl font-serif font-bold text-zinc-100">Flexible Rates & 50% Downpayment</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Standard packages start at **₱30,000**. Custom catering and decoration requirements are accommodated via our **Special Requests** tier starting at **₱45,000**. Secure your slot with a 50% downpayment; the remaining 50% balance is settled at the start of your scheduled event.
              </p>
            </div>
            
            <div className="md:col-span-4 text-center md:text-right border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center items-center md:items-end">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Package Rate</span>
              <span className="text-4xl font-extrabold text-amber-400 mb-1">₱30K</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">50/50 Payment Split</span>
            </div>
          </div>
        </div>
      </section>

      {/* Location and Contact */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
              Bookings & Inquiries
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Have questions or ready to coordinate your customized theme? Get in touch with our event administrator, Kyle Adrianna Sayas.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase">Kyle Adrianna Sayas</div>
                  <div className="text-sm font-bold text-zinc-200">0912 718 8479</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase">Location</div>
                  <div className="text-sm font-bold text-zinc-200">JCS BLDG., 2nd Floor Biga, San Jose, Rosario, Batangas</div>
                  <div className="text-xs text-zinc-500">📌 In front of City Hardware</div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-64 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 flex flex-col justify-center items-center text-center">
            <MapPin className="w-12 h-12 text-amber-400/80 mb-4" />
            <h3 className="font-serif font-bold text-zinc-200 mb-2">Visit Batangas Premiere Events Place</h3>
            <p className="text-xs text-zinc-500 leading-normal max-w-xs mb-4">
              Conveniently located on the 2nd Floor of the JCS Building in Rosario, Batangas.
            </p>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/5 border border-amber-400/20 px-3 py-1 rounded-full">
              Rosario, Batangas
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-950 bg-zinc-950/40 text-center relative z-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600 tracking-wider">
            © {new Date().getFullYear()} Glenda Royale Events • batBatangas
          </p>
          <div className="flex gap-4">
            <Link 
              href="/admin/login" 
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-widest font-bold"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
