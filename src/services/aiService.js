/**
 * RideVision - Server-side and Client-side AI Service Abstraction
 * Handles motorcycle detection, customization preview generation, parts compatibility,
 * budget recommendations, build planning, and chat assistant logic.
 */

// Comprehensive Parts Catalog with Compatibility Map
export const PARTS_CATALOG = [
  // Paint Options
  { id: 'paint-matte-black', category: 'Paint', name: 'Matte Black Finish', brand: 'RideVision Custom', price: 8000, compatibility: { all: true }, description: 'Sleek, low-reflectivity stealth paint job.', installationCost: 1500, rating: 4.8 },
  { id: 'paint-racing-red', category: 'Paint', name: 'Racing Gloss Red', brand: 'Nippon Paint', price: 7500, compatibility: { all: true }, description: 'High-gloss active crimson red paint finish.', installationCost: 1500, rating: 4.6 },
  { id: 'paint-pearl-white', category: 'Paint', name: 'Pearl Metallic White', brand: 'RideVision Custom', price: 9000, compatibility: { all: true }, description: 'Premium iridescent multi-layer white paint.', installationCost: 1500, rating: 4.7 },
  { id: 'paint-british-green', category: 'Paint', name: 'Classic British Racing Green', brand: 'Classic Colors', price: 8500, compatibility: { all: true }, description: 'Glossy deep heritage green paint.', installationCost: 1500, rating: 4.9 },
  { id: 'paint-metallic-blue', category: 'Paint', name: 'Metallic Cobalt Blue', brand: 'DuPont Automotive', price: 8200, compatibility: { all: true }, description: 'Vibrant cobalt blue with premium metallic flake.', installationCost: 1500, rating: 4.5 },

  // Wheels Options
  { id: 'wheels-alloy-black', category: 'Wheels', name: 'Premium Black Alloy Wheels', brand: 'AlloyTech', price: 14000, compatibility: { 'Royal Enfield Classic 350': 'Perfect Fit', 'Honda CB350': 'Perfect Fit', 'Yamaha MT-15': 'Requires Adapter', 'KTM Duke 390': 'Not Recommended' }, description: 'Lightweight multi-spoke alloy wheels with a matte finish.', installationCost: 2000, rating: 4.9 },
  { id: 'wheels-spoke-chrome', category: 'Wheels', name: 'Classic Chrome Spoke Wheels', brand: 'SpokeCrafters', price: 11000, compatibility: { 'Royal Enfield Classic 350': 'Perfect Fit', 'Honda CB350': 'Perfect Fit', 'Yamaha MT-15': 'Not Recommended', 'KTM Duke 390': 'Not Recommended' }, description: 'Heavy-duty steel spokes with high-shine chrome plating.', installationCost: 2500, rating: 4.4 },
  { id: 'wheels-alloy-performance', category: 'Wheels', name: 'Forged Performance Alloy Wheels', brand: 'Enkei Moto', price: 22000, compatibility: { 'Yamaha MT-15': 'Perfect Fit', 'KTM Duke 390': 'Perfect Fit', 'Royal Enfield Classic 350': 'Requires Adapter' }, description: 'Ultra-lightweight forged alloy wheels built for racing dynamics.', installationCost: 1800, rating: 4.8 },
  { id: 'wheels-offroad', category: 'Wheels', name: 'Knobby Off-road Wheels & Rims', brand: 'Mitas', price: 16500, compatibility: { 'Royal Enfield Classic 350': 'Requires Adapter', 'KTM Duke 390': 'Requires Adapter' }, description: 'Reinforced rims with heavy knobby tread for loose terrain.', installationCost: 2200, rating: 4.7 },

  // Exhaust Options
  { id: 'exhaust-slip-on', category: 'Exhaust', name: 'Slip-on Performance Exhaust', brand: 'Akrapovic', price: 12000, compatibility: { 'Royal Enfield Classic 350': 'Perfect Fit', 'Honda CB350': 'Perfect Fit', 'Yamaha MT-15': 'Perfect Fit', 'KTM Duke 390': 'Perfect Fit' }, description: 'Premium carbon-tip slip-on muffler with deep bass note.', installationCost: 800, rating: 4.8, safetyNotice: 'Ensure local sound regulations are met. Db-killer included.' },
  { id: 'exhaust-touring', category: 'Exhaust', name: 'Silent Cruiser Touring Exhaust', brand: 'Red Rooster', price: 9500, compatibility: { 'Royal Enfield Classic 350': 'Perfect Fit', 'Honda CB350': 'Perfect Fit' }, description: 'Long-bottle chrome exhaust engineered for smooth highway rides.', installationCost: 1000, rating: 4.6 },
  { id: 'exhaust-shorty', category: 'Exhaust', name: 'Short Raw Steel Exhaust', brand: 'CustomMoto', price: 7000, compatibility: { 'Royal Enfield Classic 350': 'Requires Adapter', 'Yamaha MT-15': 'Perfect Fit' }, description: 'Loud, short-canister exhaust with aggressive power output.', installationCost: 1200, rating: 4.2, safetyNotice: 'Increases engine emissions. Check street legality.' },

  // Seat Options
  { id: 'seat-touring', category: 'Seat', name: 'Touring Comfort Dual Seat', brand: 'Sahara Seats', price: 4500, compatibility: { 'Royal Enfield Classic 350': 'Perfect Fit', 'Honda CB350': 'Perfect Fit', 'Yamaha MT-15': 'Requires Adapter' }, description: 'Ergonomic bucket design with high-density memory foam.', installationCost: 300, rating: 4.9 },
  { id: 'seat-caferaser', category: 'Seat', name: 'Cafe Racer Tuck-and-Roll Seat', brand: 'RideVision Custom', price: 3800, compatibility: { 'Royal Enfield Classic 350': 'Requires Adapter', 'Honda CB350': 'Perfect Fit' }, description: 'Short brown leather tuck-and-roll single seat with tail cowl.', installationCost: 500, rating: 4.5 },
  { id: 'seat-split', category: 'Seat', name: 'Sport Split-Seat Setup', brand: 'SeatTech', price: 5200, compatibility: { 'Yamaha MT-15': 'Perfect Fit', 'KTM Duke 390': 'Perfect Fit' }, description: 'Dual-step styling split seats for rider and pillion comfort.', installationCost: 400, rating: 4.7 },

  // Lighting Options
  { id: 'light-led-headlight', category: 'Lighting', name: 'LED Projector Headlight V2', brand: 'MadDog', price: 3800, compatibility: { all: true }, description: 'High-luminance multi-lens LED headlight with circular DRL ring.', installationCost: 500, rating: 4.9, safetyNotice: 'Ensure correct vertical aim to avoid blinding oncoming traffic.' },
  { id: 'light-auxiliary', category: 'Lighting', name: 'Touring Dual Aux Lights (Pair)', brand: 'HJG', price: 5500, compatibility: { all: true }, description: 'Powerful 60W auxiliary fog lights with yellow/white toggle.', installationCost: 800, rating: 4.7 },

  // Accessories Options
  { id: 'acc-crashguard', category: 'Accessories', name: 'Airfly Engine Crash Guard', brand: 'RE Genuine', price: 3200, compatibility: { 'Royal Enfield Classic 350': 'Perfect Fit', 'Honda CB350': 'Perfect Fit' }, description: 'Sturdy steel tube frame protection with custom logo styling.', installationCost: 400, rating: 4.8 },
  { id: 'acc-panniers', category: 'Accessories', name: 'Stealth Touring Panniers (Pair)', brand: 'Viaterra', price: 9800, compatibility: { 'Royal Enfield Classic 350': 'Requires Adapter', 'Honda CB350': 'Requires Adapter', 'KTM Duke 390': 'Requires Adapter' }, description: 'Waterproof hard-shell adventure panniers, 24L capacity each.', installationCost: 1200, rating: 4.9 },
  { id: 'acc-windshield', category: 'Accessories', name: 'Touring Tall Windshield', brand: 'Carbon Racing', price: 2800, compatibility: { 'Royal Enfield Classic 350': 'Perfect Fit', 'Honda CB350': 'Perfect Fit', 'KTM Duke 390': 'Requires Adapter' }, description: 'Tall aerodynamic shield to minimize wind blast at high speed.', installationCost: 300, rating: 4.6 },
  { id: 'acc-mirrors', category: 'Accessories', name: 'CNC Bar-end Mirrors', brand: 'Rizoma', price: 2500, compatibility: { all: true }, description: 'Aluminum bar-end mirrors with glare-reduction glass.', installationCost: 200, rating: 4.7 },
  { id: 'acc-phonemount', category: 'Accessories', name: 'Vibration Dampened Phone Mount', brand: 'Quad Lock', price: 3500, compatibility: { all: true }, description: 'Premium handlebar phone mount with built-in vibration dampening.', installationCost: 200, rating: 4.9 }
];

