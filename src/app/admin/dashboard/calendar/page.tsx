"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Clock, 
  Sparkles,
  Info
} from "lucide-react";

interface BookedSlot {
  id: string;
  admin_id: number | null;
  bookers_name: string;
  bookers_email: string;
  bookers_phone_number: string;
  event_type: string;
  event_date: string;
  duration_minutes: number;
  visitors_count: number;
  status: string;
  payment_status: string;
  payment_date: string | null;
  theme_name: string;
  theme_details: string;
  custom_menu_selection: {
    refreshments: string[];
    savory: string[];
    platters?: string[];
    desserts?: string[];
    upgrades?: string[];
  };
  is_special_request: boolean;
  special_request_details: string;
  total_price: number;
  downpayment_amount: number;
  remaining_balance: number;
  created_at: string;
}

interface BlockedSlot {
  id: number;
  blocked_date: string;
  time_slot: string;
  reason: string;
}

function toLocalYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminCalendarManager() {
  const [bookings, setBookings] = useState<BookedSlot[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetailedBooking, setSelectedDetailedBooking] = useState<BookedSlot | null>(null);

  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Block slots form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("all_day");
  const [blockReason, setBlockReason] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch calendar data (both bookings & blocked slots)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch bookings
      const bookingsRes = await fetch("/api/admin/bookings");
      const bookingsData = await bookingsRes.json();
      
      // 2. Fetch blocked slots
      const blockedRes = await fetch("/api/admin/blocked-dates");
      const blockedData = await blockedRes.json();

      if (bookingsRes.ok && blockedRes.ok) {
        // Filter out cancelled bookings
        const activeBookings = (bookingsData.bookings || []).filter(
          (b: any) => b.status !== "cancelled"
        );
        setBookings(activeBookings);
        setBlockedSlots(blockedData.blockedSlots || []);
      } else {
        setError("Failed to retrieve dashboard schedule data.");
      }
    } catch (err) {
      setError("Connection error loading schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Block a slot
  const handleBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    setFormSubmitting(true);
    const dateString = toLocalYMD(selectedDate);

    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocked_date: dateString,
          time_slot: selectedSlot,
          reason: blockReason,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setBlockedSlots((prev) => [...prev, data.blockedSlot]);
        setBlockReason("");
        setSelectedDate(null);
      } else {
        alert(data.message || "Failed to block slot.");
      }
    } catch (err) {
      alert("A connection error occurred.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Unblock a slot
  const handleUnblockSlot = async (id: number) => {
    if (!confirm("Are you sure you want to unblock this date/slot?")) return;

    try {
      const res = await fetch(`/api/admin/blocked-dates?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setBlockedSlots((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(data.message || "Failed to unblock slot.");
      }
    } catch (err) {
      alert("A connection error occurred.");
    }
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
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

  // Get active items on a specific day
  const getItemsForDay = (day: number) => {
    const dateObj = new Date(currentYear, currentMonth, day);
    const dateStr = toLocalYMD(dateObj);

    const dayBookings = bookings.filter((b) => {
      const bDate = new Date(b.event_date);
      const bDateStr = toLocalYMD(bDate);
      return bDateStr === dateStr;
    });

    const dayBlocks = blockedSlots.filter((s) => s.blocked_date === dateStr);

    return { dayBookings, dayBlocks };
  };

  // Calendar rendering helpers
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarCells = [];

  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-zinc-950 mb-2">Event Schedule</h1>
        <p className="text-xs text-zinc-550 uppercase tracking-widest font-semibold">
          Check upcoming scheduled events and block/unblock blackout reservation slots.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid View */}
        <div className="lg:col-span-8 bg-zinc-200/60 border border-zinc-300 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif font-bold text-zinc-900">
              {months[currentMonth]} {currentYear}
            </h2>
            <div className="flex gap-1.5">
              <button 
                onClick={handlePrevMonth} 
                className="p-2 rounded-xl border border-zinc-250 bg-zinc-50 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextMonth} 
                className="p-2 rounded-xl border border-zinc-250 bg-zinc-50 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid day header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-zinc-550 mb-3 uppercase tracking-wider">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Grid cells */}
          {loading ? (
            <div className="h-96 flex items-center justify-center text-xs text-zinc-550 font-bold uppercase tracking-wider">
              Loading calendar schedules...
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="min-h-[100px] border border-transparent" />;
                }

                const { dayBookings, dayBlocks } = getItemsForDay(day);
                const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                    className={`min-h-[100px] p-2.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/5"
                        : "border-zinc-300 bg-zinc-200/60 hover:border-zinc-250 hover:bg-zinc-100/10"
                    }`}
                  >
                    <span className="font-bold text-xs text-zinc-650">{day}</span>
                    
                    {/* Event indicators on the day */}
                    <div className="space-y-1 mt-2">
                      {dayBookings.map((b) => (
                        <div 
                          key={b.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetailedBooking(b);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold truncate flex items-center gap-1 cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all ${
                            b.status === "confirmed" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" 
                              : "bg-amber-500/10 text-amber-300 border border-amber-500/10"
                          }`}
                        >
                          <Sparkles className="w-2.5 h-2.5 flex-shrink-0" />
                          <span>{b.bookers_name}</span>
                        </div>
                      ))}
                      {dayBlocks.map((s) => (
                        <div 
                          key={s.id} 
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/10 truncate flex items-center gap-1"
                        >
                          <Lock className="w-2.5 h-2.5 flex-shrink-0" />
                          <span>Blocked</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Day Actions & Block Form Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl border border-zinc-300 bg-zinc-200/60 shadow-xl backdrop-blur-md">
            <h3 className="text-md font-serif font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-500/70" /> Day Details
            </h3>

            {selectedDate ? (
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-zinc-550 uppercase">Selected Date</h4>
                  <div className="text-sm font-serif font-bold text-zinc-950 mt-1">{formatSelectedDate()}</div>
                </div>

                {/* Day Occupancy list */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-550 uppercase mb-2">Occupancy & Blockages</h4>
                  {(() => {
                    const dateStr = toLocalYMD(selectedDate);
                    const dayBookings = bookings.filter(b => toLocalYMD(new Date(b.event_date)) === dateStr);
                    const dayBlocks = blockedSlots.filter(s => s.blocked_date === dateStr);

                    if (dayBookings.length === 0 && dayBlocks.length === 0) {
                      return <p className="text-xs text-zinc-550 italic">This date is fully open and available.</p>;
                    }

                    return (
                      <div className="space-y-2">
                        {dayBookings.map((b) => {
                          const date = new Date(b.event_date);
                          const hours = date.getHours();
                          let slot = "Custom";
                          if (hours === 9) slot = "Morning";
                          else if (hours === 14) slot = "Afternoon";
                          else if (hours === 19) slot = "Evening";

                          return (
                            <div 
                              key={b.id} 
                              onClick={() => setSelectedDetailedBooking(b)}
                              className="p-3 rounded-xl bg-zinc-50 border border-zinc-250 text-xs cursor-pointer hover:border-amber-400/40 hover:shadow-sm transition-all duration-300"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-zinc-900 flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                  {b.bookers_name}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                  b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-300"
                                }`}>{b.status}</span>
                              </div>
                              <div className="text-[10px] text-zinc-550 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {slot} ({b.event_type})
                              </div>
                            </div>
                          );
                        })}

                        {dayBlocks.map((s) => (
                          <div key={s.id} className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs flex justify-between items-start">
                            <div>
                              <div className="font-bold text-rose-400 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5" /> Blocked ({s.time_slot})
                              </div>
                              {s.reason && <p className="text-[10px] text-zinc-650 mt-1">{s.reason}</p>}
                            </div>
                            <button
                              onClick={() => handleUnblockSlot(s.id)}
                              className="text-rose-400 hover:text-rose-300 font-bold hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Block date form */}
                <form onSubmit={handleBlockSlot} className="border-t border-zinc-300 pt-4 space-y-4">
                  <h4 className="text-xs font-bold text-zinc-550 uppercase">Block Out This Date</h4>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-550 uppercase mb-2">Select Slot to Block</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full bg-zinc-100 border border-zinc-250 rounded-lg p-2.5 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all_day">Block Whole Day (All Slots)</option>
                      <option value="morning">Block Morning (9 AM - 1 PM)</option>
                      <option value="afternoon">Block Afternoon (2 PM - 6 PM)</option>
                      <option value="evening">Block Evening (7 PM - 11 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-550 uppercase mb-2">Reason (Optional)</label>
                    <input
                      type="text"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="e.g. Venue maintenance, holiday"
                      className="w-full bg-zinc-100 border border-zinc-250 rounded-lg p-2.5 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full h-9 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded-lg transition-all shadow-md uppercase tracking-wider"
                  >
                    {formSubmitting ? "Blocking..." : "Apply Blackout Block"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="border border-dashed border-zinc-250 rounded-2xl p-8 text-center text-zinc-550 text-xs">
                Select any date on the calendar to view its schedules or apply a blackout block.
              </div>
            )}
          </div>

          {/* List of blocked dates overall */}
          <div className="p-6 rounded-3xl border border-zinc-300 bg-zinc-200/60 shadow-xl backdrop-blur-md max-h-[350px] overflow-y-auto">
            <h3 className="text-xs font-bold text-zinc-650 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-500/70" /> Active Blackout List
            </h3>
            {blockedSlots.length === 0 ? (
              <p className="text-xs text-zinc-550 italic">No blackout blocks active currently.</p>
            ) : (
              <div className="space-y-2">
                {blockedSlots.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl border border-zinc-300 bg-zinc-100 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-zinc-850">
                        {new Date(s.blocked_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <div className="text-[10px] text-zinc-550 capitalize mt-0.5">Slot: {s.time_slot}</div>
                      {s.reason && <div className="text-[9px] text-zinc-400 italic mt-0.5 truncate max-w-[150px]">{s.reason}</div>}
                    </div>
                    <button
                      onClick={() => handleUnblockSlot(s.id)}
                      className="text-[10px] font-bold text-rose-400 hover:underline cursor-pointer"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Booking Popout Modal */}
      {selectedDetailedBooking && (
        <div 
          onClick={() => setSelectedDetailedBooking(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden"
          >
            {/* Header decor band */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
            
            {/* Modal Title bar */}
            <div className="flex justify-between items-start pt-2">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-600 text-[10px] font-bold tracking-wider uppercase mb-2">
                  <Sparkles className="w-3 h-3" /> Event Details
                </span>
                <h3 className="text-xl font-serif font-bold text-zinc-950">
                  {selectedDetailedBooking.bookers_name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDetailedBooking(null)}
                className="w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-550 hover:text-zinc-800 transition-all cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content Details Grid */}
            <div className="space-y-4 text-xs text-zinc-650">
              <div className="grid grid-cols-2 gap-4 border-b border-zinc-150 pb-4">
                <div>
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Email</h4>
                  <p className="font-semibold text-zinc-900 truncate">{selectedDetailedBooking.bookers_email}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Phone</h4>
                  <p className="font-semibold text-zinc-900">{selectedDetailedBooking.bookers_phone_number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-zinc-150 pb-4">
                <div>
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Date & Time Slot</h4>
                  <p className="font-semibold text-zinc-900">
                    {(() => {
                      const d = new Date(selectedDetailedBooking.event_date);
                      const yr = d.getFullYear();
                      const mo = d.toLocaleDateString("en-US", { month: "short" });
                      const dy = d.getDate();
                      const hrs = d.getHours();
                      let tSlot = "Custom";
                      if (hrs === 9) tSlot = "Morning (9 AM - 1 PM)";
                      else if (hrs === 14) tSlot = "Afternoon (2 PM - 6 PM)";
                      else if (hrs === 19) tSlot = "Evening (7 PM - 11 PM)";
                      return `${mo} ${dy}, ${yr} • ${tSlot}`;
                    })()}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Event Type & Guests</h4>
                  <p className="font-semibold text-zinc-900">{selectedDetailedBooking.event_type} ({selectedDetailedBooking.visitors_count} Guests)</p>
                </div>
              </div>

              {/* Package & Theme Info */}
              <div className="border-b border-zinc-150 pb-4 space-y-2">
                <div>
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Selected Package</h4>
                  <p className="font-semibold text-zinc-900">
                    {selectedDetailedBooking.is_special_request 
                      ? "Bespoke Royale (Special Request Tier) - Starting ₱45,000" 
                      : "Intimate Experience (Base Tier) - ₱30,000"}
                  </p>
                  {selectedDetailedBooking.is_special_request && selectedDetailedBooking.special_request_details && (
                    <p className="text-[11px] text-zinc-500 italic mt-1 bg-zinc-50 p-2 rounded-lg border border-zinc-150">
                      &ldquo;{selectedDetailedBooking.special_request_details}&rdquo;
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Styling Theme</h4>
                  <p className="font-semibold text-zinc-900">{selectedDetailedBooking.theme_name || "Standard Styling"}</p>
                  {selectedDetailedBooking.theme_details && (
                    <p className="text-[10px] text-zinc-500 mt-0.5">Details: {selectedDetailedBooking.theme_details}</p>
                  )}
                </div>
              </div>

              {/* Menu & Upgrades Selection */}
              <div className="border-b border-zinc-150 pb-4 space-y-3">
                <div>
                  <h4 className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">Culinary Choices & Upgrades</h4>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="font-bold text-zinc-800 block mb-0.5">Refreshments:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-zinc-600">
                        {selectedDetailedBooking.custom_menu_selection?.refreshments?.length ? (
                          selectedDetailedBooking.custom_menu_selection.refreshments.map((r: string) => (
                            <li key={r}>{r}</li>
                          ))
                        ) : (
                          <li>None selected</li>
                        )}
                      </ul>
                    </div>
                    {selectedDetailedBooking.custom_menu_selection?.platters?.length ? (
                      <div>
                        <span className="font-bold text-zinc-800 block mb-0.5">Platters & Boards:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-zinc-600">
                          {selectedDetailedBooking.custom_menu_selection.platters.map((p: string) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div>
                      <span className="font-bold text-zinc-800 block mb-0.5">Savory Favorites:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-zinc-600">
                        {selectedDetailedBooking.custom_menu_selection?.savory?.length ? (
                          selectedDetailedBooking.custom_menu_selection.savory.map((s: string) => (
                            <li key={s}>{s}</li>
                          ))
                        ) : (
                          <li>None selected</li>
                        )}
                      </ul>
                    </div>
                    {selectedDetailedBooking.custom_menu_selection?.desserts?.length ? (
                      <div>
                        <span className="font-bold text-zinc-800 block mb-0.5">Sweet Desserts:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-zinc-600">
                          {selectedDetailedBooking.custom_menu_selection.desserts.map((d: string) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>

                {selectedDetailedBooking.custom_menu_selection?.upgrades?.length && (
                  <div>
                    <span className="font-bold text-[10px] text-zinc-800 block mb-1">Availment Upgrades:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDetailedBooking.custom_menu_selection.upgrades.map((u: string) => (
                        <span key={u} className="px-2 py-0.5 bg-amber-500/10 text-amber-800 font-bold rounded text-[10px] border border-amber-500/10">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-150 space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-500">Total Price:</span>
                  <span className="text-zinc-900 font-bold">₱{selectedDetailedBooking.total_price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-500">Downpayment Split (50%):</span>
                  <span className="text-zinc-900 font-bold">₱{selectedDetailedBooking.downpayment_amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium border-t border-zinc-200/80 pt-2 text-[13px]">
                  <span className="font-bold text-zinc-700">Remaining Balance:</span>
                  <span className="text-amber-600 font-extrabold">₱{selectedDetailedBooking.remaining_balance?.toLocaleString()}</span>
                </div>
              </div>

              {/* Status footer inside card */}
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400 pt-2">
                <div>Status: <span className={`px-2 py-0.5 rounded ml-1 ${selectedDetailedBooking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{selectedDetailedBooking.status}</span></div>
                <div>Payment: <span className={`px-2 py-0.5 rounded ml-1 ${selectedDetailedBooking.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>{selectedDetailedBooking.payment_status}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
