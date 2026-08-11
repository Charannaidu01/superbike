import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Studio from './pages/Studio';
import Garage from './pages/Garage';
import Marketplace from './pages/Marketplace';
import Gallery from './pages/Gallery';
import Auth from './pages/Auth';
import Sell from './pages/Sell';
import Chat from './pages/Chat';
import BuildDetails from './pages/BuildDetails';
import { supabase } from './services/supabase';
import { useBuildStore } from './store/useBuildStore';

export default function App() {
  const setAuthUser = useBuildStore(state => state.setAuthUser);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setAuthUser(data.session?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, [setAuthUser]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-gray-100 selection:bg-brand-orange selection:text-white">
        {/* Unified Navbar Header */}
        <Navbar />

        {/* Workspace routing */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* P2P Listing Forms */}
            <Route path="/sell" element={<Sell />} />
            
            {/* P2P Messaging Inbox */}
            <Route path="/chat" element={<Chat />} />
            
            {/* Shareable Custom builds details */}
            <Route path="/builds/:id" element={<BuildDetails />} />
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
