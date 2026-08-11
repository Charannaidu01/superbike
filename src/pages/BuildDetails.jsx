import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBuildStore } from '../store/useBuildStore';
import { BIKE_MODELS_DB, PARTS_CATALOG } from '../services/aiService';
import BikePreview from '../components/BikePreview';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { 
  Sparkles, 
  ArrowLeft, 
  Wrench, 
  Calendar, 
  User, 
  DollarSign, 
  CheckCircle,
  Share2
} from 'lucide-react';

export default function BuildDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedBuilds, exploreBuilds, setSelectedBike, setFullModifications } = useBuildStore();

  // Search in both saved builds and public explore builds
  const build = savedBuilds.find(b => b.id === id) || exploreBuilds.find(b => b.id === id);

  if (!build) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="glass p-8 rounded-2xl border border-white/5 text-center max-w-sm space-y-4">
          <h3 className="text-base font-bold text-white">Build Not Found</h3>
          <p className="text-xs text-gray-400">The build configuration link is invalid or has been deleted by its creator.</p>
          <Link to="/" className="block w-full bg-brand-orange text-white font-bold text-xs py-2.5 rounded-lg text-center">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Resolve modifications mapping if format differs
  const mods = build.modifications || {
    Paint: build.paint || 'paint-matte-black',
    Wheels: build.wheels || 'wheels-alloy-black',
    Exhaust: build.exhaust || 'exhaust-slip-on',
    Seat: build.seat || 'seat-touring',
    Lighting: 'light-led-headlight',
    Accessories: build.accessories || []
  };

  const resolvedBike = BIKE_MODELS_DB.find(b => b.model === build.bike) || BIKE_MODELS_DB[0];

  // Calculate pricing breakdown
  let subtotal = 0;
  let labor = 0;
  const partsList = [];

  Object.entries(mods).forEach(([category, val]) => {
    if (category === 'Accessories') {
      val.forEach(pId => {
        const part = PARTS_CATALOG.find(p => p.id === pId);
        if (part) {
          partsList.push(part);
          subtotal += part.price;
          labor += part.installationCost;
        }
      });
    } else {
      const part = PARTS_CATALOG.find(p => p.id === val);
      if (part) {
        partsList.push(part);
        subtotal += part.price;
        labor += part.installationCost;
      }
    }
  });

  const handleImport = () => {
    setSelectedBike(resolvedBike);
    setFullModifications(mods);
    alert(`Imported "${build.title}" setup details! Opening Customize Studio...`);
    navigate('/studio');
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Public build link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div className="space-y-1">
            <Link to="/gallery" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition font-semibold mb-2">
              <ArrowLeft size={14} /> Back to Gallery
            </Link>
            <span className="text-[10px] text-brand-orange font-bold uppercase tracking-widest font-mono">Shared Configuration</span>
            <h1 className="text-2xl font-extrabold text-white">{build.title}</h1>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><User size={12} /> @{build.creator || 'Rider'}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {build.createdAt || 'Recent'}</span>
              <span>Bike Model: <strong className="text-white">{build.bike}</strong></span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button 
              onClick={handleShareLink}
              className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition"
            >
              <Share2 size={13} />
              Share Link
            </button>
            <button 
              onClick={handleImport}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition glow-orange"
            >
              Import Setup Config
            </button>
          </div>
        </div>

        {/* Visual Render Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Draggable slider comparison Left */}
          <div className="lg:col-span-7 space-y-4">
            <BeforeAfterSlider 
              beforeImage={
                <img src={resolvedBike.imageUrl} alt="Stock Bike" className="w-full h-full object-cover rounded-xl" />
              }
              afterImage={<BikePreview modifications={mods} />}
            />
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
              <span className="text-[10px] text-brand-orange font-mono font-bold uppercase block mb-1">Rider Design Notes</span>
              <p className="text-xs text-gray-400 leading-relaxed">
                {build.notes || "This build prioritizes structural integrity while changing color schemes and core accessory fittings. Review pricing estimates below."}
              </p>
            </div>
          </div>

          {/* Upgrade listings & Pricing Right */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Parts list */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4 text-left">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Wrench size={14} className="text-brand-orange" />
                Components Custom List
              </h3>
              
              <div className="space-y-3 divide-y divide-white/5 max-h-60 overflow-y-auto pr-1">
                {partsList.map((part, index) => (
                  <div key={part.id} className={`pt-3 ${index === 0 ? 'pt-0' : ''} flex justify-between items-center text-xs`}>
                    <div>
                      <h4 className="font-bold text-white">{part.name}</h4>
                      <span className="text-[10px] text-gray-500">{part.category} &bull; Brand: {part.brand}</span>
                    </div>
                    <span className="font-mono text-gray-300">₹{part.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4 text-left">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                <DollarSign size={14} className="text-brand-orange" />
                Build Budget Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Parts Subtotal:</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Installation Labor Est:</span>
                  <span className="text-white">₹{labor.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 font-bold text-sm">
                  <span className="text-white">Estimated Total:</span>
                  <span className="text-brand-orange">₹{(subtotal + labor).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[9px] text-gray-500 leading-normal">
                ⚠️ Pricing estimations are simulated using average catalog values. Verified dealer costs might differ. Check safety-critical regulations for modified lighting/exhaust setups.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
