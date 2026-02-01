import { useEffect, useState } from 'react';

const Loader = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show loader for 3 seconds then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onLoadingComplete) {
        setTimeout(onLoadingComplete, 500); // Wait for fade animation
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-brand-black flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* SVG Definitions */}
      <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="grad1">
            <stop stopColor="#DC2626"></stop>
            <stop stopColor="#FFFFFF" offset="1"></stop>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="grad2">
            <stop stopColor="#FFFFFF"></stop>
            <stop stopColor="#DC2626" offset="1"></stop>
            <animateTransform
              repeatCount="indefinite"
              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
              keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
              dur="8s"
              values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
              type="rotate"
              attributeName="gradientTransform"
            />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="grad3">
            <stop stopColor="#000000"></stop>
            <stop stopColor="#DC2626" offset="1"></stop>
          </linearGradient>
        </defs>
      </svg>

      {/* MTBCUTZ Letters */}
      <div className="flex items-center gap-0 sm:gap-1">
        {/* M */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad1)" d="M 8,56 V 8 L 32,32 L 56,8 V 56" className="dash" pathLength="360"></path>
        </svg>

        {/* T */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad2)" d="M 8,8 H 56 M 32,8 V 56" className="dash" pathLength="360"></path>
        </svg>

        {/* B */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad3)" d="M 12,8 H 42 Q 52,8 52,18 Q 52,28 42,32 H 12 H 44 Q 56,32 56,44 Q 56,56 44,56 H 12 V 8" className="dash" pathLength="360"></path>
        </svg>

        {/* C */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="10" stroke="url(#grad1)" d="M 52,16 A 20,20 0 1 0 52,48" className="spin" pathLength="360"></path>
        </svg>

        {/* U */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad2)" d="M 8,8 V 40 Q 8,56 24,56 Q 40,56 40,56 Q 56,56 56,40 V 8" className="dash" pathLength="360"></path>
        </svg>

        {/* T */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad3)" d="M 8,8 H 56 M 32,8 V 56" className="dash" pathLength="360"></path>
        </svg>

        {/* Z */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad1)" d="M 8,8 H 56 L 8,56 H 56" className="dash" pathLength="360"></path>
        </svg>
      </div>
    </div>
  );
};

export default Loader;
