"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Utensils, 
  User, 
  CreditCard, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertCircle, 
  Coffee, 
  Award,
  DollarSign
} from "lucide-react";

interface BookedSlot {
  date: string;
  slot: string;
  status: string;
}

interface BlockedSlot {
  date: string;
  slot: string;
  reason: string;
}

interface AvailabilityData {
  bookedSlots: BookedSlot[];
  blockedSlots: BlockedSlot[];
}

function toLocalYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ bookingId: string; expiryTime: string } | null>(null);

  // --- Step 1 States (Date & Time) ---
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<"morning" | "afternoon" | "evening" | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [availability, setAvailability] = useState<AvailabilityData>({ bookedSlots: [], blockedSlots: [] });

  // --- Step 2 States (Package & Theme) ---
  const [isSpecialRequest, setIsSpecialRequest] = useState(false);
  const [specialRequestDetails, setSpecialRequestDetails] = useState("");
  const [themeName, setThemeName] = useState("Royal Gold & White");
  const [themeDetails, setThemeDetails] = useState("");

  // --- Payment Plan ---
  const [paymentPlan, setPaymentPlan] = useState<"downpayment" | "full">("downpayment");

  // --- Step 3 States (Menu Selection & Upgrades) ---
  const [refreshmentChoices, setRefreshmentChoices] = useState<string[]>([
    "Fresh Fruit Juices",
    "Hot Coffee & Tea"
  ]);
  const [savoryChoices, setSavoryChoices] = useState<string[]>([
    "Homemade Signature Big Siomai",
    "Assorted Sandwiches",
    "Flavorful Mini Sliders"
  ]);
  const [upgrades, setUpgrades] = useState<string[]>([]);
  const [extraGuests, setExtraGuests] = useState(0); // 0 to 10 extra guests (on top of 20 max)

  // --- Step 4 States (Contact Info) ---
  const [bookersName, setBookersName] = useState("");
  const [bookersEmail, setBookersEmail] = useState("");
  const [bookersPhone, setBookersPhone] = useState("");
  const [eventType, setEventType] = useState("Birthday");
  const [visitorsCount, setVisitorsCount] = useState(15); // standard 10-20

  // Fetch availability for current month/year
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch(`/api/availability?year=${currentYear}&month=${currentMonth + 1}`);
        if (res.ok) {
          const data = await res.json();
          setAvailability(data);
        }
      } catch (err) {
        console.error("Failed to load availability:", err);
      }
    }
    fetchAvailability();
  }, [currentMonth, currentYear]);

  // Pricing constants
  const BASE_PRICE = 30000;
  const SPECIAL_REQUEST_PRICE = 45000;
  const GUEST_UPGRADE_PRICE_PER_HEAD = 1200;
  
  const UPGRADE_OPTIONS = [
    { id: "premium_grazing", name: "Premium Grazing Table Upgrade", price: 5000, description: "Includes imported cheeses, premium cold cuts, and fresh berries" },
    { id: "fondue_station", name: "Chocolate Fondue Fountain Station", price: 3500, description: "With strawberries, marshmallows, pretzels, and bananas" },
    { id: "extra_hour", name: "Extra Venue Access (1 Hour)", price: 2500, description: "Extend your event to 5 hours total" },
  ];

  // Dynamic price calculation
  const getPricing = () => {
    let packageBase = isSpecialRequest ? SPECIAL_REQUEST_PRICE : BASE_PRICE;
    let upgradesTotal = upgrades.reduce((acc, upgradeId) => {
      const upgrade = UPGRADE_OPTIONS.find((u) => u.id === upgradeId);
      return acc + (upgrade ? upgrade.price : 0);
    }, 0);
    
    // Guest upgrade
    let guestUpgradeCost = extraGuests * GUEST_UPGRADE_PRICE_PER_HEAD;
    
    const total = packageBase + upgradesTotal + guestUpgradeCost;
    const downpayment = paymentPlan === "downpayment" ? total * 0.5 : total;
    const remaining = paymentPlan === "downpayment" ? total * 0.5 : 0;

    return { total, downpayment, remaining, packageBase, upgradesTotal, guestUpgradeCost };
  };

  const pricing = getPricing();

  // Date and calendar helpers
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const isSlotBookedOrBlocked = (dateStr: string, slot: string) => {
    const isBooked = availability.bookedSlots.some(
      (s) => s.date === dateStr && s.slot === slot && s.status !== "cancelled"
    );
    const isBlocked = availability.blockedSlots.some(
      (s) => s.date === dateStr && (s.slot === slot || s.slot === "all_day")
    );
    return isBooked || isBlocked;
  };

  const getSlotDetails = (dateStr: string, slot: string) => {
    const blocked = availability.blockedSlots.find(
      (s) => s.date === dateStr && (s.slot === slot || s.slot === "all_day")
    );
    if (blocked) return `Blocked: ${blocked.reason || "Not available"}`;
    
    const booked = availability.bookedSlots.find(
      (s) => s.date === dateStr && s.slot === slot
    );
    if (booked) return `Booked: ${booked.status}`;
    
    return "Available";
  };

  const handleDateClick = (day: number) => {
    // Prevent selecting past dates
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (date < today) return;

    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleUpgrade = (id: string) => {
    if (upgrades.includes(id)) {
      setUpgrades(upgrades.filter((u) => u !== id));
    } else {
      setUpgrades([...upgrades, id]);
    }
  };

  // Submit flow
  const handleSubmitBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      setError("Please select a date and time slot.");
      return;
    }

    setLoading(true);
    setError(null);

    // Map slot to start hour
    let startHour = 9;
    if (selectedSlot === "afternoon") startHour = 14;
    else if (selectedSlot === "evening") startHour = 19;

    const eventDate = new Date(selectedDate);
    eventDate.setHours(startHour, 0, 0, 0);

    const payload = {
      bookers_name: bookersName,
      bookers_email: bookersEmail,
      bookers_phone_number: bookersPhone,
      event_type: eventType,
      event_date: eventDate.toISOString(),
      duration_minutes: upgrades.includes("extra_hour") ? 300 : 240, // 4 hours base, 5 if extra hour
      visitors_count: visitorsCount + extraGuests,
      theme_name: themeName,
      theme_details: themeDetails,
      custom_menu_selection: {
        refreshments: refreshmentChoices,
        savory: savoryChoices,
        upgrades: upgrades.map(u => UPGRADE_OPTIONS.find(op => op.id === u)?.name || ""),
      },
      is_special_request: isSpecialRequest,
      special_request_details: specialRequestDetails,
      total_price: pricing.total,
      downpayment_amount: pricing.downpayment,
      remaining_balance: pricing.remaining,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccessData({
          bookingId: data.bookingId,
          expiryTime: data.expiryTime,
        });
        setStep(6);
      } else {
        setError(data.message || "Failed to submit booking. Please check availability.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Validation before changing steps
  const validateStep = (nextStep: number) => {
    setError(null);
    if (step === 1 && nextStep > 1) {
      if (!selectedDate) {
        setError("Please pick an event date.");
        return;
      }
      if (!selectedSlot) {
        setError("Please choose a 4-hour event time slot.");
        return;
      }
    }
    if (step === 2 && nextStep > 2) {
      if (isSpecialRequest && !specialRequestDetails.trim()) {
        setError("Please specify details for your special request.");
        return;
      }
      if (!themeName.trim()) {
        setError("Please select or describe a theme.");
        return;
      }
    }
    if (step === 3 && nextStep > 3) {
      if (refreshmentChoices.length === 0 && savoryChoices.length === 0) {
        setError("Please pick at least one menu inclusion.");
        return;
      }
    }
    if (step === 4 && nextStep > 4) {
      if (!bookersName.trim()) {
        setError("Name is required.");
        return;
      }
      if (!bookersEmail.trim() || !bookersEmail.includes("@")) {
        setError("A valid email is required.");
        return;
      }
      if (!bookersPhone.trim()) {
        setError("Phone number is required.");
        return;
      }
    }
    setStep(nextStep);
  };

  // Month names
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calendar rendering helper arrays
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarCells = [];
  
  // Empty cells for alignment before first day of month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-zinc-200 bg-white p-6 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Wizard Indicators */}
      {step < 6 && (
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-550 uppercase tracking-widest mb-4">
            <span>Step {step} of 5</span>
            <span className="text-amber-600 font-serif lowercase italic">Glenda Royale Events</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 flex-grow rounded-full transition-all duration-300 ${
                  s <= step ? "bg-gradient-to-r from-amber-500 to-amber-300" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Date & Time Selector */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-serif font-bold text-zinc-950 flex items-center gap-2 mb-2">
            <CalendarIcon className="w-6 h-6 text-amber-600" />
            Select Event Date & Time
          </h2>
          <p className="text-sm text-zinc-650 mb-8 leading-relaxed">
            Exclusive 4-hour venue access. Choose your date below, then pick an available slot.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar Widget */}
            <div className="lg:col-span-7 bg-zinc-200/30 border border-zinc-250 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-serif font-bold text-zinc-900">
                  {months[currentMonth]} {currentYear}
                </h3>
                <div className="flex gap-1">
                  <button 
                    onClick={handlePrevMonth} 
                    className="p-2 rounded-lg border border-zinc-250 bg-zinc-50 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNextMonth} 
                    className="p-2 rounded-lg border border-zinc-250 bg-zinc-50 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-zinc-550 mb-2">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }

                  const dateObj = new Date(currentYear, currentMonth, day);
                  const dateStr = toLocalYMD(dateObj);
                  
                  // Disable past dates
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const isPast = dateObj < today;

                  const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear;

                  // Highlight days that have any booked or blocked slot
                  const morningTaken = isSlotBookedOrBlocked(dateStr, "morning");
                  const afternoonTaken = isSlotBookedOrBlocked(dateStr, "afternoon");
                  const eveningTaken = isSlotBookedOrBlocked(dateStr, "evening");
                  const allSlotsTaken = morningTaken && afternoonTaken && eveningTaken;
                  const someSlotsTaken = morningTaken || afternoonTaken || eveningTaken;

                  let cellClass = "aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all relative ";

                  if (isPast) {
                    cellClass += "text-zinc-700 cursor-not-allowed";
                  } else if (isSelected) {
                    cellClass += "bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 shadow-lg shadow-amber-500/10 cursor-pointer";
                  } else {
                    cellClass += "bg-zinc-100/40 border border-zinc-250/30 text-zinc-850 hover:bg-zinc-200/50 hover:text-zinc-950 cursor-pointer";
                  }

                  return (
                    <button
                      key={`day-${day}`}
                      disabled={isPast}
                      onClick={() => handleDateClick(day)}
                      className={cellClass}
                    >
                      <span>{day}</span>
                      {!isPast && !isSelected && someSlotsTaken && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${allSlotsTaken ? 'bg-rose-500' : 'bg-amber-400'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-900 mb-4">
                  {selectedDate ? formatSelectedDate() : "Choose a Date First"}
                </h3>

                {selectedDate ? (() => {
                  const selectedDateStr = toLocalYMD(selectedDate);
                  return (
                    <div className="space-y-3">
                      {/* Morning Slot */}
                      <button
                        disabled={isSlotBookedOrBlocked(selectedDateStr, "morning")}
                        onClick={() => setSelectedSlot("morning")}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedSlot === "morning"
                            ? "border-amber-400 bg-amber-500/5 text-amber-700 shadow-md shadow-amber-500/5"
                            : isSlotBookedOrBlocked(selectedDateStr, "morning")
                            ? "border-zinc-300 bg-zinc-200/60 text-zinc-400 cursor-not-allowed"
                            : "border-zinc-250 bg-zinc-100 text-zinc-850 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-500/80" />
                          <div>
                            <div className="font-bold text-sm">Morning Event</div>
                            <div className="text-xs text-zinc-550 mt-0.5">09:00 AM - 01:00 PM (4 Hrs)</div>
                          </div>
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-wider">
                          {getSlotDetails(selectedDateStr, "morning")}
                        </div>
                      </button>

                      {/* Afternoon Slot */}
                      <button
                        disabled={isSlotBookedOrBlocked(selectedDateStr, "afternoon")}
                        onClick={() => setSelectedSlot("afternoon")}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedSlot === "afternoon"
                            ? "border-amber-400 bg-amber-500/5 text-amber-700 shadow-md shadow-amber-500/5"
                            : isSlotBookedOrBlocked(selectedDateStr, "afternoon")
                            ? "border-zinc-300 bg-zinc-200/60 text-zinc-400 cursor-not-allowed"
                            : "border-zinc-250 bg-zinc-100 text-zinc-850 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-500/80" />
                          <div>
                            <div className="font-bold text-sm">Afternoon Event</div>
                            <div className="text-xs text-zinc-550 mt-0.5">02:00 PM - 06:00 PM (4 Hrs)</div>
                          </div>
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-wider">
                          {getSlotDetails(selectedDateStr, "afternoon")}
                        </div>
                      </button>

                      {/* Evening Slot */}
                      <button
                        disabled={isSlotBookedOrBlocked(selectedDateStr, "evening")}
                        onClick={() => setSelectedSlot("evening")}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedSlot === "evening"
                            ? "border-amber-400 bg-amber-500/5 text-amber-700 shadow-md shadow-amber-500/5"
                            : isSlotBookedOrBlocked(selectedDateStr, "evening")
                            ? "border-zinc-300 bg-zinc-200/60 text-zinc-400 cursor-not-allowed"
                            : "border-zinc-250 bg-zinc-100 text-zinc-850 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-500/80" />
                          <div>
                            <div className="font-bold text-sm">Evening Event</div>
                            <div className="text-xs text-zinc-550 mt-0.5">07:00 PM - 11:00 PM (4 Hrs)</div>
                          </div>
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-wider">
                          {getSlotDetails(selectedDateStr, "evening")}
                        </div>
                      </button>
                    </div>
                  );
                })() : (
                  <div className="border border-dashed border-zinc-250 rounded-xl p-8 text-center text-zinc-550 text-sm">
                    Please select a date on the calendar first to view available time slots.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Package & Theme Customizer */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-zinc-950 flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-amber-600" />
            Choose Package & Theme
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Package */}
            <button
              onClick={() => setIsSpecialRequest(false)}
              className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                !isSpecialRequest
                  ? "border-amber-400 bg-amber-500/5 text-zinc-900"
                  : "border-zinc-250 bg-zinc-100 text-zinc-650 hover:bg-zinc-100/40"
              }`}
            >
              {!isSpecialRequest && (
                <div className="absolute top-4 right-4 p-1 rounded-full bg-amber-400 text-zinc-950">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-amber-600 tracking-wider uppercase mb-1 block">Classic Royale</span>
                <h3 className="text-xl font-bold font-serif text-zinc-950 mb-2">Standard Package</h3>
                <p className="text-xs text-zinc-550 leading-relaxed mb-4">
                  Fully curated experience for 10-20 guests. Includes premium styled grazing table, refreshments, and 3 signature savory food options.
                </p>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-zinc-950">₱30,000</span>
                <span className="text-xs text-zinc-550 ml-1">Flat Rate</span>
              </div>
            </button>

            {/* Special Request Package */}
            <button
              onClick={() => setIsSpecialRequest(true)}
              className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                isSpecialRequest
                  ? "border-amber-400 bg-amber-500/5 text-zinc-900"
                  : "border-zinc-250 bg-zinc-100 text-zinc-650 hover:bg-zinc-100/40"
              }`}
            >
              {isSpecialRequest && (
                <div className="absolute top-4 right-4 p-1 rounded-full bg-amber-400 text-zinc-950">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-amber-600 tracking-wider uppercase mb-1 block">Bespoke Royale</span>
                <h3 className="text-xl font-bold font-serif text-zinc-950 mb-2">Special Request Package</h3>
                <p className="text-xs text-zinc-550 leading-relaxed mb-4">
                  For custom catering menu adjustments, themed events with custom layouts, custom floral backdrops, or dedicated catering requirements.
                </p>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-zinc-950">₱45,000</span>
                <span className="text-xs text-zinc-550 ml-1">Starting Rate</span>
              </div>
            </button>
          </div>

          {isSpecialRequest && (
            <div className="p-4 rounded-xl border border-zinc-250 bg-zinc-200/40 mt-4">
              <label className="block text-xs font-bold text-zinc-650 uppercase mb-2">Describe your Special Requests</label>
              <textarea
                value={specialRequestDetails}
                onChange={(e) => setSpecialRequestDetails(e.target.value)}
                placeholder="Please describe custom food options, decoration needs, or specific setups required..."
                rows={3}
                className="w-full bg-zinc-100 border border-zinc-250 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Theme Picker */}
          <div className="pt-4 border-t border-zinc-250/60">
            <h3 className="text-lg font-serif font-bold text-zinc-900 mb-4">Select Event Styling Theme</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Royal Gold & White",
                "Rustic Charm",
                "Bohemian Dreams",
                "Pastel Wonderland",
                "Corporate Minimalist",
                "Bespoke (Custom Theme)"
              ].map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setThemeName(theme)}
                  className={`p-3 text-xs font-bold rounded-xl border text-center transition-all ${
                    themeName === theme
                      ? "border-amber-400 bg-amber-500/5 text-amber-700"
                      : "border-zinc-200 bg-zinc-100/30 text-zinc-650 hover:border-zinc-750 hover:bg-zinc-50"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-zinc-650 uppercase mb-2">Theme Details & Colors (Optional)</label>
              <input
                type="text"
                value={themeDetails}
                onChange={(e) => setThemeDetails(e.target.value)}
                placeholder="E.g., Pastel blue & gold colors for a Baptism, rustic greens, fairy lights..."
                className="w-full bg-zinc-100 border border-zinc-250 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Inclusions & Upgrades */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-zinc-950 flex items-center gap-2 mb-2">
            <Utensils className="w-6 h-6 text-amber-600" />
            Curated Menu & Add-ons
          </h2>
          <p className="text-sm text-zinc-650 leading-relaxed mb-4">
            Customise your menu selections (included in package). Add premium upgrades below if desired.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Refreshments */}
            <div className="p-5 rounded-2xl border border-zinc-200 bg-white/30">
              <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Coffee className="w-4 h-4" /> Refreshment Inclusions
              </h3>
              <div className="space-y-3">
                {[
                  "Fresh Fruit Juices (Signature blend)",
                  "Hot Coffee & Tea Selection"
                ].map((item) => (
                  <label key={item} className="flex items-start gap-3 text-sm text-zinc-850 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={refreshmentChoices.some(c => item.startsWith(c.split(" (")[0]))}
                      onChange={(e) => {
                        const coreName = item.split(" (")[0];
                        if (e.target.checked) {
                          setRefreshmentChoices([...refreshmentChoices, coreName]);
                        } else {
                          setRefreshmentChoices(refreshmentChoices.filter(c => c !== coreName));
                        }
                      }}
                      className="mt-1 accent-amber-400 rounded"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Savory Favorites */}
            <div className="p-5 rounded-2xl border border-zinc-200 bg-white/30">
              <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Utensils className="w-4 h-4" /> Savory Favorites Inclusions
              </h3>
              <div className="space-y-3">
                {[
                  "Homemade Signature Big Siomai",
                  "Assorted Sandwiches (Tuna, Ham & Cheese)",
                  "Flavorful Mini Sliders (Gourmet Beef)"
                ].map((item) => (
                  <label key={item} className="flex items-start gap-3 text-sm text-zinc-850 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={savoryChoices.some(c => item.startsWith(c.split(" (")[0]))}
                      onChange={(e) => {
                        const coreName = item.split(" (")[0];
                        if (e.target.checked) {
                          setSavoryChoices([...savoryChoices, coreName]);
                        } else {
                          setSavoryChoices(savoryChoices.filter(c => c !== coreName));
                        }
                      }}
                      className="mt-1 accent-amber-400 rounded"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Upgrades */}
          <div className="pt-6 border-t border-zinc-250/60">
            <h3 className="text-lg font-serif font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" /> Premium Experience Upgrades (Optional)
            </h3>
            <div className="space-y-3">
              {UPGRADE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleUpgrade(opt.id)}
                  className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                    upgrades.includes(opt.id)
                      ? "border-amber-400 bg-amber-500/5 text-zinc-900"
                      : "border-zinc-200 bg-zinc-100/10 text-zinc-650 hover:bg-zinc-100/30"
                  }`}
                >
                  <div className="pr-4">
                    <div className="font-bold text-zinc-900 text-sm">{opt.name}</div>
                    <div className="text-xs text-zinc-550 mt-1">{opt.description}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-extrabold text-amber-600 text-sm">+₱{opt.price.toLocaleString()}</div>
                  </div>
                </button>
              ))}

              {/* Extra Guests Slider */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-100/10">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-bold text-zinc-900 text-sm">Additional Guests</div>
                    <div className="text-xs text-zinc-550">For events between 21 and 30 guests max</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-amber-600 text-sm">
                      {extraGuests > 0 ? `+₱${(extraGuests * GUEST_UPGRADE_PRICE_PER_HEAD).toLocaleString()}` : "Included"}
                    </div>
                    <div className="text-xs text-zinc-550">{extraGuests} extra guests</div>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={extraGuests}
                  onChange={(e) => setExtraGuests(parseInt(e.target.value))}
                  className="w-full accent-amber-400 bg-zinc-200 rounded-lg appearance-none h-1.5"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase mt-1">
                  <span>Up to 20 Guests (Included)</span>
                  <span>30 Guests Max</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Guest & Contact Info */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-zinc-950 flex items-center gap-2 mb-2">
            <User className="w-6 h-6 text-amber-600" />
            Contact & Guest Details
          </h2>
          <p className="text-sm text-zinc-650 mb-6">
            Enter your details so Kyle Adrianna Sayas can contact you regarding your celebration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-650 uppercase mb-2">Your Name</label>
              <input
                type="text"
                value={bookersName}
                onChange={(e) => setBookersName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-zinc-100 border border-zinc-250 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-zinc-650 uppercase mb-2">Phone Number</label>
              <input
                type="text"
                value={bookersPhone}
                onChange={(e) => setBookersPhone(e.target.value)}
                placeholder="E.g., 0912 718 8479"
                className="w-full bg-zinc-100 border border-zinc-250 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-650 uppercase mb-2">Email Address</label>
              <input
                type="email"
                value={bookersEmail}
                onChange={(e) => setBookersEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-100 border border-zinc-250 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase mb-2">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-zinc-100 border border-zinc-250 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Baptism">Baptism</option>
                  <option value="Bridal Shower">Bridal Shower</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Family Gathering">Family Gathering</option>
                  <option value="Corporate Meeting">Corporate Meeting</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-650 uppercase mb-2">Base Guests (10-20)</label>
                <input
                  type="number"
                  min="10"
                  max="20"
                  value={visitorsCount}
                  onChange={(e) => setVisitorsCount(Math.min(20, Math.max(10, parseInt(e.target.value) || 10)))}
                  className="w-full bg-zinc-100 border border-zinc-250 rounded-lg p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Cost Summary & Payment Terms */}
      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-zinc-950 flex items-center gap-2 mb-2">
            <CreditCard className="w-6 h-6 text-amber-600" />
            Review & Booking Terms
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-zinc-250 bg-white/30">
                <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3">Event Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-zinc-550">Date:</span><span className="text-zinc-900 font-bold">{formatSelectedDate()}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-550">Time Slot:</span><span className="text-zinc-900 font-bold capitalize">{selectedSlot} Event</span></div>
                  <div className="flex justify-between"><span className="text-zinc-550">Occasion:</span><span className="text-zinc-900 font-bold">{eventType}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-550">Guests:</span><span className="text-zinc-900 font-bold">{visitorsCount + extraGuests} Guests</span></div>
                  <div className="flex justify-between"><span className="text-zinc-550">Styling Theme:</span><span className="text-zinc-900 font-bold">{themeName}</span></div>
                </div>
              </div>

              {/* Payment Plan Options */}
              <div className="p-5 rounded-2xl border border-zinc-250 bg-white/30">
                <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3">Select Payment Option</h3>
                <div className="grid grid-cols-2 gap-3 mb-1">
                  <button
                    type="button"
                    onClick={() => setPaymentPlan("downpayment")}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center cursor-pointer ${
                      paymentPlan === "downpayment"
                        ? "border-amber-400 bg-amber-500/5 text-amber-700"
                        : "border-zinc-200 bg-zinc-100 text-zinc-650 hover:bg-zinc-100/40"
                    }`}
                  >
                    <span className="font-bold text-xs">50% Downpayment</span>
                    <span className="text-[10px] text-zinc-550 mt-1">₱{pricing.downpayment.toLocaleString()} now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPlan("full")}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-center items-center cursor-pointer ${
                      paymentPlan === "full"
                        ? "border-amber-400 bg-amber-500/5 text-amber-700"
                        : "border-zinc-200 bg-zinc-100 text-zinc-650 hover:bg-zinc-100/40"
                    }`}
                  >
                    <span className="font-bold text-xs">100% Full Payment</span>
                    <span className="text-[10px] text-zinc-550 mt-1">₱{pricing.total.toLocaleString()} now</span>
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-250 bg-white/30">
                <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3">Payment Terms Policy</h3>
                <p className="text-xs text-zinc-650 leading-relaxed">
                  {paymentPlan === "downpayment" ? (
                    "At Glenda Royale Events, a **50% downpayment** is required to secure your exclusive booking slot. Once submitted, your slot will be temporarily held for **2 hours** waiting for proof of downpayment. The remaining 50% balance must be settled at the start of your event."
                  ) : (
                    "You have selected **100% Full Payment** to secure your booking slot. Once submitted, your slot will be temporarily held for **2 hours** waiting for proof of payment. There will be no remaining balance due at the start of your event."
                  )}
                </p>
              </div>
            </div>

            {/* Dynamic Receipt Panel */}
            <div className="lg:col-span-5 bg-gradient-to-b from-zinc-50 to-zinc-100 border border-amber-400/20 rounded-2xl p-6 shadow-xl relative">
              <h3 className="font-serif font-bold text-zinc-900 text-lg mb-4 border-b border-zinc-250 pb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" /> Pricing Receipt
              </h3>
              
              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-550">Base Package</span>
                  <span className="text-zinc-850">₱{pricing.packageBase.toLocaleString()}</span>
                </div>
                {pricing.upgradesTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-550">Upgrades/Add-ons</span>
                    <span className="text-zinc-850">₱{pricing.upgradesTotal.toLocaleString()}</span>
                  </div>
                )}
                {pricing.guestUpgradeCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-550">Extra Guests ({extraGuests} head)</span>
                    <span className="text-zinc-850">+₱{pricing.guestUpgradeCost.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-zinc-900 border-t border-zinc-200 pt-3">
                  <span>Total Rate</span>
                  <span className="text-amber-600">₱{pricing.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-dashed border-zinc-250 pt-4">
                <div className="flex justify-between items-center bg-amber-400/5 border border-amber-400/10 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase block">
                      {paymentPlan === "downpayment" ? "50% Downpayment Due" : "Amount to Settle"}
                    </span>
                    <span className="text-xs text-zinc-650">To secure reservation</span>
                  </div>
                  <span className="text-lg font-extrabold text-amber-700">₱{pricing.downpayment.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-zinc-200">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-550 uppercase block">Remaining Balance</span>
                    <span className="text-xs text-zinc-550">Due at event start</span>
                  </div>
                  <span className="text-md font-bold text-zinc-650">₱{pricing.remaining.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Success Page */}
      {step === 6 && successData && (
        <div className="text-center py-8 space-y-6">
          <div className="inline-flex p-4 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-600 mb-2">
            <Sparkles className="w-12 h-12" />
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-zinc-950">Booking Draft Submitted!</h2>
          
          <p className="text-sm text-zinc-650 max-w-xl mx-auto leading-relaxed">
            Thank you, <strong className="text-zinc-900">{bookersName}</strong>! Your exclusive 4-hour reservation slot for the <strong className="text-zinc-900">{eventType}</strong> has been drafted. 
          </p>

          <div className="max-w-lg mx-auto bg-zinc-100 border border-zinc-250 rounded-2xl p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-250 pb-3 text-xs">
              <span className="text-zinc-550 uppercase font-bold tracking-wider">Booking ID:</span>
              <span className="font-mono text-amber-600 font-bold bg-zinc-100 px-2.5 py-1 rounded border border-zinc-250">{successData.bookingId}</span>
            </div>

            <div className="space-y-2 text-sm text-zinc-850">
              <div className="font-bold text-zinc-900 mb-1">
                {paymentPlan === "downpayment" ? "Downpayment instructions:" : "Payment instructions:"}
              </div>
              <p className="text-xs text-zinc-650 leading-normal">
                Please transfer the **{paymentPlan === "downpayment" ? "50% downpayment" : "100% full payment"} of ₱{pricing.downpayment.toLocaleString()}** to secure your date:
              </p>
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 space-y-1 font-mono text-xs">
                <div>Bank: **GCash / BPI**</div>
                <div>Account Name: **Kyle Adrianna Sayas**</div>
                <div>Account Number: **0912 718 8479**</div>
              </div>
              <p className="text-xs text-rose-400 font-bold mt-2">
                ⚠️ Hold Expiry: Settle and message proof of payment within 2 hours (before {new Date(successData.expiryTime).toLocaleTimeString()}) or the slot will be released.
              </p>
            </div>
          </div>

          <div className="pt-4 max-w-xs mx-auto">
            <button
              onClick={() => {
                setStep(1);
                setSelectedDate(null);
                setSelectedSlot(null);
                setUpgrades([]);
                setSuccessData(null);
                setBookersName("");
                setBookersEmail("");
                setBookersPhone("");
              }}
              className="w-full h-11 bg-zinc-200 hover:bg-zinc-300 text-zinc-850 font-bold rounded-xl text-sm transition-all uppercase tracking-wider"
            >
              Book Another Event
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      {step < 6 && (
        <div className="mt-10 pt-6 border-t border-zinc-250/60 flex justify-between">
          <button
            type="button"
            disabled={step === 1 || loading}
            onClick={() => validateStep(step - 1)}
            className="h-11 px-5 bg-zinc-100 border border-zinc-250 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900 font-bold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => validateStep(step + 1)}
              className="h-11 px-6 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmitBooking}
              className="h-11 px-8 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Booking & Hold Slot"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
