"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  AlertCircle
} from "lucide-react";

interface Booking {
  id: string;
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
    upgrades?: string[];
  };
  is_special_request: boolean;
  special_request_details: string;
  total_price: number;
  downpayment_amount: number;
  remaining_balance: number;
  created_at: string;
}

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Modal detail state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch bookings function
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setBookings(data.bookings);
      } else {
        setError(data.message || "Failed to load bookings.");
      }
    } catch (err) {
      setError("Network error loading bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update status function
  const updateBookingStatus = async (id: string, status?: string, paymentStatus?: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, payment_status: paymentStatus }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        // Refresh local items
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: status || b.status,
                  payment_status: paymentStatus || b.payment_status,
                  payment_date: paymentStatus && paymentStatus !== "unpaid" ? new Date().toISOString() : b.payment_date,
                }
              : b
          )
        );
        // Refresh selected if open
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => prev ? {
            ...prev,
            status: status || prev.status,
            payment_status: paymentStatus || prev.payment_status,
          } : null);
        }
      } else {
        alert(data.message || "Failed to update booking status.");
      }
    } catch (err) {
      alert("A connection error occurred.");
    }
  };

  // Helper calculation
  const getStats = () => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    
    // Revenue counts paid downpayments + paid finals (excluding cancelled bookings)
    const revenue = bookings.reduce((sum, b) => {
      if (b.status === "cancelled") {
        return sum;
      }
      if (b.payment_status === "downpayment_paid") {
        return sum + b.downpayment_amount;
      } else if (b.payment_status === "fully_paid") {
        return sum + b.total_price;
      }
      return sum;
    }, 0);

    return { total, pending, confirmed, revenue };
  };

  const stats = getStats();

  // Search filter implementation
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.bookers_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookers_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookers_phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || b.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending Hold</span>;
      case "confirmed":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Confirmed</span>;
      case "completed":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">Completed</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400">{status}</span>;
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "unpaid":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Unpaid</span>;
      case "downpayment_paid":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">50% Paid</span>;
      case "fully_paid":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Fully Settled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-400">{paymentStatus}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-zinc-100 mb-2">Bookings Manager</h1>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
          Manage event schedules, payments, and customize reservation statuses.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Total Reservations</span>
            <div className="text-2xl font-serif font-bold text-zinc-100 mt-1">{stats.total}</div>
          </div>
          <FileText className="w-8 h-8 text-amber-500/40" />
        </div>

        {/* Stat 2 */}
        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Pending Draft Holds</span>
            <div className="text-2xl font-serif font-bold text-amber-400 mt-1">{stats.pending}</div>
          </div>
          <Clock className="w-8 h-8 text-amber-500/40" />
        </div>

        {/* Stat 3 */}
        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Confirmed Events</span>
            <div className="text-2xl font-serif font-bold text-emerald-400 mt-1">{stats.confirmed}</div>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500/40" />
        </div>

        {/* Stat 4 */}
        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Collected Revenue</span>
            <div className="text-2xl font-serif font-bold text-zinc-100 mt-1">
              ₱{stats.revenue.toLocaleString()}
            </div>
          </div>
          <DollarSign className="w-8 h-8 text-amber-500/40" />
        </div>
      </div>

      {/* Table section */}
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-md p-6 shadow-xl">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-bold uppercase">Filter:</span>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Hold</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="all">All Payments</option>
              <option value="unpaid">Unpaid</option>
              <option value="downpayment_paid">50% Downpayment Paid</option>
              <option value="fully_paid">Fully Paid</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-500 font-bold uppercase tracking-wider">
            Loading bookings data...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-rose-400 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-20 text-center text-xs text-zinc-500 font-bold uppercase tracking-wider">
            No bookings matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Booker</th>
                  <th className="py-4 px-4">Event Date / Slot</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Cost Breakdown</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredBookings.map((b) => (
                  <tr 
                    key={b.id} 
                    className="hover:bg-zinc-900/10 cursor-pointer"
                    onClick={() => setSelectedBooking(b)}
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-zinc-200">{b.bookers_name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{b.bookers_phone_number}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-zinc-300">{formatDate(b.event_date)}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{b.duration_minutes} mins duration</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-zinc-300">{b.event_type}</div>
                      <div className="text-[10px] text-amber-500 font-bold uppercase mt-0.5">{b.visitors_count} Guests</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-zinc-200">Total: ₱{b.total_price.toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Down: ₱{b.downpayment_amount.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(b.status)}</td>
                    <td className="py-4 px-4">{getPaymentBadge(b.payment_status)}</td>
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Action 1: Confirm Downpayment or Full Payment */}
                        {b.status === "pending" && b.payment_status === "unpaid" && (
                          <button
                            onClick={() => {
                              const nextPaymentStatus = (Number(b.remaining_balance) <= 0) ? "fully_paid" : "downpayment_paid";
                              updateBookingStatus(b.id, "confirmed", nextPaymentStatus);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase transition-all"
                          >
                            {Number(b.remaining_balance) <= 0 ? "Confirm Full Pay" : "Confirm Down"}
                          </button>
                        )}
                        
                        {/* Action 2: Confirm Settle Balance */}
                        {b.status === "confirmed" && b.payment_status === "downpayment_paid" && (
                          <button
                            onClick={() => updateBookingStatus(b.id, "confirmed", "fully_paid")}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[10px] uppercase transition-all"
                          >
                            Fully Paid
                          </button>
                        )}

                        {/* Action 3: Cancel */}
                        {b.status !== "cancelled" && b.status !== "completed" && (
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to cancel this booking?")) {
                                updateBookingStatus(b.id, "cancelled");
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-500 font-bold text-[10px] uppercase transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 font-bold text-sm uppercase"
            >
              Close
            </button>

            <h2 className="text-xl font-serif font-bold text-zinc-100 mb-6 border-b border-zinc-800 pb-3">
              Booking details
            </h2>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-zinc-500 uppercase font-bold tracking-wider">Booker Name</span>
                  <div className="text-sm font-bold text-zinc-200 mt-0.5">{selectedBooking.bookers_name}</div>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase font-bold tracking-wider">Contact Info</span>
                  <div className="text-zinc-200 mt-0.5">{selectedBooking.bookers_email}</div>
                  <div className="text-zinc-200 font-mono mt-0.5">{selectedBooking.bookers_phone_number}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-850">
                <div>
                  <span className="text-zinc-500 uppercase font-bold tracking-wider">Event Schedule</span>
                  <div className="text-zinc-200 font-bold mt-0.5">{formatDate(selectedBooking.event_date)}</div>
                  <div className="text-zinc-500 mt-0.5">Duration: {selectedBooking.duration_minutes} mins</div>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase font-bold tracking-wider">Occasion & Guests</span>
                  <div className="text-zinc-200 font-bold mt-0.5">{selectedBooking.event_type}</div>
                  <div className="text-zinc-400 mt-0.5">{selectedBooking.visitors_count} Guests</div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-850">
                <span className="text-zinc-500 uppercase font-bold tracking-wider">Theme details</span>
                <div className="text-zinc-200 font-bold mt-0.5">{selectedBooking.theme_name}</div>
                {selectedBooking.theme_details && (
                  <p className="text-zinc-400 mt-1 italic leading-relaxed bg-zinc-950 p-2.5 rounded border border-zinc-850">{selectedBooking.theme_details}</p>
                )}
              </div>

              {selectedBooking.is_special_request && (
                <div className="pt-3 border-t border-zinc-850 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <span className="text-amber-400 uppercase font-bold tracking-wider">Special Requests (₱45k Tier)</span>
                  <p className="text-zinc-300 mt-1 leading-normal">{selectedBooking.special_request_details}</p>
                </div>
              )}

              {/* Menu selections */}
              <div className="pt-3 border-t border-zinc-850">
                <span className="text-zinc-500 uppercase font-bold tracking-wider block mb-2">Curated Menu Selection</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-850">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1.5">Refreshments</div>
                    <ul className="space-y-1 list-disc list-inside text-zinc-400">
                      {selectedBooking.custom_menu_selection.refreshments.map(r => <li key={r}>{r}</li>)}
                    </ul>
                  </div>

                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-850">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1.5">Savory Favorites</div>
                    <ul className="space-y-1 list-disc list-inside text-zinc-400">
                      {selectedBooking.custom_menu_selection.savory.map(s => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                {selectedBooking.custom_menu_selection.upgrades && selectedBooking.custom_menu_selection.upgrades.filter(Boolean).length > 0 && (
                  <div className="mt-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-850">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1.5">Experience Upgrades</div>
                    <ul className="space-y-1 list-disc list-inside text-zinc-400">
                      {selectedBooking.custom_menu_selection.upgrades.filter(Boolean).map(u => <li key={u}>{u}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {/* Price receipt */}
              <div className="pt-4 border-t border-zinc-850">
                <div className="flex justify-between items-center bg-zinc-950 border border-zinc-850 p-3 rounded-xl mb-3">
                  <div>
                    <span className="text-zinc-500 uppercase font-bold tracking-wider block">Total price</span>
                    <span className="text-xs text-zinc-400">Full package + upgrade customisations</span>
                  </div>
                  <span className="text-md font-extrabold text-amber-400">₱{selectedBooking.total_price.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px] text-zinc-500 font-bold uppercase">
                  <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-850 text-center">
                    <span>{Number(selectedBooking.remaining_balance) <= 0 ? "Full Payment Amount" : "50% Downpayment"}</span>
                    <div className="text-zinc-200 text-xs font-extrabold mt-1">₱{selectedBooking.downpayment_amount.toLocaleString()}</div>
                  </div>
                  <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-850 text-center">
                    <span>Remaining Balance</span>
                    <div className="text-zinc-200 text-xs font-extrabold mt-1">₱{selectedBooking.remaining_balance.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick status actions in details modal */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end gap-2 text-xs">
              {selectedBooking.status === "pending" && selectedBooking.payment_status === "unpaid" && (
                <button
                  onClick={() => {
                    const nextPaymentStatus = (Number(selectedBooking.remaining_balance) <= 0) ? "fully_paid" : "downpayment_paid";
                    updateBookingStatus(selectedBooking.id, "confirmed", nextPaymentStatus);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg uppercase tracking-wider"
                >
                  {Number(selectedBooking.remaining_balance) <= 0 ? "Confirm Full Payment" : "Confirm Downpayment"}
                </button>
              )}
              {selectedBooking.status === "confirmed" && selectedBooking.payment_status === "downpayment_paid" && (
                <button
                  onClick={() => updateBookingStatus(selectedBooking.id, "confirmed", "fully_paid")}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg uppercase tracking-wider"
                >
                  Settle Final Balance
                </button>
              )}
              {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel this booking?")) {
                      updateBookingStatus(selectedBooking.id, "cancelled");
                    }
                  }}
                  className="px-4 py-2 bg-rose-650 hover:bg-rose-550 text-white font-bold rounded-lg uppercase tracking-wider"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
