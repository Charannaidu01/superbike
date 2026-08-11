import React, { useState, useRef, useEffect } from 'react';

export default function BeforeAfterSlider({ beforeImage, afterImage, heightClass = "aspect-[16/10]" }) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${heightClass} rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 shadow-2xl select-none`}
    >
      {/* Before Image (Bottom Layer) */}
      <div className="absolute inset-0 bg-[#0c0c0c] flex items-center justify-center p-4">
        {beforeImage}
        <span className="absolute bottom-4 left-4 bg-black/70 border border-white/10 px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider text-gray-400">
          STOCK / BEFORE
        </span>
      </div>

      {/* After Image (Top Layer with Clip Path) */}
      <div 
        className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center p-4"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        {afterImage}
        <span className="absolute bottom-4 right-4 bg-brand-orange/20 border border-brand-orange/40 px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider text-brand-orange">
          AI CUSTOMIZED / AFTER
        </span>
      </div>

      {/* Draggable Divider Line */}
      <div 
        className="absolute top-0 bottom-0 w-[3px] bg-brand-orange cursor-ew-resize flex items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Grip Handle */}
        <div className="w-8 h-8 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white flex items-center justify-center shadow-lg border border-white/20 select-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 4 4 4m8-8l4 4-4 4" />
          </svg>
        </div>
      </div>

      {/* Slider instructions */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 border border-white/5 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-300 font-mono tracking-wider backdrop-blur-sm pointer-events-none hidden md:block">
        DRAG SLIDER TO COMPARE
      </div>
    </div>
  );
}
