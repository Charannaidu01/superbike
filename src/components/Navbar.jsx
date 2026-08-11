import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useBuildStore } from '../store/useBuildStore';
import { supabase } from '../services/supabase';
import { 
  Wrench, 
  User, 
  Bell, 
  LogOut, 
  Plus, 
  MessageSquare,
  X,
  Sparkles,
  LogIn
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, notifications, conversations, markAllNotificationsRead, clearNotification } = useBuildStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const activeLinkClass = "text-brand-orange font-semibold border-b-2 border-brand-orange pb-1";
  const inactiveLinkClass = "text-gray-400 hover:text-white transition duration-200 pb-1";

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = conversations.reduce((acc, conv) => acc + conv.messages.filter(m => m.senderId !== 'usr-current' && m.senderId !== 'system').length, 0);

  const handleSellClick = () => {
    if (!isLoggedIn) {
      alert("Authentication required. Redirecting to Google Sign-In...");
      navigate('/auth');
    } else {
      navigate('/sell');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-orange to-brand-red flex items-center justify-center text-white glow-orange group-hover:scale-105 transition-all duration-300">
          <Wrench size={20} className="group-hover:rotate-45 transition duration-300" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-wider text-white">RIDE<span className="text-brand-orange text-glow">VISION</span></span>
          <p className="text-[10px] text-gray-500 font-medium tracking-tight">VISUALIZE. CUSTOMIZE. RIDE.</p>
        </div>
      </Link>

      {/* Main Navigation Links */}
      <div className="hidden lg:flex items-center gap-8">
        <Link to="/" className={location.pathname === '/' ? activeLinkClass : inactiveLinkClass}>
          Home
        </Link>
        <Link to="/studio" className={location.pathname === '/studio' ? activeLinkClass : inactiveLinkClass}>
          Customize
        </Link>
        <Link to="/gallery" className={location.pathname === '/gallery' ? activeLinkClass : inactiveLinkClass}>
          Explore Builds
        </Link>
        <Link to="/marketplace" className={location.pathname === '/marketplace' ? activeLinkClass : inactiveLinkClass}>
          Parts
        </Link>
        <Link to="/garage" className={location.pathname === '/garage' ? activeLinkClass : inactiveLinkClass}>
          My Garage
        </Link>
      </div>

      {/* Right Navigation & Interactive Tools */}
      <div className="hidden lg:flex items-center gap-4">
        
        {/* "+ Sell" Prominent Button */}
        <button 
          onClick={handleSellClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold transition duration-200 shadow-md glow-orange"
        >
          <Plus size={14} />
          Sell
        </button>

        {/* Chat Messaging shortcut */}
        {isLoggedIn && (
          <Link 
            to="/chat"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition duration-200 relative"
            title="Chat Inbox"
          >
            <MessageSquare size={18} />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-red text-[8px] font-bold text-white flex items-center justify-center animate-bounce">
                {unreadMessages}
              </span>
            )}
          </Link>
        )}

        {/* Notifications list trigger */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition duration-200 relative"
          >
            <Bell size={18} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-orange text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notification Tray Popup */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-dark border border-white/10 shadow-2xl p-4 animate-fade-in z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-2">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-brand-orange" />
                  Notifications
                </span>
                {unreadNotifications > 0 && (
                  <button 
                    onClick={markAllNotificationsRead}
                    className="text-xs text-brand-orange hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No notifications yet.</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-2.5 rounded-xl border border-transparent bg-white/[0.02] relative group">
                      <button 
                        onClick={() => clearNotification(n.id)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                      <h4 className="text-xs font-bold text-white">{n.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-gray-600 block mt-1">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Options / Login CTA */}
        {isLoggedIn ? (
          <div className="relative">
            <button 
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
              className="flex items-center gap-2 border border-white/10 rounded-xl p-1.5 pr-3 hover:bg-white/5 transition duration-200"
            >
              <img 
                src={user.photo} 
                alt={user.name} 
                className="w-7 h-7 rounded-lg object-cover border border-white/10" 
              />
              <span className="text-xs font-semibold text-gray-300">{user.name.split(' ')[0]}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-dark border border-white/10 shadow-2xl p-3 animate-fade-in z-50">
                <div className="pb-3 border-b border-white/5 mb-2 px-2 pt-1 text-left">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-gray-400">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <Link to="/auth" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-white/5 hover:text-white transition">
                    <User size={14} className="text-gray-400" />
                    My Account Profile
                  </Link>
                  <Link to="/auth" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-white/5 hover:text-white transition">
                    <User size={14} className="text-gray-400" />
                    My Listings
                  </Link>
                  <button 
                    onClick={async () => { if (supabase) await supabase.auth.signOut(); logout(); setShowProfileMenu(false); navigate('/'); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-brand-red hover:bg-red-950/20 hover:text-white transition text-left"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/auth"
            className="flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white text-xs font-bold transition duration-200"
          >
            <LogIn size={14} />
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu controls */}
      <button 
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition duration-200"
      >
        {showMobileMenu ? <X size={20} /> : <Wrench size={20} />}
      </button>

      {/* Mobile Dropdown drawer overlay */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-20 left-0 right-0 glass-dark border-b border-white/10 p-6 z-50 flex flex-col gap-4 animate-fade-in text-left">
          <Link to="/" onClick={() => setShowMobileMenu(false)} className="text-gray-300 hover:text-white py-2 text-sm font-semibold border-b border-white/5">
            Home
          </Link>
          <Link to="/studio" onClick={() => setShowMobileMenu(false)} className="text-gray-300 hover:text-white py-2 text-sm font-semibold border-b border-white/5">
            Customize Studio
          </Link>
          <Link to="/gallery" onClick={() => setShowMobileMenu(false)} className="text-gray-300 hover:text-white py-2 text-sm font-semibold border-b border-white/5">
            Explore Builds
          </Link>
          <Link to="/marketplace" onClick={() => setShowMobileMenu(false)} className="text-gray-300 hover:text-white py-2 text-sm font-semibold border-b border-white/5">
            Parts marketplace
          </Link>
          <Link to="/garage" onClick={() => setShowMobileMenu(false)} className="text-gray-300 hover:text-white py-2 text-sm font-semibold border-b border-white/5">
            My Garage
          </Link>

          <button 
            onClick={() => { setShowMobileMenu(false); handleSellClick(); }}
            className="w-full bg-brand-orange hover:bg-brand-orange/95 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Sell Item
          </button>

          {!isLoggedIn ? (
            <Link 
              to="/auth" 
              onClick={() => setShowMobileMenu(false)}
              className="w-full text-center py-2.5 border border-white/10 rounded-xl text-xs text-gray-300 font-semibold"
            >
              Sign In / Create Account
            </Link>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Logged In as {user.name}</span>
              <button 
                onClick={() => { logout(); setShowMobileMenu(false); navigate('/'); }}
                className="w-full text-center py-2.5 rounded-xl bg-red-950/20 text-brand-red font-semibold text-xs border border-red-500/10"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