export const BIKE_MODELS_DB = [
  { id: 're-classic-350', manufacturer: 'Royal Enfield', model: 'Classic 350', category: 'Cruiser', yearRange: '2020 - Present', engine: '349cc Single-Cylinder', imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop' },
  { id: 'yamaha-mt15', manufacturer: 'Yamaha', model: 'MT-15', category: 'Naked', yearRange: '2019 - Present', engine: '155cc Liquid-Cooled VVA', imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop' },
  { id: 'ktm-duke-390', manufacturer: 'KTM', model: 'Duke 390', category: 'Sport', yearRange: '2018 - Present', engine: '373cc Liquid-Cooled DOHC', imageUrl: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop' },
  { id: 'honda-cb350', manufacturer: 'Honda', model: 'CB350 H\'ness', category: 'Retro', yearRange: '2021 - Present', engine: '348cc Air-Cooled OHC', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop' }
];

export const aiService = {
  /**
   * Identifies the motorcycle in the uploaded image.
   * Simulates deep neural network classification.
   * @param {File|string} image - Image file or URL
   */
  async detectBike(image) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock detection algorithm
        resolve({
          detected: true,
          manufacturer: 'Royal Enfield',
          model: 'Classic 350',
          variant: 'Chrome Black',
          year: 2022,
          category: 'Cruiser',
          confidence: 0.96,
          message: 'Royal Enfield Classic 350 identified with high confidence.'
        });
      }, 1500);
    });
  },

  /**
   * Generates a photorealistic preview matching modifications.
   * Simulates diffusion-based image-to-image editing.
   */
  async generateCustomization(bikeModelName, modifications) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a response including status and confidence
        resolve({
          status: 'success',
          confidence: 0.92,
          notes: 'Render created preserving exact geometric lines. Modifications blended successfully.',
          visualUrl: null // Studio will handle dynamic canvas rendering based on parts
        });
      }, 2000);
    });
  },

  /**
   * Recommends matching parts based on rider profile and budget constraints.
   */
  recommendParts(bikeModel, ridingStyle, budgetLimit = Infinity) {
    // 1. Filter by model compatibility
    let filtered = PARTS_CATALOG.filter(part => {
      const comp = part.compatibility[bikeModel] || part.compatibility['all'];
      return comp && comp !== 'Not Recommended';
    });

    // 2. Adjust scoring based on Riding Style
    return filtered.map(part => {
      let score = 90; // base score

      // Riding style adjustments
      if (ridingStyle === 'Touring') {
        if (part.id.includes('touring') || part.category === 'Accessories' && part.id.includes('pannier') || part.id.includes('windshield') || part.id.includes('auxiliary')) {
          score += 8;
        }
      } else if (ridingStyle === 'Performance') {
        if (part.id.includes('performance') || part.id.includes('slip-on') || part.id.includes('shorty')) {
          score += 8;
        }
      } else if (ridingStyle === 'Daily Commute' || ridingStyle === 'City Riding') {
        if (part.id.includes('comfort') || part.id.includes('phonemount') || part.id.includes('crashguard')) {
          score += 7;
        }
      }

      // Cap compatibility score at 99
      part.matchScore = Math.min(score, 99);
      return part;
    }).filter(part => part.price <= budgetLimit)
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  /**
   * Recommends a full custom configuration optimized for a set budget
   */
  generateBuild(bikeModel, ridingStyle, maxBudget) {
    let compatibleParts = this.recommendParts(bikeModel, ridingStyle);
    let build = {
      Paint: null,
      Wheels: null,
      Exhaust: null,
      Seat: null,
      Lighting: null,
      Accessories: []
    };
    
    let totalCost = 0;
    
    // Group parts by category to select
    const categorised = compatibleParts.reduce((acc, part) => {
      if (!acc[part.category]) acc[part.category] = [];
      acc[part.category].push(part);
      return acc;
    }, {});

    // Helper to add parts while keeping budget in check
    const tryAddPart = (category) => {
      if (!categorised[category] || categorised[category].length === 0) return;
      const part = categorised[category][0]; // Pick highest matching score
      if (totalCost + part.price + part.installationCost <= maxBudget) {
        build[category] = part;
        totalCost += part.price + part.installationCost;
      }
    };

    // Attempt critical parts first
    tryAddPart('Paint');
    tryAddPart('Wheels');
    tryAddPart('Exhaust');
    tryAddPart('Seat');
    tryAddPart('Lighting');

    // Add accessories as budget permits
    if (categorised['Accessories']) {
      for (const part of categorised['Accessories']) {
        if (totalCost + part.price + part.installationCost <= maxBudget) {
          build.Accessories.push(part);
          totalCost += part.price + part.installationCost;
        }
      }
    }

    return {
      build,
      totalCost,
      remaining: maxBudget - totalCost
    };
  },

  /**
   * Explains recommendations contextually.
   */
  explainRecommendation(partId, ridingStyle) {
    const part = PARTS_CATALOG.find(p => p.id === partId);
    if (!part) return '';

    let bulletPoints = [
      `Matches the dimensions of your motorcycle.`,
      `Estimated installation time: ~45 mins (Labour cost: ₹${part.installationCost}).`
    ];

    if (ridingStyle === 'Touring' && (part.id.includes('touring') || part.id.includes('pannier') || part.id.includes('windshield'))) {
      bulletPoints.unshift(`Optimized for wind-deflection, luggage storage, and long hours in the saddle.`);
    }

    if (part.id.includes('matte-black')) {
      bulletPoints.unshift(`Complements a rugged, stealth, black-out aesthetic theme.`);
    }

    if (part.id.includes('alloy-black')) {
      bulletPoints.unshift(`Provides tubeless tyre compatibility for hassle-free long rides.`);
    }

    if (part.id.includes('exhaust-slip-on')) {
      bulletPoints.unshift(`Improves mid-range torque and delivers a deep, signature thump.`);
    }

    return {
      partName: part.name,
      reasons: bulletPoints
    };
  },

  /**
   * Simple chatbot engine to handle customization prompts.
   */
  chatAssistantResponse(userMessage, context = {}) {
    const msg = userMessage.toLowerCase();
    const currentBike = context.bike || 'Royal Enfield Classic 350';
    const currentBudget = context.budget || 50000;

    if (msg.includes('aggressive') || msg.includes('sport')) {
      return {
        reply: `To give your ${currentBike} a more aggressive stance, I recommend upgrading to forged/black alloys, switching to a matte-black paint job, installing bar-end mirrors, and fitting a performance slip-on exhaust. This creates a meaner, blacked-out cafe/street fighter silhouette.`,
        action: {
          modifications: {
            Paint: 'paint-matte-black',
            Wheels: 'wheels-alloy-black',
            Exhaust: 'exhaust-slip-on',
            Accessories: ['acc-mirrors']
          }
        }
      };
    }

    if (msg.includes('touring') || msg.includes('long ride') || msg.includes('highway')) {
      return {
        reply: `For long-distance touring on your ${currentBike}, comfort and wind protection are key. I highly suggest adding a Touring Comfort Dual Seat, Tall Windshield, auxiliary fog lights, stealth panniers, and a vibration-dampened phone mount.`,
        action: {
          modifications: {
            Seat: 'seat-touring',
            Lighting: 'light-auxiliary',
            Accessories: ['acc-windshield', 'acc-panniers', 'acc-phonemount']
          }
        }
      };
    }

    if (msg.includes('budget') || msg.includes('under') || msg.includes('cost')) {
      // Find pricing patterns
      const numbers = msg.match(/\d+/g);
      const budgetLimit = numbers ? parseInt(numbers[0]) * (msg.includes('k') ? 1000 : 1) : currentBudget;
      const buildResult = this.generateBuild(currentBike, context.style || 'City Riding', budgetLimit);
      
      const partsList = [];
      if (buildResult.build.Paint) partsList.push(buildResult.build.Paint.name);
      if (buildResult.build.Wheels) partsList.push(buildResult.build.Wheels.name);
      if (buildResult.build.Exhaust) partsList.push(buildResult.build.Exhaust.name);
      if (buildResult.build.Seat) partsList.push(buildResult.build.Seat.name);
      buildResult.build.Accessories.forEach(acc => partsList.push(acc.name));

      return {
        reply: `I have compiled an optimized build for you under ₹${budgetLimit.toLocaleString()}. Total build estimate (with labor) is ₹${buildResult.totalCost.toLocaleString()}.\nIncluded upgrades: ${partsList.join(', ')}.`,
        action: {
          modifications: Object.keys(buildResult.build).reduce((acc, key) => {
            if (key === 'Accessories') {
              acc[key] = buildResult.build[key].map(p => p.id);
            } else if (buildResult.build[key]) {
              acc[key] = buildResult.build[key].id;
            }
            return acc;
          }, {})
        }
      };
    }

    return {
      reply: `I can help you build your custom ${currentBike}. Tell me your style preference (e.g., 'aggressive look', 'touring setup') or give me a budget target (e.g., 'under ₹30,000') and I'll configure it instantly!`,
      action: null
    };
  }
};
