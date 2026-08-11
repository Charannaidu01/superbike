import React, { useState } from 'react';
import { useBuildStore } from '../store/useBuildStore';
import { BIKE_MODELS_DB, PARTS_CATALOG } from '../services/aiService';
import { 
  Trash2, 
  Copy, 
  Edit3, 
  Share2, 
  Plus, 
  Calendar, 
  Wrench, 
  History, 
  User, 
  Sparkles,
  CreditCard,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Garage() {
  const { 
    user, 
    garage, 
    savedBuilds, 
    customizationHistory, 
    addBikeToGarage, 
    deleteBuild, 
    duplicateBuild, 
    renameBuild,
    setFullModifications,
    setSelectedBike
  } = useBuildStore();

  // Modals and inputs
  const [showAddBike, setShowAddBike] = useState(false);
  const [newBikeMake, setNewBikeMake] = useState('Royal Enfield');
  const [newBikeModel, setNewBikeModel] = useState('Classic 350');
  const [newBikeYear, setNewBikeYear] = useState(new Date().getFullYear());
  const [newBikeCat, setNewBikeCat] = useState('Cruiser');

  const [renamingId, setRenamingId] = useState(null);
  const [renamingTitle, setRenamingTitle] = useState('');

  // Add new bike to garage handler
  const handleAddBike = (e) => {
    e.preventDefault();
    if (!newBikeMake.trim() || !newBikeModel.trim()) return;

    // Resolve details or use defaults
    const matchingDBBike = BIKE_MODELS_DB.find(
      b => b.model.toLowerCase().includes(newBikeModel.toLowerCase())
    );

    addBikeToGarage({
      id: matchingDBBike?.id || `custom-${Date.now()}`,
      manufacturer: newBikeMake,
      model: newBikeModel,
      year: newBikeYear,
      category: newBikeCat,
      imageUrl: matchingDBBike?.imageUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop'
    });

    setShowAddBike(false);
    setNewBikeMake('Royal Enfield');
    setNewBikeModel('Classic 350');
  };

  // Helper to load saved build back into configurator Studio
  const handleLoadBuild = (build) => {
    const foundBike = BIKE_MODELS_DB.find(b => b.model === build.bike) || BIKE_MODELS_DB[0];
    setSelectedBike(foundBike);
    setFullModifications(build.modifications);
  };

  // Share build triggers notification
  const handleShareBuild = (title) => {
    navigator.clipboard.writeText(window.location.origin + '/studio');
    alert(`Copied custom studio URL for build "${title}" to your clipboard! Share it with your friends.`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-10 px-4 md:px-12">
      {/* Add Bike Modal */}
      {showAddBike && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
          <form onSubmit={handleAddBike} className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="text-brand-orange" size={16} />
                Add Motorcycle to Garage
              </h3>
              <button type="button" onClick={() => setShowAddBike(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold block text-left">Manufacturer</label>
                <input 
                  type="text" 
                  value={newBikeMake}
                  onChange={(e) => setNewBikeMake(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                  placeholder="e.g. Royal Enfield"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold block text-left">Model Name</label>
                <input 
                  type="text" 
                  value={newBikeModel}
                  onChange={(e) => setNewBikeModel(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                  placeholder="e.g. Hunter 350"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold block text-left">Model Year</label>
                <input 
                  type="number" 
                  value={newBikeYear}
                  onChange={(e) => setNewBikeYear(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold block text-left">Category</label>
                <select 
                  value={newBikeCat}
                  onChange={(e) => setNewBikeCat(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                >
                  {['Cruiser', 'Naked', 'Sport', 'Adventure', 'Touring', 'Retro', 'Cafe Racer'].map(cat => (
                    <option key={cat} value={cat} className="bg-[#121212]">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs py-2.5 rounded-lg transition"
            >
              Add Vehicle
            </button>
          </form>
        </div>
      )}

      {/* Profile summary card */}
      <div className="max-w-7xl mx-auto glass p-6 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="flex items-center gap-4">
          <img src={user.photo} alt={user.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
          <div>
            <span className="text-[9px] bg-brand-orange/15 text-brand-orange font-mono font-bold px-2 py-0.5 rounded-full uppercase">
              RIDER PRESETS
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">{user.name}</h2>
            <p className="text-xs text-gray-400">{user.email} &bull; {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 divide-x divide-white/5 font-mono">
          <div className="px-4 text-center">
            <span className="text-[10px] text-gray-500 block uppercase">Garages</span>
            <span className="text-lg font-bold text-white">{garage.length}</span>
          </div>
          <div className="px-4 text-center">
            <span className="text-[10px] text-gray-500 block uppercase">Saved builds</span>
            <span className="text-lg font-bold text-white">{savedBuilds.length}</span>
          </div>
          <div className="px-4 text-center">
            <span className="text-[10px] text-gray-500 block uppercase">Simulated Spends</span>
            <span className="text-lg font-bold text-brand-orange">
              ₹{garage.reduce((acc, b) => acc + b.totalSpend, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section 1: My Garage vehicles */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <History size={16} className="text-brand-orange" />
              My Garage Vehicles
            </h3>
            <button 
              onClick={() => setShowAddBike(true)}
              className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              <Plus size={14} /> Add Bike
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {garage.map(bike => (
              <div key={bike.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 text-left relative group">
                <img src={bike.photoUrl} alt={bike.model} className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition duration-300" />
                <div className="p-4 space-y-2">
                  <div>
                    <span className="text-[9px] text-brand-orange font-mono uppercase font-bold tracking-wider">{bike.category}</span>
                    <h4 className="text-sm font-extrabold text-white">{bike.manufacturer} {bike.model}</h4>
                    <p className="text-[10px] text-gray-500">Year: {bike.year}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]">
                    <span className="text-gray-400">Builds: {bike.totalBuilds}</span>
                    <span className="text-brand-orange font-bold">Spend: ₹{bike.totalSpend.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Saved Configurator Builds */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 text-left">
            <Wrench size={16} className="text-brand-orange" />
            Saved Custom Configurations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedBuilds.length === 0 ? (
              <div className="col-span-full bg-white/[0.01] border border-dashed border-white/5 rounded-2xl py-12 text-center text-gray-500 text-xs">
                No custom builds saved yet. Start designing in the Customize Studio!
              </div>
            ) : (
              savedBuilds.map(build => (
                <div key={build.id} className="glass border border-white/5 rounded-2xl p-5 text-left flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      {renamingId === build.id ? (
                        <div className="flex gap-2 w-full mr-2">
                          <input 
                            type="text" 
                            value={renamingTitle}
                            onChange={(e) => setRenamingTitle(e.target.value)}
                            className="bg-white/5 border border-brand-orange/40 rounded p-1 text-xs text-white focus:outline-none w-full"
                          />
                          <button 
                            onClick={() => {
                              renameBuild(build.id, renamingTitle);
                              setRenamingId(null);
                            }}
                            className="text-xs bg-brand-orange text-white px-2 py-0.5 rounded font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-sm font-extrabold text-white">{build.title}</h4>
                          <span className="text-[10px] text-gray-500 font-medium block">{build.bike}</span>
                        </div>
                      )}

                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setRenamingId(build.id);
                            setRenamingTitle(build.title);
                          }}
                          className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
                          title="Rename"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button 
                          onClick={() => duplicateBuild(build.id)}
                          className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
                          title="Duplicate"
                        >
                          <Copy size={12} />
                        </button>
                        <button 
                          onClick={() => deleteBuild(build.id)}
                          className="w-7 h-7 rounded bg-white/5 hover:bg-red-950 flex items-center justify-center text-gray-400 hover:text-brand-red transition"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{build.notes || 'No description notes provided.'}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="text-xs font-bold text-brand-orange">₹{build.cost.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleShareBuild(build.title)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                        title="Share Build"
                      >
                        <Share2 size={12} />
                      </button>
                      <Link 
                        to="/studio"
                        onClick={() => handleLoadBuild(build)}
                        className="text-[10px] font-bold bg-brand-orange/10 hover:bg-brand-orange border border-brand-orange/20 text-brand-orange hover:text-white px-3 py-1.5 rounded-lg transition"
                      >
                        Load Config
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 3: Customization History */}
        <div className="space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <History size={16} className="text-brand-orange" />
            AI Customization Sessions Log
          </h3>

          <div className="glass border border-white/5 rounded-2xl divide-y divide-white/5">
            {customizationHistory.map((hist, idx) => (
              <div key={idx} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={hist.originalImage} alt={hist.bike} className="w-12 h-10 object-cover rounded-lg border border-white/5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{hist.bike} customization</h4>
                    <p className="text-[10px] text-gray-500">Date: {hist.date} &bull; Upgrades applied: {Object.keys(hist.modifications).join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold font-mono text-brand-orange">₹{hist.cost.toLocaleString()}</span>
                  <Link 
                    to="/studio" 
                    onClick={() => {
                      const found = BIKE_MODELS_DB.find(b => b.model === hist.bike);
                      if (found) {
                        setSelectedBike(found);
                        setFullModifications(hist.modifications);
                      }
                    }}
                    className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg border border-white/10 transition"
                  >
                    Revisit Config
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
