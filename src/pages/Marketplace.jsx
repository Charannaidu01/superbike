import React, { useState } from 'react';
import { useBuildStore } from '../store/useBuildStore';
import { BIKE_MODELS_DB } from '../services/aiService';
import { 
  Search, 
  SlidersHorizontal, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Star,
  Info,
  Wrench,
  DollarSign,
  MessageSquare,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Marketplace() {
  const navigate = useNavigate();
  const { parts, listings, updateModification, modifications, setSelectedBike, createConversation, isLoggedIn } = useBuildStore();

  // Active directory selector
  const [activeDirectory, setActiveDirectory] = useState('parts'); // 'parts', 'bikes'

  // Search & Filter local states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All');
  const [maxPrice, setMaxPrice] = useState(200000);

  // Detail Modal local states
  const [activeDetailPart, setActiveDetailPart] = useState(null);
  const [activeDetailBike, setActiveDetailBike] = useState(null);

  // Extract filters
  const categories = ['All', ...new Set(parts.map(p => p.category))];
  const brands = ['All', ...new Set(parts.map(p => p.brand))];
  const bikeModels = ['All', ...BIKE_MODELS_DB.map(b => b.model)];

  // Get active listings that are parts/accessories
  const userPartsListings = listings.filter(l => (l.type === 'part' || l.type === 'accessory') && l.status === 'active');
  const userBikesListings = listings.filter(l => l.type === 'bike' && l.status === 'active');

  // Merge predefined parts catalog with user posted parts
  const allParts = [
    ...parts.map(p => ({ ...p, isCatalog: true, sellerName: 'MotoMorph Catalog' })),
    ...userPartsListings.map(l => ({
      id: l.id,
      name: l.title,
      category: l.category,
      brand: l.brand,
      price: l.price,
      description: l.description,
      compatibility: { [l.compatibleBike]: 'Perfect Fit' },
      installationCost: 0,
      rating: 5.0,
      sellerName: l.sellerName,
      user_id: l.user_id,
      isCatalog: false,
      location: l.location,
      imageUrl: l.imageUrl
    }))
  ];

  // Apply filters on Parts
  const filteredParts = allParts.filter(part => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = part.name.toLowerCase().includes(query) || 
                          part.description.toLowerCase().includes(query) ||
                          part.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || part.brand === selectedBrand;
    const matchesPrice = part.price <= maxPrice;

    let matchesModel = true;
    if (selectedModel !== 'All') {
      const comp = part.compatibility[selectedModel] || part.compatibility['all'];
      matchesModel = comp && comp !== 'Not Recommended';
    }

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesModel;
  });

  // Apply filters on Bikes
  const filteredBikes = userBikesListings.filter(bike => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = bike.title.toLowerCase().includes(query) || 
                          bike.description.toLowerCase().includes(query);
    const matchesPrice = bike.price <= maxPrice;
    const matchesModel = selectedModel === 'All' || bike.model === selectedModel;

    return matchesSearch && matchesPrice && matchesModel;
  });

  const handleAddToBuild = (part) => {
    if (selectedModel !== 'All') {
      const foundBike = BIKE_MODELS_DB.find(b => b.model === selectedModel);
      if (foundBike) setSelectedBike(foundBike);
    }
    updateModification(part.category, part.id);
    alert(`"${part.name}" has been loaded into your customization config!`);
    setActiveDetailPart(null);
  };

  const handleContactSeller = (listing) => {
    if (!isLoggedIn) {
      alert("Authentication required. Please sign in with Google to chat.");
      navigate('/auth');
      return;
    }
    const convId = createConversation(listing, listing.sellerName, listing.user_id);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-10 px-4 md:px-12">
      
      {/* Product Detail Modal */}
      {activeDetailPart && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-5 text-left relative">
            <button onClick={() => setActiveDetailPart(null)} className="absolute right-4 top-4 text-gray-500 hover:text-white">
              <X size={18} />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] text-brand-orange font-bold font-mono uppercase tracking-wider">{activeDetailPart.category}</span>
              <h3 className="text-lg font-extrabold text-white">{activeDetailPart.name}</h3>
              <p className="text-xs text-gray-400 font-medium">Seller: @{activeDetailPart.sellerName} &bull; Brand: {activeDetailPart.brand}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                <div>
                  <span className="text-[10px] text-gray-500 block">List Price</span>
                  <span className="text-base font-bold text-white">₹{activeDetailPart.price.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">Labor Installation Est.</span>
                  <span className="text-xs font-bold text-gray-300">₹{activeDetailPart.installationCost?.toLocaleString() || '0'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">Product Description</span>
                <p className="text-xs text-gray-400 leading-relaxed">{activeDetailPart.description}</p>
              </div>

              {/* Compatibility matrix */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-white block">Compatibility</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(activeDetailPart.compatibility).map(([bike, status]) => (
                    <div key={bike} className="flex items-center justify-between bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5">
                      <span className="text-[10px] text-gray-300 font-semibold">{bike}</span>
                      <span className="text-[9px] font-bold text-brand-green bg-green-950/60 px-1.5 py-0.5 rounded-full">
                        {status === true ? 'Compatible' : status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              {activeDetailPart.isCatalog ? (
                <>
                  <button 
                    onClick={() => handleAddToBuild(activeDetailPart)}
                    className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs py-3 rounded-xl transition duration-200 text-center"
                  >
                    Add to Configurator Studio
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleContactSeller(activeDetailPart)}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  Contact Seller Regarding Part
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bike Details Modal */}
      {activeDetailBike && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-5 text-left relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveDetailBike(null)} className="absolute right-4 top-4 text-gray-500 hover:text-white">
              <X size={18} />
            </button>

            <img src={activeDetailBike.imageUrl} alt={activeDetailBike.title} className="w-full h-48 object-cover rounded-xl border border-white/10" />

            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-brand-orange font-bold font-mono uppercase tracking-wider">Used Motorcycle</span>
                  <h3 className="text-lg font-extrabold text-white">{activeDetailBike.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-brand-orange text-lg">₹{activeDetailBike.price.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium">Seller: @{activeDetailBike.sellerName} &bull; Location: {activeDetailBike.location}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center border-y border-white/5 py-4 font-mono">
              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 block uppercase">Kilometers</span>
                <span className="text-xs font-bold text-white">{activeDetailBike.kilometers.toLocaleString()} km</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 block uppercase">Year Model</span>
                <span className="text-xs font-bold text-white">{activeDetailBike.year}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 block uppercase">Capacity</span>
                <span className="text-xs font-bold text-white">{activeDetailBike.engineCapacity} cc</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-white block">Description Notes</span>
              <p className="text-xs text-gray-400 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5">
                {activeDetailBike.description}
              </p>
            </div>

            <button 
              onClick={() => handleContactSeller(activeDetailBike)}
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1.5 glow-orange"
            >
              <MessageSquare size={14} />
              Negotiate & Chat with Seller
            </button>
          </div>
        </div>
      )}

      {/* Directory Switching Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-left border-b border-white/5 pb-6">
        <div>
          <span className="text-xs font-bold text-brand-orange tracking-widest uppercase font-mono">Peer-To-Peer Marketplace</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-0.5">Discovers Classified Listings</h1>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => { setActiveDirectory('parts'); setMaxPrice(25000); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeDirectory === 'parts' ? 'bg-brand-orange text-white glow-orange' : 'bg-white/5 border border-white/10 text-gray-400'}`}
          >
            <Wrench size={13} />
            Parts & Accessories
          </button>
          <button 
            onClick={() => { setActiveDirectory('bikes'); setMaxPrice(200000); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeDirectory === 'bikes' ? 'bg-brand-orange text-white glow-orange' : 'bg-white/5 border border-white/10 text-gray-400'}`}
          >
            <Layers size={13} />
            Bikes Classifieds
          </button>
        </div>
      </div>

      {/* Grid: Sidebar Filters Left, Main listings Right */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-6 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-brand-orange" />
              Filter Listings
            </h3>
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setSelectedModel('All');
                setMaxPrice(activeDirectory === 'parts' ? 25000 : 200000);
                setSearchQuery('');
              }}
              className="text-[10px] text-gray-500 hover:text-white hover:underline font-bold"
            >
              Reset
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Search terms</label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Model, brand, keyword..." 
                className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
              />
            </div>
          </div>

          {activeDirectory === 'parts' && (
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Category</label>
              <div className="flex flex-col gap-1">
                {categories.slice(0, 7).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs text-left py-1.5 px-2.5 rounded-lg transition font-medium ${selectedCategory === cat ? 'bg-brand-orange/10 text-brand-orange font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Model Compatibility</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              {bikeModels.map(model => (
                <option key={model} value={model} className="bg-[#121212]">{model === 'All' ? 'All Models' : model}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span>Max Price</span>
              <span className="text-white font-mono">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min={1000} 
              max={activeDirectory === 'parts' ? 25000 : 200000} 
              step={activeDirectory === 'parts' ? 500 : 5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-orange bg-white/10 h-1 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Listings Grid Right */}
        <div className="lg:col-span-3">
          
          {/* Active: PARTS Directory */}
          {activeDirectory === 'parts' && (
            filteredParts.length === 0 ? (
              <div className="bg-white/[0.01] border border-dashed border-white/5 rounded-2xl py-20 text-center text-gray-500 text-xs">
                No parts listings matched filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParts.map(part => {
                  const compatKey = selectedModel === 'All' ? 'Royal Enfield Classic 350' : selectedModel;
                  const status = part.compatibility[compatKey] || part.compatibility['all'];

                  return (
                    <div key={part.id} className="glass-card rounded-2xl p-5 border border-white/5 text-left flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] text-brand-orange font-bold uppercase font-mono tracking-wider">{part.category}</span>
                          <span className="text-[8px] bg-white/5 border border-white/15 text-gray-400 font-bold px-1.5 py-0.5 rounded">
                            {part.isCatalog ? 'Catalog' : 'Peer'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{part.name}</h4>
                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{part.description}</p>
                        
                        <span className="text-[9px] font-bold text-brand-green bg-green-950/60 px-2 py-0.5 rounded-full inline-block">
                          {status === true ? 'Compatible' : status || 'Compatible'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <div>
                          <span className="text-[9px] text-gray-500 block">Price</span>
                          <span className="text-xs font-extrabold text-white">₹{part.price.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => setActiveDetailPart(part)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                          >
                            <Info size={12} />
                          </button>
                          {part.isCatalog ? (
                            <button 
                              onClick={() => handleAddToBuild(part)}
                              className="bg-brand-orange hover:bg-brand-orange/90 text-white text-[10px] font-bold px-3 py-2 rounded-lg transition"
                            >
                              Add
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleContactSeller(part)}
                              className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-[10px] font-bold px-3 py-2 rounded-lg transition flex items-center gap-1"
                            >
                              <MessageSquare size={11} />
                              Chat
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* Active: BIKES Directory */}
          {activeDirectory === 'bikes' && (
            filteredBikes.length === 0 ? (
              <div className="bg-white/[0.01] border border-dashed border-white/5 rounded-2xl py-20 text-center text-gray-500 text-xs">
                No bike listings matched filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBikes.map(bike => (
                  <div key={bike.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 text-left flex flex-col justify-between group">
                    <img src={bike.imageUrl} alt={bike.title} className="w-full h-36 object-cover opacity-80 group-hover:opacity-100 transition duration-300" />
                    <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[9px] text-brand-orange font-mono uppercase font-bold">{bike.manufacturer} &bull; {bike.year}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{bike.location}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-brand-orange transition line-clamp-1">{bike.title}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{bike.description}</p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <div>
                          <span className="text-[8px] text-gray-500 block">EXPECTED PRICE</span>
                          <span className="text-xs font-extrabold text-white">₹{bike.price.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex gap-1">
                          <button 
                            onClick={() => setActiveDetailBike(bike)}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition"
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => handleContactSeller(bike)}
                            className="bg-brand-orange hover:bg-brand-orange/90 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                          >
                            <MessageSquare size={11} />
                            Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}
