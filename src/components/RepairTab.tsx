import React, { useState } from 'react';
import { PenTool, Search, Monitor, Calendar, CreditCard, ChevronRight, CheckCircle2, User, Phone, Laptop, AlertCircle, Wrench } from 'lucide-react';
import { Repair } from '../types';

export default function RepairTab() {
  // Booking Form State
  const [form, setForm] = useState({
    client_name: '',
    contact: '',
    device: '',
    issue: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{ tracking_number: string; data: Repair } | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Tracking State
  const [trackCode, setTrackCode] = useState('');
  const [trackResult, setTrackResult] = useState<Repair | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Form Submit Action
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name.trim() || !form.contact.trim() || !form.device.trim() || !form.issue.trim()) {
      setBookingError("Please complete all tracking and registration forms.");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const res = await fetch('/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBookingSuccess({
          tracking_number: data.tracking_number,
          data: data.data
        });
        // Auto paste to tracker input
        setTrackCode(data.tracking_number);
        // Clear booking form for subsequent entries
        setForm({ client_name: '', contact: '', device: '', issue: '' });
      } else {
        setBookingError(data.error || "An database recording failure occurred.");
      }
    } catch (err: any) {
      setBookingError("Server communication fault: " + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // Search Tracker Action
  const handleTrackingSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackCode.trim()) return;

    setTrackLoading(true);
    setTrackError(null);
    setTrackResult(null);

    try {
      const res = await fetch(`/api/repairs/${encodeURIComponent(trackCode.trim())}`);
      const data = await res.json();

      if (res.ok) {
        setTrackResult(data);
      } else {
        setTrackError(data.error || "Tracking code mismatch. Please check your docket details.");
      }
    } catch (err: any) {
      setTrackError("Server communication fault: " + err.message);
    } finally {
      setTrackLoading(false);
    }
  };

  // Get current active numerical step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Diagnosis': return 1;
      case 'In Progress': return 2;
      case 'Ready for Pickup': return 3;
      case 'Completed': return 4;
      default: return 0;
    }
  };

  const steps = [
    { title: 'Intake Booked', note: 'Ticket queued' },
    { title: 'Diagnosis', note: 'Hardware evaluation' },
    { title: 'Servicing', note: 'Repacking & Fixes' },
    { title: 'Tested', note: 'Ready for Cebu pickup' },
    { title: 'Completed', note: 'Ticket archived' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="repair-tab-container">
      {/* Left Col - Booking Form intake */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5" id="repair-intake-card">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <PenTool className="w-4 h-4 text-[#E24B4A]" />
            <h3 className="font-semibold text-white text-sm tracking-wide uppercase">Register Repair Ticket</h3>
          </div>

          <p className="text-xs text-white/50 mb-5 leading-relaxed">
            Need a laptop screen fix, custom coolant refill, or motherboard diagnostic? File a ticket directly into the MJSTECH SQL database cluster.
          </p>

          {bookingError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-3 rounded-lg flex items-center gap-2" id="booking-error-alert">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{bookingError}</span>
            </div>
          )}

          {bookingSuccess && (
            <div className="mb-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-4 rounded-lg space-y-3" id="booking-success-alert">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ticket Added to Talisay HQ Matrix!</span>
              </div>
              <div className="text-xs">
                Your Tracking number is ready: 
                <span className="font-mono bg-black/60 border border-white/10 text-white font-bold px-2 py-0.5 rounded ml-1 select-all">
                  {bookingSuccess.tracking_number}
                </span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                We have pre-filled this tracking code into the tracker beside. Click &quot;Track Ticket&quot; to review progress phases.
              </p>
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="space-y-4" id="repair-booking-form">
            {/* Client input */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-white/40 mb-1.5 block">Client Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-black/40 text-xs pl-9 pr-4 py-2.5 rounded-lg border border-white/10 text-white focus:border-[#E24B4A] focus:outline-none focus:ring-0 transition-colors"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  id="client-name-input"
                />
              </div>
            </div>

            {/* Contact input */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-white/40 mb-1.5 block">Cebu Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 09944061005"
                  className="w-full bg-black/40 text-xs pl-9 pr-4 py-2.5 rounded-lg border border-white/10 text-white focus:border-[#E24B4A] focus:outline-none focus:ring-0 transition-colors"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  id="client-contact-input"
                />
              </div>
            </div>

            {/* Device model */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-white/40 mb-1.5 block">Hardware Device &amp; Model</label>
              <div className="relative">
                <Laptop className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Acer Nitro 5 (2023)"
                  className="w-full bg-black/40 text-xs pl-9 pr-4 py-2.5 rounded-lg border border-white/10 text-white focus:border-[#E24B4A] focus:outline-none focus:ring-0 transition-colors"
                  value={form.device}
                  onChange={(e) => setForm({ ...form, device: e.target.value })}
                  id="client-device-input"
                />
              </div>
            </div>

            {/* Fault specs */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-white/40 mb-1.5 block">Defect / Required Customization Specs</label>
              <textarea
                required
                rows={3}
                placeholder="Describe motherboard defects, RAM crash issues, or screen water damage details..."
                className="w-full bg-black/40 text-xs p-3.5 rounded-lg border border-white/10 text-white focus:border-[#E24B4A] focus:outline-none focus:ring-0 transition-colors resize-none"
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                id="client-issue-textarea"
              />
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full bg-[#E24B4A] hover:bg-[#A32D2D] active:scale-95 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-widest transition-all cursor-pointer"
              id="submit-booking-btn"
            >
              {bookingLoading ? 'Registering Ticket...' : 'Secure Repair Entry'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Col - Tracker progress status */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 flex flex-col" id="repair-tracking-card">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Wrench className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm tracking-wide uppercase">Real-Time Repairs Diagnosis Monitor</h3>
          </div>

          <p className="text-xs text-white/50 mb-5 leading-relaxed">
            Verify diagnosis and billings tracking from Talisay City, Cebu, using your specific repairs ticket docket code:
          </p>

          {/* Search Trigger */}
          <form onSubmit={handleTrackingSearch} className="flex gap-2 mb-6" id="repair-search-form">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                required
                className="w-full bg-black/40 text-xs font-mono pl-9 pr-4 py-2.5 rounded-lg border border-white/10 text-white placeholder-white/30 focus:border-[#E24B4A] focus:outline-none"
                placeholder="Enter Docket e.g. MJS-REP-1005"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                id="tracking-query-input"
              />
            </div>
            <button
              type="submit"
              disabled={trackLoading || !trackCode.trim()}
              className="bg-[#2e2e2e] hover:bg-[#3e3e3e] active:scale-95 border border-white/10 text-white text-xs font-semibold px-4 rounded-lg transition-all cursor-pointer"
              id="track-docket-btn"
            >
              {trackLoading ? 'Searching...' : 'Track Ticket'}
            </button>
          </form>

          {trackError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-4 rounded-lg flex items-center gap-2.5" id="tracking-error-alert">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{trackError}</span>
            </div>
          )}

          {!trackResult && !trackError && (
            <div className="text-center py-16 text-white/30 border border-dashed border-white/5 rounded-lg" id="tracking-blank-state">
              <Wrench className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse text-[#E24B4A]" />
              <p className="text-xs">No query tracking loaded. Put docket code like **MJS-REP-1005** or **MJS-REP-4952**.</p>
            </div>
          )}

          {trackResult && (
            <div className="space-y-6" id="tracking-viewport">
              {/* Stepper progress layout */}
              <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-4 pb-2 border-b border-white/5">
                  <span className="flex items-center gap-1">
                    🟢 CURRENT STATUS: 
                    <span className="text-emerald-400 font-bold uppercase">{trackResult.status}</span>
                  </span>
                  <span>Docket: {trackResult.tracking_number}</span>
                </div>

                {/* Progress Indicators */}
                <div className="relative py-4">
                  {/* Progress Connector wire line */}
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/5 -translate-y-1/2 z-0 hidden sm:block" />
                  <div 
                    className="absolute top-1/2 left-4 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block" 
                    style={{ width: `${(getStepIndex(trackResult.status) / (steps.length - 1)) * 90}%` }}
                  />

                  {/* Nodes list */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4 sm:gap-0">
                    {steps.map((st, idx) => {
                      const completed = idx <= getStepIndex(trackResult.status);
                      const active = idx === getStepIndex(trackResult.status);
                      return (
                        <div key={idx} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center shrink-0 w-full sm:w-28">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-[#1e1e1e] transition-all ${
                            completed 
                              ? 'bg-emerald-500 text-[#1e1e1e]' 
                              : 'bg-[#2e2e2e] text-white/40 ring-transparent'
                          } ${active ? 'animate-bounce border border-white' : ''}`}>
                            {completed ? '✓' : idx + 1}
                          </div>
                          <div>
                            <div className={`text-xs font-bold leading-tight ${completed ? 'text-white' : 'text-white/40'}`}>
                              {st.title}
                            </div>
                            <div className="text-[10px] text-white/30 font-mono mt-0.5">{st.note}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Booking Specifications report card */}
              <div className="bg-black/30 border border-white/5 rounded-xl p-5 space-y-4" id="tracking-specs-card">
                <h4 className="text-xs font-mono font-bold text-[#F09595] tracking-wider uppercase">Repairs Inspection Report</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-white/50">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#E24B4A]" />
                      <span>CL: <strong className="text-white">{trackResult.client_name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#E24B4A]" />
                      <span>PH: <strong className="text-white select-all">{trackResult.contact}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-[#E24B4A]" />
                      <span>HW: <strong className="text-white">{trackResult.device}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#E24B4A]" />
                      <span>DT: <strong className="text-white">{trackResult.created_at}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-3">
                  <span className="text-[10px] font-mono text-white/30 block tracking-widest uppercase mb-1">Diagnosed Fault Index:</span>
                  <p className="text-xs text-white bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed font-sans">
                    {trackResult.issue}
                  </p>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/70">Estimated Repair Cost:</span>
                  </div>
                  <strong className="text-emerald-400 text-sm select-all">
                    {trackResult.cost > 0 ? `₱${trackResult.cost.toLocaleString('en-US')}` : 'Awaiting Diagnostic'}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
