import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, HelpCircle, Mail, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-orange to-brand-red flex items-center justify-center text-white">
              <Wrench size={16} />
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">RIDE<span className="text-brand-orange">VISION</span></span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Leading AI-driven visual configurator for motorcycles. Preview premium paint finishes, carbon exhausts, custom wheels, and high-quality utility accessories before spending a single rupee.
          </p>
        </div>

        {/* Studio Links */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Studio Configurator</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><Link to="/studio" className="hover:text-brand-orange transition">Change Paint Colors</Link></li>
            <li><Link to="/studio" className="hover:text-brand-orange transition">Upgrade Wheels & Rims</Link></li>
            <li><Link to="/studio" className="hover:text-brand-orange transition">Exhaust Sound Previews</Link></li>
            <li><Link to="/studio" className="hover:text-brand-orange transition">Touring Accessory Bundles</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Resources</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><Link to="/gallery" className="hover:text-brand-orange transition">Community Gallery</Link></li>
            <li><Link to="/marketplace" className="hover:text-brand-orange transition">Compatible Parts Index</Link></li>
            <li><Link to="/garage" className="hover:text-brand-orange transition">Saved Custom Builds</Link></li>
            <li><span className="cursor-not-allowed hover:text-brand-orange transition">Visual Matching Confidence Score</span></li>
          </ul>
        </div>

        {/* Security / Contacts */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Get Support</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-center gap-2"><Mail size={12} className="text-brand-orange" /> support@ridevision.com</li>
            <li className="flex items-center gap-2"><ShieldCheck size={12} className="text-brand-orange" /> Verified Seller Security</li>
            <li className="flex items-center gap-2"><HelpCircle size={12} className="text-brand-orange" /> Installation Guides</li>
          </ul>
        </div>
      </div>

      {/* RLS / Safety Warning Section */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-3 bg-brand-orange/5 border border-brand-orange/15 rounded-xl p-4 max-w-2xl text-left">
          <AlertTriangle size={18} className="text-brand-orange shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">Safety & Compatibility Notice</span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              RideVision generated images, budget assessments, and compatibility configurations are for <strong>visual preview purposes only</strong>. Riders must verify precise mechanical, legality, and manufacturer warranties with certified mechanics before final purchasing or installation.
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="text-[10px] text-gray-600">&copy; {new Date().getFullYear()} RideVision. All rights reserved.</p>
          <p className="text-[9px] text-gray-700 mt-1">Built with React, Tailwind CSS & Supabase.</p>
        </div>
      </div>
    </footer>
  );
}
