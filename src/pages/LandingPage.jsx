import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Sparkles, Upload, Eye, Cpu, ShieldAlert, BadgeInfo, CheckCircle } from 'lucide-react';
import BikePreview from '../components/BikePreview';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { PARTS_CATALOG } from '../services/aiService';

export default function LandingPage() {
  // Demo states for the landing page interactive playground
  const [demoMods, setDemoMods] = useState({
    Paint: 'paint-matte-black',
    Wheels: 'wheels-alloy-black',
    Exhaust: 'exhaust-slip-on',
    Seat: 'seat-touring',
    Lighting: 'light-led-headlight',
    Accessories: ['acc-crashguard', 'acc-mirrors']
  });

  const updateDemoMod = (category, partId) => {
    setDemoMods(prev => {
      const copy = { ...prev };
      if (category === 'Accessories') {
        const idx = copy.Accessories.indexOf(partId);
        if (idx > -1) {
          copy.Accessories = copy.Accessories.filter(id => id !== partId);
        } else {
          copy.Accessories = [...copy.Accessories, partId];
        }
      } else {
        copy[category] = partId;
      }
      return copy;
    });
  };

  const getDemoCost = () => {
    let cost = 0;
    Object.entries(demoMods).forEach(([cat, val]) => {
      if (cat === 'Accessories') {
        val.forEach(pId => {
          const part = PARTS_CATALOG.find(p => p.id === pId);
          if (part) cost += part.price + part.installationCost;
        });
      } else {
        const part = PARTS_CATALOG.find(p => p.id === val);
        if (part) cost += part.price + part.installationCost;
      }
    });
    return cost;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold tracking-wider uppercase">
            <Sparkles size={12} className="animate-spin" />
            AI-Powered Customizer
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Visualize Your <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red text-glow">
              Dream Bike
            </span> <br />
            Before You Build It.
          </h1>
          
          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-lg">
            Upload your bike, select custom parts and color schemes, and let our advanced AI generate a photorealistic preview. Build with confidence, save money, and find compatible components.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link 
              to="/studio" 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red text-white text-sm font-bold text-center glow-orange hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Wrench size={16} />
              Customize My Bike
            </Link>
            <Link 
              to="/gallery" 
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold text-center border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              Explore Custom Builds
            </Link>
          </div>

          {/* Customization Chips */}
          <div className="space-y-3 pt-4">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Visual Modifications previewed:</span>
            <div className="flex flex-wrap gap-2">
              {['Matte Black Paint', 'Alloy Wheels', 'LED Headlight', 'Touring Seat', 'Performance Exhaust'].map((chip, idx) => (
                <span key={idx} className="text-xs bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-lg text-gray-300">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Slider Comparison */}
        <div className="lg:col-span-7 w-full">
          <BeforeAfterSlider 
            beforeImage={<BikePreview modifications={{}} />} 
            afterImage={
              <BikePreview modifications={{
                Paint: 'paint-racing-red',
                Wheels: 'wheels-alloy-performance',
                Exhaust: 'exhaust-slip-on',
                Seat: 'seat-split',
                Lighting: 'light-led-headlight',
                Accessories: ['acc-crashguard', 'acc-mirrors']
              }} />
            }
          />
        </div>
      </section>

      {/* Product Flow Section */}
      <section className="bg-[#0c0c0c] border-y border-white/5 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs text-brand-orange uppercase font-bold tracking-widest font-mono">The Studio Experience</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">How RideVision Works</h2>
            <p className="text-xs md:text-sm text-gray-400">Our seamless rendering pipeline handles everything from photograph classification to exact budget planning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: <Upload size={20} className="text-brand-orange" />, title: 'Upload Photo', desc: 'Drop in a clear side-profile photo of your motorcycle in standard lighting.' },
              { step: '02', icon: <Cpu size={20} className="text-brand-orange" />, title: 'AI Identification', desc: 'Our model analyzes geometry to detect manufacturer, variant, and category.' },
              { step: '03', icon: <Wrench size={20} className="text-brand-orange" />, title: 'Customise Parts', desc: 'Pick paints, custom exhausts, touring seats, luggage stays, and aux lights.' },
              { step: '04', icon: <Eye size={20} className="text-brand-orange" />, title: 'Render & Compare', desc: 'Preview high-resolution renders, adjust budget caps, and find matching parts.' }
            ].map((stepObj, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4 text-left relative overflow-hidden group">
                <span className="absolute right-4 top-2 text-7xl font-extrabold text-white/[0.01] group-hover:text-white/[0.03] transition duration-300 font-mono">
                  {stepObj.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                  {stepObj.icon}
                </div>
                <h3 className="text-base font-bold text-white mt-2">{stepObj.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{stepObj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Demo Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs text-brand-orange uppercase font-bold tracking-widest font-mono">Live Sandbox Playground</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Interact With the Configurator</h2>
          <p className="text-xs md:text-sm text-gray-400">Select components below to dynamically update the prototype motorcycle render and estimate pricing instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-7 space-y-4">
            <BikePreview modifications={demoMods} />
            <div className="flex items-center gap-3 bg-brand-orange/5 border border-brand-orange/15 rounded-xl p-3.5">
              <BadgeInfo size={16} className="text-brand-orange shrink-0" />
              <span className="text-[11px] text-gray-400 text-left">
                Using local rendering layers. Click <strong>Customize My Bike</strong> above to upload your custom motorcycle file.
              </span>
            </div>
          </div>

          {/* Sandbox Controls panel */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="font-bold text-sm text-white">Configurator Demo</h3>
                <p className="text-[10px] text-gray-500">Royal Enfield Classic 350</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 font-semibold block">Total Estimate</span>
                <span className="text-sm font-bold text-brand-orange">₹{getDemoCost().toLocaleString()}</span>
              </div>
            </div>

            {/* Custom Paint Selector */}
            <div className="space-y-2">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block text-left">Paint Color</span>
              <div className="flex gap-2">
                {[
                  { id: 'paint-matte-black', color: '#1a1a1a', label: 'Matte Black' },
                  { id: 'paint-racing-red', color: '#cc0f0f', label: 'Racing Red' },
                  { id: 'paint-pearl-white', color: '#eceef4', label: 'Pearl White' },
                  { id: 'paint-british-green', color: '#0c4631', label: 'Racing Green' },
                ].map(p => (
                  <button 
                    key={p.id}
                    onClick={() => updateDemoMod('Paint', p.id)}
                    className={`w-8 h-8 rounded-full border-2 transition relative flex items-center justify-center`}
                    style={{ backgroundColor: p.color, borderColor: demoMods.Paint === p.id ? '#ff6b00' : 'transparent' }}
                    title={p.label}
                  >
                    {demoMods.Paint === p.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Upgrade Wheels */}
            <div className="space-y-2">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block text-left">Wheels</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'wheels-alloy-black', label: 'Black Alloys' },
                  { id: 'wheels-spoke-chrome', label: 'Chrome Spokes' },
                ].map(w => (
                  <button 
                    key={w.id}
                    onClick={() => updateDemoMod('Wheels', w.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition ${demoMods.Wheels === w.id ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Seats */}
            <div className="space-y-2">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block text-left">Seat Style</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'seat-touring', label: 'Touring Comfort' },
                  { id: 'seat-caferaser', label: 'Cafe Racer cowl' },
                ].map(s => (
                  <button 
                    key={s.id}
                    onClick={() => updateDemoMod('Seat', s.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition ${demoMods.Seat === s.id ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories checklist */}
            <div className="space-y-2">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block text-left">Utility Accessories</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'acc-crashguard', label: 'Engine Crash Guard' },
                  { id: 'acc-mirrors', label: 'Bar-end Mirrors' },
                ].map(acc => {
                  const active = demoMods.Accessories.includes(acc.id);
                  return (
                    <button 
                      key={acc.id}
                      onClick={() => updateDemoMod('Accessories', acc.id)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left flex items-center justify-between transition ${active ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                    >
                      <span>{acc.label}</span>
                      {active && <CheckCircle size={12} className="text-brand-orange" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Go to full studio CTA */}
            <Link 
              to="/studio" 
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-red text-white text-xs font-bold text-center transition hover:opacity-90"
            >
              Open Full Custom Studio Workspace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
