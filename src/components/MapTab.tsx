import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Compass, HelpCircle } from 'lucide-react';

export default function MapTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="map-tab-container">
      {/* Contact Cards of MJSTECH */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5" id="contact-details-card">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Compass className="w-4 h-4 text-[#E24B4A]" />
            <h3 className="font-semibold text-white text-sm tracking-wide uppercase">Cebu Outlet Coordinates</h3>
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E24B4A]/10 text-[#E24B4A] shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-wide uppercase">Physical Address</h4>
                <p className="text-xs text-white/60 leading-relaxed mt-1 font-sans">
                  MJSTECH Building, Barangay Poblacion (near Talisay City College), Talisay City, Cebu, 6045, Philippines
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono bg-white/5 text-white/50 px-2 py-0.5 rounded border border-white/5">
                  Lat: 10.2442° N, Lon: 123.8488° E
                </span>
              </div>
            </div>

            {/* Hotline */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E24B4A]/10 text-[#E24B4A] shrink-0 mt-0.5">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-wide uppercase">Direct Core Contacts</h4>
                <p className="text-xs text-white/60 leading-relaxed mt-1 font-sans">
                  Hotline: <strong className="text-white select-all">09944061005</strong> (James A. Meguiso)<br />
                  Office Landline: <span className="text-white select-all">(032) 491-5567</span>
                </p>
              </div>
            </div>

            {/* Emails */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E24B4A]/10 text-[#E24B4A] shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-wide uppercase">Corporate Mailbox</h4>
                <p className="text-xs text-white/60 leading-relaxed mt-1 font-sans select-all">
                  meguisoj2218@gmail.com
                </p>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#E24B4A]/10 text-[#E24B4A] shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-wide uppercase">Store Working Shift Hours</h4>
                <p className="text-xs text-white/60 leading-relaxed mt-1 font-sans">
                  Monday to Saturday: <strong className="text-white">9:00 AM - 6:00 PM</strong><br />
                  Sunday: Closed (Remote Support Open on Discord)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Directions details */}
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5" id="directions-briefing-card">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm tracking-wide uppercase">Landmark Directions</h3>
          </div>
          <ul className="text-xs text-white/50 space-y-2 list-disc pl-4 leading-relaxed font-sans">
            <li><strong>By Public Transit (Jeep/Bus):</strong> Route riding from Cebu City or Gaisano Tabunok should alight directly at Poblacion crossing, Talisay City. Tricycles are available right outside heading to Talisay City College.</li>
            <li><strong>By Private Vehicle:</strong> Drive via South Coastal Road (CSCR). Take the exit heading to Poblacion and follow directions pointing to Talisay City College. High capacity car parking is fully catered in front of our main gate.</li>
            <li><strong>Look for:</strong> The modern white and gray facade building displaying the illuminated red and white <strong>MJSTECH</strong> sign board right next to the municipal library.</li>
          </ul>
        </div>
      </div>

      {/* Map Embed Frame */}
      <div className="lg:col-span-7 flex flex-col" id="maps-embed-col">
        <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 flex flex-col flex-1" id="google-maps-frame-card">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-sm tracking-wide uppercase">Cebu Operational Center Map Landmark</h3>
          </div>

          <div className="bg-black/40 rounded-xl overflow-hidden flex-1 relative min-h-[350px] border border-white/10" id="iframe-map-viewport">
            <iframe
              src="https://maps.google.com/maps?q=Talisay%20City%20College,%20Talisay,%20Cebu,%20Philippines&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              className="absolute inset-0 border-none grayscale-[60%] invert-[90%] opacity-85 contrast-[120%]"
              allowFullScreen={false}
              loading="lazy"
              title="MJSTECH Cebu Talisay Landmark Location Map"
              id="talisay-cebu-google-maps-iframe"
            />
          </div>
          
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/30 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-[#E24B4A] shrink-0" />
            <span>Map depicts our central service facility adjacent to Talisay City, Cebu.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
