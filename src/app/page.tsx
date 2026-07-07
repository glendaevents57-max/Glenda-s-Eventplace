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
  UtensilsCrossed,
  Building2,
  Coffee,
  Utensils
} from "lucide-react";
import VenueGallery from "@/components/VenueGallery";
import MenuShowcase from "@/components/MenuShowcase";

export const metadata = {
  title: "Glenda Royale Events | Intimate Event Venue Batangas",
  description: "Curated experiences for your special day. Exclusive 4-hour venue access, customized grazing tables, and exquisite menu offerings in Batangas.",
};

const OCCASIONS = [
  {
    name: "Birthdays",
    image: "/images/occasions/birthday.png",
    description: "Celebrate milestones with styled tables, sophisticated cakes, and warm lighting.",
  },
  {
    name: "Baptisms",
    image: "/images/occasions/baptism.png",
    description: "Welcome new blessings with elegant white and gold styling and pastel accents.",
  },
  {
    name: "Bridal Showers",
    image: "/images/occasions/bridal_shower.png",
    description: "Chic celebrations with stunning floral arrangements and fine tableware.",
  },
  {
    name: "Anniversaries",
    image: "/images/occasions/anniversary.png",
    description: "Celebrate enduring milestones in a romantic, candlelit, gold-styled setting.",
  },
  {
    name: "Family Gatherings",
    image: "/images/occasions/family_gathering.png",
    description: "Share warmth and laughter over gourmet menus in a cozy private space.",
  },
  {
    name: "Corporate Meetings",
    image: "/images/occasions/corporate_event.png",
    description: "Sleek, distraction-free environment with custom refreshment stations.",
  },
  {
    name: "Intimate Celebrations",
    image: "/images/occasions/intimate_celebration.png",
    description: "Any special milestone styled with customized grazing layouts and detail.",
  }
];

