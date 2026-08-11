import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildStore } from '../store/useBuildStore';
import { 
  Bike, 
  Wrench, 
  ShieldAlert, 
  Upload, 
  X, 
  CheckCircle, 
  MapPin, 
  ArrowLeft 
} from 'lucide-react';

export default function Sell() {
  const navigate = useNavigate();
  const { addListing } = useBuildStore();
  
  // Selection state
  const [sellType, setSellType] = useState(null); // null, 'bike', 'part', 'accessory'

  // Listing form states (Unified)
  const [title, setTitle] = useState('');
  const [manufacturer, setManufacturer] = useState('Royal Enfield');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [kms, setKms] = useState('');
  const [capacity, setCapacity] = useState('');
  const [condition, setCondition] = useState('Excellent');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [contactPref, setContactPref] = useState('Chat Only');
  const [images, setImages] = useState([]);
  
  // Specific parts states
  const [partCategory, setPartCategory] = useState('Wheels');
  const [partBrand, setPartBrand] = useState('');
  const [compatibleBike, setCompatibleBike] = useState('Royal Enfield Classic 350');
  const [quantity, setQuantity] = useState(1);

  // Form submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // File upload simulator
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImgs = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!price || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockListingPayload = {
        type: sellType,
        title: title || `${year} ${manufacturer} ${model}`.trim() || `Custom ${sellType}`,
        price: Number(price),
        location,
        description: desc,
        imageUrl: images[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop',
        listingImages: images
      };

      if (sellType === 'bike') {
        Object.assign(mockListingPayload, {
          manufacturer,
          model,
          variant,
          year: Number(year),
          kilometers: Number(kms),
          engineCapacity: Number(capacity),
          condition,
          contactPreference: contactPref
        });
      } else {
        Object.assign(mockListingPayload, {
          productName: title,
          category: partCategory,
          brand: partBrand,
          compatibleBike: compatibleBike,
          condition,
          quantity: Number(quantity)
        });
      }

      addListing(mockListingPayload);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setSellType(null);
        navigate('/auth'); // Redirect to profile "My Listings" tab
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-12 px-4 md:px-12">
      <div className="max-w-2xl mx-auto">
        
        {/* Step 1: Switcher Screen */}
        {!sellType && (
          <div className="glass p-8 rounded-3xl border border-white/5 space-y-8 text-center animate-fade-in shadow-2xl">
            <div className="space-y-2">
              <span className="text-[10px] text-brand-orange uppercase font-bold tracking-widest font-mono">P2P Listing Creation</span>
              <h2 className="text-2xl font-extrabold text-white">What do you want to sell?</h2>
              <p className="text-xs text-gray-400">List your motorcycle or spare accessories directly to our community of customized riders.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'bike', label: 'Sell My Bike', icon: <Bike size={24} className="text-brand-orange" />, desc: 'Post a whole motorcycle for sale.' },
                { id: 'part', label: 'Sell Bike Parts', icon: <Wrench size={24} className="text-brand-orange" />, desc: 'List custom exhausts, seats, wheels.' },
                { id: 'accessory', label: 'Sell Accessories', icon: <ShieldAlert size={24} className="text-brand-orange" />, desc: 'List helmets, mounts, crash guards.' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSellType(opt.id)}
                  className="glass-card p-6 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center space-y-3 hover:border-brand-orange/40 transition duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center group-hover:scale-110 transition duration-300">
                    {opt.icon}
                  </div>
                  <h4 className="text-sm font-bold text-white">{opt.label}</h4>
                  <p className="text-[11px] text-gray-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Forms view */}
        {sellType && !submitSuccess && (
          <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 space-y-6 text-left animate-slide-up shadow-2xl">
            <button 
              onClick={() => setSellType(null)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition font-semibold"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div>
              <span className="text-[10px] text-brand-orange uppercase font-bold tracking-widest font-mono">Create Listing</span>
              <h2 className="text-xl font-extrabold text-white mt-0.5">
                {sellType === 'bike' ? 'Enter Motorcycle Specifications' : `Enter Custom ${sellType === 'part' ? 'Part' : 'Accessory'} Details`}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Image Uploader simulator */}
              <div className="space-y-2">
                <span className="text-[10px] text-gray-400 font-bold block">Listing Photos</span>
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      <img src={img} alt="listing" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 flex items-center justify-center text-gray-400 hover:text-white transition"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 4 && (
                    <label className="aspect-square rounded-xl border border-dashed border-white/10 hover:border-brand-orange/40 flex flex-col items-center justify-center cursor-pointer transition bg-white/[0.01]">
                      <Upload size={18} className="text-gray-500" />
                      <span className="text-[9px] text-gray-500 mt-1 font-mono">Upload</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {sellType === 'bike' ? (
                /* SELL MY BIKE SPECIFIC FIELDS */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Manufacturer</label>
                      <input 
                        type="text" 
                        value={manufacturer} 
                        onChange={(e) => setManufacturer(e.target.value)}
                        placeholder="e.g. Royal Enfield" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Model</label>
                      <input 
                        type="text" 
                        value={model} 
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. Classic 350" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Variant</label>
                      <input 
                        type="text" 
                        value={variant} 
                        onChange={(e) => setVariant(e.target.value)}
                        placeholder="e.g. Dark Stealth" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Model Year</label>
                      <input 
                        type="number" 
                        value={year} 
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Condition</label>
                      <select 
                        value={condition} 
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                      >
                        {['Excellent', 'Good', 'Fair', 'Need Repairs'].map(c => (
                          <option key={c} value={c} className="bg-[#121212]">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Kilometers Driven</label>
                      <input 
                        type="number" 
                        value={kms} 
                        onChange={(e) => setKms(e.target.value)}
                        placeholder="e.g. 15000" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Engine Capacity (cc)</label>
                      <input 
                        type="number" 
                        value={capacity} 
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="e.g. 349" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block">Contact Preference</label>
                    <div className="flex gap-4">
                      {['Chat Only', 'Phone & Chat'].map(pref => (
                        <label key={pref} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input 
                            type="radio" 
                            name="contact-pref" 
                            checked={contactPref === pref}
                            onChange={() => setContactPref(pref)}
                            className="text-brand-orange focus:ring-brand-orange" 
                          />
                          <span>{pref}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* PARTS / ACCESSORIES FIELDS */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold">Product Name</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Akrapovic Slip-on exhaust" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Category</label>
                      <select 
                        value={partCategory} 
                        onChange={(e) => setPartCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                      >
                        {['Wheels', 'Exhaust', 'Seats', 'Lights', 'Mirrors', 'Handlebars', 'Accessories', 'Performance', 'Touring', 'Protection'].map(cat => (
                          <option key={cat} value={cat} className="bg-[#121212]">{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Brand Manufacturer</label>
                      <input 
                        type="text" 
                        value={partBrand} 
                        onChange={(e) => setPartBrand(e.target.value)}
                        placeholder="e.g. Akrapovic" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] text-gray-400 font-bold">Compatible Bike Model</label>
                      <input 
                        type="text" 
                        value={compatibleBike} 
                        onChange={(e) => setCompatibleBike(e.target.value)}
                        placeholder="e.g. Royal Enfield Classic 350" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold">Quantity</label>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Generic Listing inputs (price, description, location) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold">Expected Price (₹)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter expected amount..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold">Location City</label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                    <MapPin size={14} className="text-gray-500" />
                    <input 
                      type="text" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Chennai" 
                      className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold">Description Details</label>
                <textarea 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Tell buyers about upgrades, condition, usage notes..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange h-24"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs py-3.5 rounded-xl transition duration-200 shadow-md glow-orange"
              >
                {isSubmitting ? 'Publishing listing...' : 'Publish Listing'}
              </button>

            </form>
          </div>
        )}

        {/* Step 3: Success Feedback screen */}
        {submitSuccess && (
          <div className="glass p-12 rounded-3xl border border-white/5 text-center animate-fade-in shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto text-brand-green">
              <CheckCircle size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Your listing has been published!</h3>
              <p className="text-xs text-gray-400">Buyers can now locate your listing in the parts index and direct message you.</p>
            </div>
            <span className="text-[10px] text-gray-600 block pt-4 font-mono">REDIRECTING TO MY LISTINGS...</span>
          </div>
        )}

      </div>
    </div>
  );
}
