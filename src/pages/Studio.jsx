import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildStore } from '../store/useBuildStore';
import { aiService, BIKE_MODELS_DB } from '../services/aiService';
import BikePreview from '../components/BikePreview';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { supabase } from '../services/supabase';
import { 
  Upload, 
  Sparkles, 
  Cpu, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw, 
  ChevronRight,
  MessageSquare,
  Send,
  X,
  Eye,
  Settings,
  Plus
} from 'lucide-react';

export default function Studio() {
  const { 
    selectedBike, 
    setSelectedBike, 
    modifications, 
    updateModification, 
    setFullModifications,
    parts, 
    saveBuild, 
    ridingStyle, 
    setRidingStyle, 
    budgetMode, 
    setBudgetMode, 
    customBudget, 
    setCustomBudget,
    user,
    isLoggedIn
  } = useBuildStore();

  const navigate = useNavigate();

  // Component UI States
  const [activeTab, setActiveTab] = useState('Paint');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [buildTitle, setBuildTitle] = useState('');
  const [buildNotes, setBuildNotes] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Chat Assistant Local States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: "Hey! I am your RideVision design assistant. Ask me to recommend builds, optimize budgets, or make your bike look 'aggressive' or 'touring' ready!" }
  ]);

  // Budget Modes configuration
  const budgetLimits = {
    'Budget': 20000,
    'Mid Range': 50000,
    'Premium': 100000,
    'Custom': customBudget
  };

  const currentLimit = budgetLimits[budgetMode];

  // Auto-tune customizer if budget limit changes
  useEffect(() => {
    if (budgetMode) {
      const optimizedBuild = aiService.generateBuild(selectedBike.model, ridingStyle, currentLimit);
      const newMods = {
        Paint: optimizedBuild.build.Paint?.id || 'paint-matte-black',
        Wheels: optimizedBuild.build.Wheels?.id || 'wheels-alloy-black',
        Exhaust: optimizedBuild.build.Exhaust?.id || 'exhaust-slip-on',
        Seat: optimizedBuild.build.Seat?.id || 'seat-touring',
        Lighting: optimizedBuild.build.Lighting?.id || 'light-led-headlight',
        Accessories: optimizedBuild.build.Accessories.map(a => a.id)
      };
      setFullModifications(newMods);
    }
  }, [budgetMode, ridingStyle, selectedBike, customBudget]);

  // Real photo upload to Supabase Storage. The local preview remains instant.
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isLoggedIn || !user?.id) {
      setUploadMessage('Please sign in before uploading a bike photo.');
      navigate('/auth');
      return;
    }
    if (!supabase) {
      setUploadMessage('Supabase is not connected yet. Add your project credentials first.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please choose a smaller image.');
      return;
    }
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Unsupported format. Please upload JPG, PNG, or WEBP.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setUploadMessage('Uploading your photo securely…');

    const reader = new FileReader();
    reader.onload = (event) => setUploadedImage(event.target.result);
    reader.readAsDataURL(file);

    try {
      const extension = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from('bike-images')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from('bike-images').getPublicUrl(path);
      const publicUrl = publicData.publicUrl;
      setUploadedImage(publicUrl);
      setUploadProgress(100);

      const { error: rowError } = await supabase.from('bike_photos').insert({
        user_id: user.id,
        file_path: path,
        public_url: publicUrl,
        original_name: file.name
      });
      if (rowError) throw rowError;

      setUploadMessage('Photo uploaded and saved to your account.');
    } catch (error) {
      console.error(error);
      setUploadMessage(error.message || 'Photo upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload({ target: { files: [file] } });
    }
  };

  // Trigger AI Image Generation simulation
  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(0);

    const steps = [
      "Analyzing your bike...",
      "Applying your modifications...",
      "Making the result realistic...",
      "Your custom bike is ready."
    ];

    const interval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsGenerated(true);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Calculate costs
  const getCostBreakdown = () => {
    let breakdown = [];
    let subtotal = 0;
    let installation = 0;

    Object.entries(modifications).forEach(([category, val]) => {
      if (category === 'Accessories') {
        val.forEach(pId => {
          const part = parts.find(p => p.id === pId);
          if (part) {
            breakdown.push({ name: part.name, category, price: part.price, labor: part.installationCost });
            subtotal += part.price;
            installation += part.installationCost;
          }
        });
      } else {
        const part = parts.find(p => p.id === val);
        if (part) {
          breakdown.push({ name: part.name, category, price: part.price, labor: part.installationCost });
          subtotal += part.price;
          installation += part.installationCost;
        }
      }
    });

    return { breakdown, subtotal, installation, total: subtotal + installation };
  };

  const { breakdown, subtotal, installation, total } = getCostBreakdown();
  const overBudget = total > currentLimit;

  // Handle Assistant Chat send
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      const response = aiService.chatAssistantResponse(userMsg, {
        bike: selectedBike.model,
        budget: currentLimit,
        style: ridingStyle
      });

      setChatHistory(prev => [...prev, { role: 'assistant', text: response.reply }]);

      // Trigger automatic modifications if assistant gives a preset action
      if (response.action && response.action.modifications) {
        const actionMods = response.action.modifications;
        const finalMods = {
          Paint: actionMods.Paint || modifications.Paint,
          Wheels: actionMods.Wheels || modifications.Wheels,
          Exhaust: actionMods.Exhaust || modifications.Exhaust,
          Seat: actionMods.Seat || modifications.Seat,
          Lighting: actionMods.Lighting || modifications.Lighting,
          Accessories: actionMods.Accessories || modifications.Accessories
        };
        setFullModifications(finalMods);
      }
    }, 1000);
  };

  // Check safety-critical warnings
  const getSafetyWarnings = () => {
    let warnings = [];
    Object.entries(modifications).forEach(([cat, val]) => {
      if (cat === 'Exhaust') {
        const part = parts.find(p => p.id === val);
        if (part?.safetyNotice) warnings.push({ name: part.name, text: part.safetyNotice });
      }
      if (cat === 'Lighting') {
        const part = parts.find(p => p.id === val);
        if (part?.safetyNotice) warnings.push({ name: part.name, text: part.safetyNotice });
      }
    });
    return warnings;
  };
  const safetyWarnings = getSafetyWarnings();

  // Recommend compatible parts
  const recommendedParts = aiService.recommendParts(selectedBike.model, ridingStyle, currentLimit);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-10 px-4 md:px-12">
      {/* Save build Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="text-brand-orange" size={18} />
              Save Customized Build
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block text-left">Build Title</label>
                <input 
                  type="text" 
                  value={buildTitle} 
                  onChange={(e) => setBuildTitle(e.target.value)}
                  placeholder="e.g. My Stealth Cruiser Setup" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold block text-left">Build Notes</label>
                <textarea 
                  value={buildNotes} 
                  onChange={(e) => setBuildNotes(e.target.value)}
                  placeholder="Describe your design choices..." 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-orange h-24"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-gray-300 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (buildTitle.trim()) {
                    saveBuild(buildTitle, buildNotes);
                    setShowSaveModal(false);
                    setBuildTitle('');
                    setBuildNotes('');
                  }
                }}
                className="px-4 py-2 rounded-lg text-xs bg-brand-orange hover:bg-brand-orange/90 text-white font-bold transition"
              >
                Save to Garage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-brand-orange tracking-widest uppercase font-mono">Workspace Studio</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-0.5">AI Bike Customizer</h1>
        </div>
        
        {/* Bike Model selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>Configuring:</span>
            <select 
              value={selectedBike.id}
              onChange={(e) => {
                const found = BIKE_MODELS_DB.find(b => b.id === e.target.value);
                if (found) setSelectedBike(found);
              }}
              className="bg-white/5 border border-white/10 rounded-lg p-1.5 font-bold text-white focus:outline-none"
            >
              {BIKE_MODELS_DB.map(b => (
                <option key={b.id} value={b.id} className="bg-[#121212]">{b.manufacturer} {b.model}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setShowSaveModal(true)}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold px-4 py-2 rounded-xl transition duration-200"
          >
            Save Build
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Visual Renders and Upload / AI actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Visualizer Panel */}
          {isGenerated ? (
            /* Rendered slider comparison */
            <div className="space-y-2">
              <BeforeAfterSlider 
                beforeImage={
                  uploadedImage ? (
                    <img src={uploadedImage} alt="Original Bike" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 font-mono text-xs">
                      <span>No original photo. Using default.</span>
                    </div>
                  )
                }
                afterImage={<BikePreview modifications={modifications} />}
              />
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 font-mono">AI Render Match Score: <strong>92%</strong></span>
                <button 
                  onClick={() => setIsGenerated(false)}
                  className="text-xs text-brand-orange hover:underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw size={12} />
                  Adjust Design
                </button>
              </div>
            </div>
          ) : (
            /* Main Studio Preview Canvas */
            <div className="space-y-4 relative">
              <BikePreview modifications={modifications} />
              
              {/* AI loading state screen overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-4 p-8 z-30 animate-fade-in">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
                  <span className="text-sm font-bold text-white font-mono tracking-wider">
                    {["Analyzing your bike...", "Applying your modifications...", "Making the result realistic...", "Your custom bike is ready."][generationStep]}
                  </span>
                  <p className="text-xs text-gray-400 text-center max-w-xs">
                    RideVision is rendering the new configuration while keeping the frame structure intact.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Photo Upload & AI Detection Widget */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload size={16} className="text-brand-orange" />
              Bike Photo Upload
            </h3>
            <p className="text-xs text-gray-400">
              Upload a clear photo of your motorcycle. Your image is stored in your account when the upload completes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Drag and Drop Zone */}
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-white/10 hover:border-brand-orange/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition relative min-h-[140px]"
              >
                <input 
                  type="file" 
                  id="bike-upload" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  accept="image/*"
                />
                {isUploading ? (
                  <div className="space-y-2 text-center w-full">
                    <span className="text-xs font-bold text-brand-orange">Uploading: {uploadProgress}%</span>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-orange transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : uploadedImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={uploadedImage} alt="Upload thumbnail" className="w-16 h-12 object-cover rounded-lg border border-white/10" />
                    <span className="text-[10px] text-brand-orange font-bold hover:underline">Replace Photo</span>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Upload size={24} className="text-gray-400 mx-auto" />
                    <span className="text-xs text-gray-300 block font-semibold">Drag & Drop or Browse file</span>
                    <span className="text-[10px] text-gray-500 block">PNG, JPG, WEBP up to 8MB</span>
                  </div>
                )}
              </div>

              {/* Upload status */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-center min-h-[140px]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-brand-green" />
                    <span className="text-xs font-bold text-white">Account Photo Storage</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{uploadMessage || 'Sign in and upload a photo. It will be stored under your account in Supabase Storage.'}</p>
                  {uploadedImage && <img src={uploadedImage} alt="Uploaded bike" className="w-full h-20 object-cover rounded-lg border border-white/10" />}
                </div>
              </div>
            </div>
          </div>

          {/* Customization Score explanation block */}
          {isGenerated && (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Visual Confidence Score: 92%</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                The generated preview maintains the original bike's proportions while applying your selected modifications. Minor lighting variations might occur depending on background lighting conditions.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Customizer options tabs, budget, assistant */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Customization Category Panels */}
          <div className="glass rounded-2xl overflow-hidden">
            {/* Category tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto">
              {['Paint', 'Wheels', 'Exhaust', 'Seat', 'Accessories'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 text-xs font-bold border-b-2 whitespace-nowrap px-4 transition ${activeTab === tab ? 'text-brand-orange border-brand-orange bg-brand-orange/5' : 'text-gray-400 border-transparent hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content panel */}
            <div className="p-6 space-y-4">
              {/* Filter parts by category */}
              <div className="grid grid-cols-1 gap-2.5">
                {parts.filter(part => part.category === activeTab).map(part => {
                  const compStatus = part.compatibility[selectedBike.model] || part.compatibility['all'];
                  const isSelected = activeTab === 'Accessories' 
                    ? modifications.Accessories.includes(part.id)
                    : modifications[activeTab] === part.id;

                  return (
                    <div 
                      key={part.id}
                      onClick={() => updateModification(activeTab, part.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition duration-200 text-left relative flex justify-between items-center ${isSelected ? 'bg-brand-orange/[0.04] border-brand-orange' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                    >
                      <div className="space-y-1 pr-6">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{part.name}</h4>
                          <span className="text-[10px] text-gray-500 font-mono">{part.brand}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{part.description}</p>
                        
                        {/* Compatibility Tag */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            compStatus === 'Perfect Fit' ? 'bg-green-950/60 border border-green-500/20 text-brand-green' : 
                            compStatus === 'Requires Adapter' ? 'bg-yellow-950/60 border border-yellow-500/20 text-yellow-400' : 
                            'bg-red-950/60 border border-red-500/20 text-brand-red'
                          }`}>
                            {compStatus || 'Compatible'}
                          </span>
                          <span className="text-[9px] text-gray-500">Installation: ₹{part.installationCost}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-white">₹{part.price.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Budget Optimizer Panel */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign size={16} className="text-brand-orange" />
                Budget Configuration
              </h3>
              
              {/* Range Indicator */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${overBudget ? 'bg-red-950 text-brand-red animate-pulse' : 'bg-green-950 text-brand-green'}`}>
                {overBudget ? 'Over Budget' : 'Within Budget'}
              </span>
            </div>

            {/* Budget Modes selector chips */}
            <div className="grid grid-cols-4 gap-2">
              {['Budget', 'Mid Range', 'Premium', 'Custom'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setBudgetMode(mode)}
                  className={`py-2 px-1 rounded-lg text-[10px] font-bold border text-center transition ${budgetMode === mode ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Custom Budget Input if mode is Custom */}
            {budgetMode === 'Custom' && (
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10 animate-slide-up">
                <span className="text-xs text-gray-500">₹</span>
                <input 
                  type="number"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(Number(e.target.value))}
                  className="bg-transparent border-none text-xs text-white focus:outline-none w-full font-bold"
                  placeholder="Enter target budget..."
                />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Target Budget Cap:</span>
                <span className="font-bold text-white">₹{currentLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Current Build Cost:</span>
                <span className={`font-bold ${overBudget ? 'text-brand-red' : 'text-white'}`}>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Cost breakdown progress bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${overBudget ? 'bg-brand-red' : 'bg-brand-green'}`} 
                style={{ width: `${Math.min((total / currentLimit) * 100, 100)}%` }} 
              />
            </div>
            {overBudget && (
              <p className="text-[10px] text-brand-red text-left">
                ⚠️ Your selections exceed the {budgetMode} target limit by ₹{(total - currentLimit).toLocaleString()}. Toggle cheaper parts or accessories to optimize.
              </p>
            )}
          </div>

          {/* Safety warnings alert */}
          {safetyWarnings.length > 0 && (
            <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-4 space-y-2 text-left">
              <div className="flex items-center gap-2 text-brand-orange">
                <AlertTriangle size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Mechanical & Legal Notices</span>
              </div>
              {safetyWarnings.map((warn, index) => (
                <div key={index} className="text-[10px] text-gray-400 border-l-2 border-brand-orange/30 pl-2 leading-relaxed">
                  <strong>{warn.name}</strong>: {warn.text}
                </div>
              ))}
            </div>
          )}

          {/* AI Parts Recommendations Cards */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-brand-orange animate-pulse" />
              Recommended for your {selectedBike.model}
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {recommendedParts.slice(0, 3).map(part => {
                const isAdded = part.category === 'Accessories'
                  ? modifications.Accessories.includes(part.id)
                  : modifications[part.category] === part.id;

                return (
                  <div key={part.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 text-left flex justify-between items-center group">
                    <div className="space-y-1">
                      <span className="text-[8px] bg-brand-orange/10 text-brand-orange font-bold uppercase px-1.5 py-0.5 rounded">
                        {part.matchScore}% Match
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1">{part.name}</h4>
                      <p className="text-[10px] text-gray-500">Brand: {part.brand} // Category: {part.category}</p>
                    </div>

                    <div className="text-right shrink-0 space-y-2">
                      <span className="text-xs font-bold text-white block">₹{part.price.toLocaleString()}</span>
                      <button 
                        onClick={() => updateModification(part.category, part.id)}
                        disabled={isAdded}
                        className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition ${isAdded ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed' : 'bg-brand-orange border-brand-orange text-white hover:opacity-90'}`}
                      >
                        {isAdded ? 'Added' : 'Add to Build'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Chat Assistant Tray button */}
          <div className="relative">
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className="w-full bg-[#121212] hover:bg-[#1a1a1a] border border-white/5 hover:border-brand-orange/30 py-3.5 rounded-xl text-xs font-bold text-gray-200 flex items-center justify-center gap-2 transition"
            >
              <MessageSquare size={16} className="text-brand-orange" />
              Ask AI Customization Assistant
            </button>

            {chatOpen && (
              <div className="absolute bottom-16 right-0 left-0 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-4 z-40 space-y-3 animate-fade-in flex flex-col h-80">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles size={12} className="text-brand-orange" />
                    AI Design Assistant
                  </span>
                  <button onClick={() => setChatOpen(false)} className="text-gray-500 hover:text-white">
                    <X size={14} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-left">
                  {chatHistory.map((ch, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl text-xs max-w-[85%] ${ch.role === 'user' ? 'bg-brand-orange/10 border border-brand-orange/20 text-white ml-auto' : 'bg-white/5 border border-white/5 text-gray-300'}`}>
                      {ch.text}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 border-t border-white/5 pt-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask: 'Make my bike aggressive'..."
                    className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white p-2 rounded-lg transition"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
