import React, { useState } from 'react';
import { useBuildStore } from '../store/useBuildStore';
import { BIKE_MODELS_DB } from '../services/aiService';
import { 
  Heart, 
  Share2, 
  Sparkles, 
  Bookmark, 
  Eye, 
  Compass,
  Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Gallery() {
  const { exploreBuilds, setSelectedBike, setFullModifications, saveBuild } = useBuildStore();
  const [likedBuilds, setLikedBuilds] = useState({});
  const [savedBuildsStatus, setSavedBuildsStatus] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');

  const galleryCategories = [
    'All',
    'Cafe Racer',
    'Scrambler',
    'Touring',
    'Adventure',
    'Street',
    'Performance',
    'Minimal',
    'Retro'
  ];

  const handleLike = (id) => {
    setLikedBuilds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSaveBuild = (build) => {
    saveBuild(build.title, build.notes);
    setSavedBuildsStatus(prev => ({ ...prev, [build.id]: true }));
    alert(`"${build.title}" added to your Saved Builds!`);
  };

  const handleLoadBuild = (build) => {
    const foundBike = BIKE_MODELS_DB.find(b => b.model === build.bike) || BIKE_MODELS_DB[0];
    setSelectedBike(foundBike);
    
    // Resolve modifications
    const buildMods = {
      Paint: build.paint || 'paint-matte-black',
      Wheels: build.wheels || 'wheels-alloy-black',
      Exhaust: build.exhaust || 'exhaust-slip-on',
      Seat: build.seat || 'seat-touring',
      Lighting: 'light-led-headlight',
      Accessories: build.accessories || []
    };
    setFullModifications(buildMods);
  };

  const filteredBuilds = activeCategory === 'All' 
    ? exploreBuilds
    : exploreBuilds.filter(b => b.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-10 px-4 md:px-12">
      {/* Title */}
      <div className="max-w-7xl mx-auto text-left mb-8">
        <span className="text-xs font-bold text-brand-orange tracking-widest uppercase font-mono">Inspiration Gallery</span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-0.5 font-mono">Explore Community Builds</h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">Browse customized builds created by other riders. Save builds or load their setups directly into your configurator studio workspace.</p>
      </div>

      {/* Category selector chips */}
      <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-4 mb-8">
        {galleryCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap border transition duration-200 ${activeCategory === cat ? 'bg-brand-orange border-brand-orange text-white glow-orange' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Explore Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredBuilds.length === 0 ? (
          <div className="bg-white/[0.01] border border-dashed border-white/5 rounded-2xl py-20 text-center text-gray-500 text-xs">
            No community builds matched the selected category yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBuilds.map(build => {
              const isLiked = likedBuilds[build.id];
              const isSaved = savedBuildsStatus[build.id];
              
              // Load corresponding sample image for visual representation
              const defaultImage = build.bike.includes('KTM')
                ? 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop'
                : build.bike.includes('Honda')
                ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop';

              return (
                <div key={build.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 text-left flex flex-col justify-between group">
                  <div className="relative">
                    <img 
                      src={defaultImage} 
                      alt={build.title} 
                      className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition duration-300"
                    />
                    
                    {/* Floating Info category badge */}
                    <span className="absolute top-4 left-4 text-[9px] bg-black/80 border border-brand-orange/40 text-brand-orange font-bold uppercase px-2 py-0.5 rounded backdrop-blur-sm tracking-wider">
                      {build.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-extrabold text-white group-hover:text-brand-orange transition">{build.title}</h4>
                          <span className="text-[10px] text-gray-500 font-medium">{build.bike}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-500 block uppercase font-mono">Est. Build</span>
                          <span className="text-xs font-bold text-white">₹{build.cost.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{build.notes}</p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-auto">
                      <span className="text-[10px] text-gray-500">Creator: <strong>@{build.creator}</strong></span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleLike(build.id)}
                          className={`flex items-center gap-1 text-[11px] font-bold ${isLiked ? 'text-brand-red' : 'text-gray-400 hover:text-white'}`}
                        >
                          <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
                          <span>{build.likes + (isLiked ? 1 : 0)}</span>
                        </button>
                        <button 
                          onClick={() => handleSaveBuild(build)}
                          disabled={isSaved}
                          className={`p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-brand-orange/40 transition text-gray-400 hover:text-white ${isSaved ? 'text-brand-green border-brand-green/20' : ''}`}
                          title="Save build to garage"
                        >
                          <Bookmark size={12} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'text-brand-green' : ''} />
                        </button>
                        <Link 
                          to="/studio"
                          onClick={() => handleLoadBuild(build)}
                          className="text-[10px] font-bold bg-brand-orange/10 hover:bg-brand-orange border border-brand-orange/20 text-brand-orange hover:text-white px-3 py-1.5 rounded-lg transition"
                        >
                          Load Setup
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