export default function Home() {
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
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-400/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-300/4 rounded-full blur-[140px] pointer-events-none" />

      {/* Sticky Premium Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-amber-500/20 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-6 py-4 shadow-md shadow-amber-500/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-shrink-1">
            <Sparkles className="w-5 h-5 text-zinc-950 flex-shrink-0" />
            <span className="font-serif font-bold text-sm sm:text-lg tracking-wider uppercase text-zinc-950 truncate">
              Glenda Royale Events
            </span>
          </div>

          {/* Navigation Links - Hidden on Mobile */}
          <nav className="hidden sm:flex items-center gap-6 flex-shrink-0">
            <a 
              href="#venue-gallery" 
              className="text-xs font-bold uppercase tracking-widest text-zinc-900 hover:text-zinc-950 transition-all border-b border-transparent hover:border-zinc-950 pb-0.5"
            >
              Venue
            </a>
            <a 
              href="#food-menu" 
              className="text-xs font-bold uppercase tracking-widest text-zinc-900 hover:text-zinc-950 transition-all border-b border-transparent hover:border-zinc-950 pb-0.5"
            >
              Food
            </a>
          </nav>

          <Link 
            href="/book"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold bg-zinc-950 text-amber-300 hover:bg-zinc-900 hover:text-amber-200 transition-all flex items-center gap-1.5 shadow-md shadow-zinc-950/20 active:scale-[0.98] uppercase tracking-wider flex-shrink-0"
          >
            Book Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Immersive Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-600 text-xs font-bold mb-6 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Where Art Meets Taste
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-zinc-950 max-w-4xl leading-[1.15] mb-6">
          Curated Experiences for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 italic block sm:inline">Special Day</span>
        </h1>
        
        <p className="text-zinc-650 text-base sm:text-lg leading-relaxed mb-10 font-medium max-w-2xl">
          Every celebration deserves a touch of elegance. At Glenda Royale Events, we create unforgettable experiences with a beautifully styled venue, exquisite grazing table, and exceptional food—perfectly curated to make your special moments truly memorable.
        </p>

        <div className="flex justify-center w-full max-w-md">
          <a
            href="#package-details"
            className="h-12 px-8 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/15 active:scale-[0.98] uppercase tracking-wider animate-bounce-subtle"
          >
            Explore Inclusions <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Premium Gold Star Divider */}
      <div className="flex items-center justify-center gap-4 mb-20 max-w-md mx-auto px-6">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-amber-400/40" />
        <Sparkles className="w-4 h-4 text-amber-500" />
        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-amber-400/40" />
      </div>

      {/* Package Specs Grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-200 border-t-2 border-t-amber-400 bg-white p-6 shadow-sm text-center flex flex-col items-center hover:border-amber-400/40 hover:shadow-md transition-all duration-300">
            <Users className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="font-serif font-bold text-zinc-950 text-lg mb-2">10–20 Guests</h3>
            <p className="text-xs text-zinc-650 leading-normal">
              Intimate and micro-events perfectly hosted in Batangas. Up to 30 max option available on request.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 border-t-2 border-t-amber-400 bg-white p-6 shadow-sm text-center flex flex-col items-center hover:border-amber-400/40 hover:shadow-md transition-all duration-300">
            <Clock className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="font-serif font-bold text-zinc-950 text-lg mb-2">4-Hour Exclusive Access</h3>
            <p className="text-xs text-zinc-650 leading-normal">
              Enjoy complete, uninterrupted private access to the beautifully styled venue for your celebrations.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 border-t-2 border-t-amber-400 bg-white p-6 shadow-sm text-center flex flex-col items-center hover:border-amber-400/40 hover:shadow-md transition-all duration-300">
            <CreditCard className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="font-serif font-bold text-zinc-950 text-lg mb-2">₱30,000 Flat Rate</h3>
            <p className="text-xs text-zinc-650 leading-normal">
              Base package covers full venue styling, custom grazing setup, refreshments, and savory appetizers.
            </p>
          </div>
        </div>
      </section>

      {/* Inclusions Detail Section */}
      <section id="package-details" className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 mb-3">
            Premium Inclusions
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Everything you need for an elegant, stress-free intimate occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inclusion 1: Venue & Grazing */}
          <div className="p-8 rounded-3xl border border-zinc-200 border-t-2 border-t-amber-400 bg-white shadow-sm flex flex-col justify-between hover:border-amber-400/40 hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-600">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-zinc-950">Elegant Styling & Venue</h3>
              <p className="text-xs text-zinc-650 leading-relaxed">
                Enjoy exclusive access to our beautifully styled event venue. Includes a customizable grazing table set up according to your event&apos;s theme (e.g. Royal Gold, Rustic, Bohemian) filled with high-end appetizers, cheese selections, and fruits.
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-100 pt-4 flex flex-wrap gap-4 text-xs text-amber-600 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Private Venue
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Grazing Setup
              </span>
            </div>
          </div>

          {/* Inclusion 2: Food & Drinks */}
          <div className="p-8 rounded-3xl border border-zinc-200 border-t-2 border-t-amber-400 bg-white shadow-sm flex flex-col justify-between hover:border-amber-400/40 hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-600">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-zinc-950">Curated Culinary Bites</h3>
              <p className="text-xs text-zinc-650 leading-relaxed">
                Taste our gourmet menu selections curated for your special day. Includes your custom selections of premium platters & boards, savory appetizers, and exquisite desserts, paired with complete refreshments.
              </p>
            </div>
            <div className="mt-6 border-t border-zinc-100 pt-4 flex flex-wrap gap-4 text-xs text-amber-600 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" /> Gourmet Menu
              </span>
              <span className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5" /> Refreshments
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Gourmet Menu Showcase Section */}
      <section id="food-menu" className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 mb-3">
            Our Gourmet Menu Showcase
          </h2>
          <p className="text-sm text-zinc-550 max-w-md mx-auto">
            Explore our premium selection. Customize your refreshments, grazing boards, savory bites, and sweet desserts during booking.
          </p>
        </div>
        <MenuShowcase />
      </section>

      {/* Premium Gold Star Divider */}
      <div className="flex items-center justify-center gap-4 mb-20 max-w-md mx-auto px-6">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-amber-400/40" />
        <Sparkles className="w-4 h-4 text-amber-500" />
        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-amber-400/40" />
      </div>

      {/* Venue Gallery Section */}
      <section id="venue-gallery" className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 mb-3">
            Explore Our Curated Venue
          </h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Take a look at the styled elegance and details designed for your special day.
          </p>
        </div>
        <VenueGallery />
      </section>

      {/* Occasions Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-24 w-full text-center">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950 mb-3">
          Perfect For All Intimate Celebrations
        </h2>
        <p className="text-sm text-zinc-550 max-w-md mx-auto mb-12">
          Whatever you are celebrating, we tailor our styled space and menu to suit your milestones.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {OCCASIONS.map((occ) => (
            <div 
              key={occ.name}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-xl hover:border-amber-400/40 transition-all duration-500 flex flex-col h-80 text-left"
            >
              {/* Background Image Container */}
              <div className="relative w-full h-44 overflow-hidden bg-zinc-100">
                <img 
                  src={occ.image} 
                  alt={occ.name}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
              </div>
              
              {/* Content Details */}
              <div className="p-5 flex-grow flex flex-col justify-between bg-white relative z-10 -mt-6 rounded-t-3xl border-t border-zinc-100">
                <div>
                  <h3 className="text-base font-serif font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                    {occ.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed font-medium">
                    {occ.description}
                  </p>
                </div>
                <div className="text-[9px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1 group-hover:gap-1.5 transition-all mt-4">
                  Learn more <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Split & Rates */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-24 w-full">
        <div className="rounded-3xl border border-zinc-250 border-l-4 border-l-amber-500 bg-white p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-600 text-[10px] font-bold tracking-widest uppercase">
                <Shield className="w-3 h-3" /> Booking Terms
              </span>
              <h3 className="text-2xl font-serif font-bold text-zinc-950">Flexible Rates & 50% Downpayment</h3>
              <p className="text-xs text-zinc-650 leading-relaxed">
                Standard packages start at **₱30,000**. Custom catering and decoration requirements are accommodated via our **Special Requests** tier starting at **₱45,000**. Secure your slot with a 50% downpayment or full payment options; the remaining balance is settled at the start of your scheduled event.
              </p>
            </div>
            
            <div className="md:col-span-4 text-center md:text-right border-t md:border-t-0 md:border-l border-zinc-200 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center items-center md:items-end">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Package Rate</span>
              <span className="text-5xl font-extrabold font-serif text-amber-500 mb-1">₱30K</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Flexible Payment Plans</span>
            </div>
          </div>
        </div>
      </section>

      {/* Location and Contact */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950">
              Bookings & Inquiries
            </h2>
            <p className="text-xs text-zinc-650 leading-relaxed">
              Have questions or ready to coordinate your customized theme? Get in touch with our event administrators, Kyle Adrianna Sayas or Glenda.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase">Kyle Adrianna Sayas</div>
                    <div className="text-sm font-bold text-zinc-900">0912 718 8479</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase">Glenda</div>
                    <div className="text-sm font-bold text-zinc-900">+1 914 329 0506</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase">Location</div>
                  <div className="text-sm font-bold text-zinc-900">JCS BLDG., 2nd Floor Biga, San Jose, Rosario, Batangas</div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> In front of City Hardware
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-72 rounded-3xl border border-zinc-200 overflow-hidden relative group shadow-sm bg-white hover:border-amber-400/35 transition-all duration-300">
            <iframe
              src="https://maps.google.com/maps?q=13.8444128,121.2321281&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
            {/* Overlay link to open in Google Maps App */}
            <a
              href="https://maps.app.goo.gl/U8PXLKRzpVZLBH6h6"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-zinc-950 text-white border border-zinc-800 text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl hover:bg-amber-400 hover:text-zinc-950 transition-all flex items-center gap-1 shadow-md"
            >
              Open in Maps App ↗
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200 bg-zinc-150 text-center relative z-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500 tracking-wider">
            © {new Date().getFullYear()} Glenda Royale Events Batangas • Batangas
          </p>
          <div className="flex gap-4">
            <Link 
              href="/admin/login" 
              className="text-xs text-zinc-650 hover:text-amber-600 transition-colors uppercase tracking-widest font-bold"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
