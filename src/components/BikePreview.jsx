import React from 'react';

export default function BikePreview({ modifications = {} }) {
  // Extract configuration
  const paintId = modifications.Paint || 'paint-matte-black';
  const wheelsId = modifications.Wheels || 'wheels-alloy-black';
  const exhaustId = modifications.Exhaust || 'exhaust-slip-on';
  const seatId = modifications.Seat || 'seat-touring';
  const lightingId = modifications.Lighting || 'light-led-headlight';
  const accessories = modifications.Accessories || [];

  // Color mapping for paint selection
  const paintColors = {
    'paint-matte-black': '#1a1a1a',
    'paint-racing-red': '#cc0f0f',
    'paint-pearl-white': '#eceef4',
    'paint-british-green': '#0c4631',
    'paint-metallic-blue': '#1248a3',
  };
  const paintColor = paintColors[paintId] || '#1a1a1a';
  const isMatte = paintId === 'paint-matte-black';

  // Toggle flags for accessories
  const hasCrashGuard = accessories.includes('acc-crashguard');
  const hasWindshield = accessories.includes('acc-windshield');
  const hasBarEndMirrors = accessories.includes('acc-mirrors');
  const hasPanniers = accessories.includes('acc-panniers');
  const hasAuxLights = lightingId === 'light-auxiliary';

  return (
    <div className="relative w-full aspect-[16/10] bg-[#0c0c0c] border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden flex items-center justify-center p-4 shadow-2xl">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      {/* Tech Spec Callouts (Decorative futuristic overlays) */}
      <div className="absolute top-4 left-4 text-left">
        <span className="text-[10px] text-brand-orange uppercase tracking-widest font-mono">Dynamic AI Sandbox</span>
        <h3 className="text-sm font-bold text-white font-mono mt-0.5">PLATFORM: MORPH-CRUISER.X1</h3>
      </div>
      
      <div className="absolute bottom-4 left-4 text-[10px] font-mono text-gray-500 hidden md:block">
        GRID: 30x30MM // SCALE 1:12<br />
        SYS_STATUS: READY_FOR_RENDER
      </div>

      <div className="absolute top-4 right-4 text-right hidden md:block text-[10px] font-mono text-gray-500">
        LATENCY: ~1.2s (AI GENERATED PREVIEW)<br />
        FIDELITY: ULTRA-HD 4K
      </div>

      {/* SVG Motorcycle layered container */}
      <div className="w-full max-w-[560px] h-auto relative drop-shadow-[0_10px_30px_rgba(255,107,0,0.1)]">
        <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Shadows */}
          <ellipse cx="400" cy="440" rx="320" ry="20" fill="black" fillOpacity="0.4" filter="blur(8px)" />
          
          {/* Main frame geometry (cruiser backbone) */}
          <path d="M220 380 L350 240 L500 240 L580 320" stroke="#333333" strokeWidth="18" strokeLinecap="round" />
          <path d="M350 240 L380 400 L500 400 L500 240" stroke="#222222" strokeWidth="12" strokeLinecap="round" />
          {/* Swingarm */}
          <path d="M380 400 L210 390" stroke="#444444" strokeWidth="14" strokeLinecap="round" />
          {/* Front forks */}
          <path d="M540 180 L620 390" stroke="#555555" strokeWidth="12" strokeLinecap="round" />
          
          {/* Front Fender */}
          <path d="M570 340 C585 345 615 365 625 395" stroke={paintColor} strokeWidth="12" strokeLinecap="round" />

          {/* Engine block (v-twin cruiser design) */}
          <rect x="360" y="280" width="110" height="110" rx="8" fill="#151515" stroke="#333333" strokeWidth="4" />
          {/* Cylinder fins */}
          <path d="M375 295 H455 M370 310 H460 M370 325 H460 M375 340 H455 M380 355 H450 M390 370 H440" stroke="#444" strokeWidth="5" />
          {/* Crankcase cover */}
          <circle cx="415" cy="360" r="30" fill="#252525" stroke="#444444" strokeWidth="3" />
          <path d="M415 360 L435 340" stroke="#ff6b00" strokeWidth="2" />

          {/* EXHAUST COMPONENT */}
          {exhaustId === 'exhaust-slip-on' && (
            // Slip-on Sport Exhaust
            <g>
              <path d="M380 365 C410 385 450 410 500 410 C530 410 570 390 610 380" stroke="#1c1c1c" strokeWidth="12" strokeLinecap="round" />
              <path d="M570 390 L615 378" stroke="#ff6b00" strokeWidth="10" strokeLinecap="round" /> {/* Akrapovic brand color stripe */}
            </g>
          )}
          {exhaustId === 'exhaust-touring' && (
            // Touring long exhaust
            <path d="M380 365 C420 385 480 412 550 412 L650 412" stroke="#d1d5db" strokeWidth="14" strokeLinecap="round" />
          )}
          {exhaustId === 'exhaust-shorty' && (
            // Shorty raw steel
            <path d="M380 365 C400 375 440 390 470 390 L510 380" stroke="#888888" strokeWidth="16" strokeLinecap="round" />
          )}

          {/* REAR WHEEL */}
          {wheelsId === 'wheels-alloy-black' && (
            <g>
              <circle cx="210" cy="390" r="85" fill="none" stroke="#111" strokeWidth="26" />
              <circle cx="210" cy="390" r="70" fill="none" stroke="#222" strokeWidth="6" />
              {/* Alloy Spokes */}
              <line x1="210" y1="320" x2="210" y2="460" stroke="#222" strokeWidth="8" />
              <line x1="140" y1="390" x2="280" y2="390" stroke="#222" strokeWidth="8" />
              <line x1="160" y1="340" x2="260" y2="440" stroke="#222" strokeWidth="8" />
              <line x1="160" y1="440" x2="260" y2="340" stroke="#222" strokeWidth="8" />
            </g>
          )}
          {wheelsId === 'wheels-spoke-chrome' && (
            <g>
              <circle cx="210" cy="390" r="85" fill="none" stroke="#111" strokeWidth="26" />
              <circle cx="210" cy="390" r="72" fill="none" stroke="#e5e7eb" strokeWidth="4" />
              {/* Chrome Spokes */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const rad = (angle * Math.PI) / 180;
                const x2 = 210 + 72 * Math.cos(rad);
                const y2 = 390 + 72 * Math.sin(rad);
                return <line key={i} x1="210" y1="390" x2={x2} y2={y2} stroke="#cccccc" strokeWidth="1" />;
              })}
            </g>
          )}
          {wheelsId === 'wheels-alloy-performance' && (
            <g>
              <circle cx="210" cy="390" r="85" fill="none" stroke="#0a0a0a" strokeWidth="26" />
              <circle cx="210" cy="390" r="70" fill="none" stroke="#d97706" strokeWidth="6" /> {/* Racing Gold */}
              <line x1="210" y1="320" x2="210" y2="460" stroke="#d97706" strokeWidth="5" />
              <line x1="140" y1="390" x2="280" y2="390" stroke="#d97706" strokeWidth="5" />
              <line x1="160" y1="340" x2="260" y2="440" stroke="#d97706" strokeWidth="5" />
              <line x1="160" y1="440" x2="260" y2="340" stroke="#d97706" strokeWidth="5" />
            </g>
          )}
          {wheelsId === 'wheels-offroad' && (
            <g>
              {/* Knobby tyres */}
              <circle cx="210" cy="390" r="88" fill="none" stroke="#2a2a2a" strokeWidth="32" strokeDasharray="14,14" />
              <circle cx="210" cy="390" r="82" fill="none" stroke="#111" strokeWidth="18" />
              <circle cx="210" cy="390" r="72" fill="none" stroke="#333" strokeWidth="6" />
              {/* Thick spoke structure */}
              <line x1="210" y1="320" x2="210" y2="460" stroke="#333" strokeWidth="10" />
              <line x1="140" y1="390" x2="280" y2="390" stroke="#333" strokeWidth="10" />
            </g>
          )}
          
          {/* Wheel Hub Rear */}
          <circle cx="210" cy="390" r="22" fill="#333" stroke="#444" strokeWidth="2" />
          
          {/* FRONT WHEEL */}
          {wheelsId === 'wheels-alloy-black' && (
            <g>
              <circle cx="620" cy="390" r="85" fill="none" stroke="#111" strokeWidth="22" />
              <circle cx="620" cy="390" r="72" fill="none" stroke="#222" strokeWidth="5" />
              <line x1="620" y1="320" x2="620" y2="460" stroke="#222" strokeWidth="6" />
              <line x1="550" y1="390" x2="690" y2="390" stroke="#222" strokeWidth="6" />
              <line x1="570" y1="340" x2="670" y2="440" stroke="#222" strokeWidth="6" />
              <line x1="570" y1="440" x2="670" y2="340" stroke="#222" strokeWidth="6" />
            </g>
          )}
          {wheelsId === 'wheels-spoke-chrome' && (
            <g>
              <circle cx="620" cy="390" r="85" fill="none" stroke="#111" strokeWidth="22" />
              <circle cx="620" cy="390" r="74" fill="none" stroke="#e5e7eb" strokeWidth="3" />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const rad = (angle * Math.PI) / 180;
                const x2 = 620 + 74 * Math.cos(rad);
                const y2 = 390 + 74 * Math.sin(rad);
                return <line key={i} x1="620" y1="390" x2={x2} y2={y2} stroke="#cccccc" strokeWidth="1" />;
              })}
            </g>
          )}
          {wheelsId === 'wheels-alloy-performance' && (
            <g>
              <circle cx="620" cy="390" r="85" fill="none" stroke="#0a0a0a" strokeWidth="22" />
              <circle cx="620" cy="390" r="72" fill="none" stroke="#d97706" strokeWidth="5" />
              <line x1="620" y1="320" x2="620" y2="460" stroke="#d97706" strokeWidth="4" />
              <line x1="550" y1="390" x2="690" y2="390" stroke="#d97706" strokeWidth="4" />
              <line x1="570" y1="340" x2="670" y2="440" stroke="#d97706" strokeWidth="4" />
              <line x1="570" y1="440" x2="670" y2="340" stroke="#d97706" strokeWidth="4" />
            </g>
          )}
          {wheelsId === 'wheels-offroad' && (
            <g>
              <circle cx="620" cy="390" r="88" fill="none" stroke="#2a2a2a" strokeWidth="26" strokeDasharray="12,12" />
              <circle cx="620" cy="390" r="82" fill="none" stroke="#111" strokeWidth="16" />
              <circle cx="620" cy="390" r="72" fill="none" stroke="#333" strokeWidth="5" />
              <line x1="620" y1="320" x2="620" y2="460" stroke="#333" strokeWidth="8" />
              <line x1="550" y1="390" x2="690" y2="390" stroke="#333" strokeWidth="8" />
            </g>
          )}
          
          {/* Wheel Hub Front */}
          <circle cx="620" cy="390" r="20" fill="#333" stroke="#444" strokeWidth="2" />

          {/* FUEL TANK (Dynamic color rendering based on paint choice) */}
          <g>
            {/* Base tank shape */}
            <path 
              d="M330 230 C360 170 470 170 510 210 C530 230 520 270 480 270 C410 270 350 250 330 230 Z" 
              fill={paintColor} 
              stroke="#111" 
              strokeWidth="4" 
              className="transition-all duration-500"
            />
            {/* Highlights for metallic or glossy depth */}
            {!isMatte && (
              <path 
                d="M365 210 C395 185 450 185 480 205" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeOpacity="0.2" 
              />
            )}
            {/* Decal graphics (electric orange accent stripe) */}
            <path d="M370 238 Q420 250 470 235" stroke="#ff6b00" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Rear Mudguard */}
          <path d="M140 370 C145 320 200 300 250 305" stroke={paintColor} strokeWidth="16" strokeLinecap="round" />

          {/* SEAT COMPONENT */}
          {seatId === 'seat-touring' && (
            // Comfortable long touring seat
            <path 
              d="M230 305 Q280 275 330 270 L345 285 L350 305 Q300 310 240 315 Z" 
              fill="#181818" 
              stroke="#2c2c2c" 
              strokeWidth="3" 
            />
          )}
          {seatId === 'seat-caferaser' && (
            // Cafe Racer tuck and roll leather cowl seat
            <g>
              <path d="M225 305 Q270 280 325 280 L335 305 Q270 310 230 312 Z" fill="#693710" stroke="#482508" strokeWidth="3" />
              <path d="M225 305 C222 290 240 280 255 285 Z" fill={paintColor} stroke="#222" strokeWidth="2" /> {/* Rear hump */}
            </g>
          )}
          {seatId === 'seat-split' && (
            // Sport split seat
            <g>
              {/* Rider Seat */}
              <path d="M280 288 Q315 270 345 275 L350 305 Q310 305 282 308 Z" fill="#202020" stroke="#333" strokeWidth="2" />
              {/* Pillion Seat */}
              <path d="M218 306 Q245 285 275 292 L275 310 Q240 310 218 312 Z" fill="#202020" stroke="#333" strokeWidth="2" />
            </g>
          )}

          {/* Handlebars */}
          <path d="M525 220 L515 150 L470 145" stroke="#333" strokeWidth="10" strokeLinecap="round" />
          <path d="M515 150 L535 152" stroke="#ff6b00" strokeWidth="8" strokeLinecap="round" /> {/* Throttle grip */}

          {/* LIGHTING COMPONENT */}
          <g>
            <circle cx="560" cy="180" r="18" fill="#222" stroke="#444" strokeWidth="2" />
            <path d="M570 170 C585 170 585 190 570 190 Z" fill="#ffefa8" className="animate-pulse" /> {/* LED glow */}
            {/* Aux lights */}
            {hasAuxLights && (
              <g>
                <circle cx="545" cy="225" r="10" fill="#222" stroke="#444" strokeWidth="2" />
                <circle cx="545" cy="225" r="8" fill="#ffd700" opacity="0.9" />
              </g>
            )}
          </g>

          {/* ACCESSORIES PREVIEWS */}
          
          {/* Engine Crash Guard */}
          {hasCrashGuard && (
            <g>
              <path d="M430 260 L450 350 L395 385" stroke="#d1d5db" strokeWidth="8" strokeLinecap="round" fill="none" />
              <circle cx="450" cy="350" r="8" fill="#ff6b00" />
            </g>
          )}

          {/* Tall Windshield */}
          {hasWindshield && (
            <path d="M545 165 C552 110 572 70 580 60" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.4" fill="none" />
          )}

          {/* Bar End Mirrors */}
          {hasBarEndMirrors && (
            <g>
              <path d="M470 145 Q460 120 445 130" stroke="#333" strokeWidth="5" fill="none" />
              <ellipse cx="445" cy="130" rx="14" ry="8" fill="#222" stroke="#444" strokeWidth="2" />
            </g>
          )}

          {/* Panniers Hard Shell */}
          {hasPanniers && (
            <g>
              <rect x="125" y="270" width="85" height="70" rx="8" fill="#2a2a2a" stroke="#111" strokeWidth="4" />
              <line x1="125" y1="290" x2="210" y2="290" stroke="#111" strokeWidth="3" />
            </g>
          )}
        </svg>

        {/* Dynamic AI Spec Overlay Tag */}
        <div className="absolute top-[40%] left-[55%] flex items-center gap-1.5 bg-black/80 border border-brand-orange/40 text-brand-orange px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider font-bold backdrop-blur-sm animate-pulse-glow z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
          EST. BUDGET: ₹{Object.values(modifications).length > 0 ? "Calculated" : "---"}
        </div>
      </div>
    </div>
  );
}
