import React from 'react';

interface CardMascotArtProps {
  cardId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardMascotArt: React.FC<CardMascotArtProps> = ({
  cardId,
  size = 'md',
  className = '',
}) => {
  const pixelSize = {
    sm: 96,
    md: 140,
    lg: 190,
  }[size];

  switch (cardId) {
    case 'tien-phong':
      // HỆ TIÊN PHONG: Cyber Pioneer Hero with lightning visor & rocket wings
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_0_16px_rgba(0,240,255,0.7)] ${className}`}
        >
          {/* Energy Halo & Lightning Sparkles */}
          <circle cx="100" cy="100" r="88" stroke="#00F0FF" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" className="animate-[spin_12s_linear_infinite]" />
          <path d="M40 30 L46 44 L32 46 L48 68 L44 54 L58 52 Z" fill="#FFD700" className="animate-pulse" />
          <path d="M165 130 L171 144 L157 146 L173 168 L169 154 L183 152 Z" fill="#00F0FF" className="animate-pulse" />
          
          {/* Rocket Wings */}
          <path d="M45 125 C30 110 32 80 50 75 C52 95 60 115 70 125 Z" fill="url(#tp-wing-l)" />
          <path d="M155 125 C170 110 168 80 150 75 C148 95 140 115 130 125 Z" fill="url(#tp-wing-r)" />
          
          {/* Hero Head / Helmet */}
          <circle cx="100" cy="95" r="48" fill="#071936" stroke="#00F0FF" strokeWidth="3.5" />
          
          {/* Pioneer Visor Goggles (Curved glowing cyan/gold) */}
          <path d="M68 85 Q100 75 132 85 Q135 105 100 106 Q65 105 68 85 Z" fill="url(#tp-visor)" stroke="#FFD700" strokeWidth="2" />
          <line x1="75" y1="88" x2="95" y2="88" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          
          {/* Cute Face details: heroic confident grin */}
          <path d="M92 118 Q100 125 108 118" stroke="#00F0FF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="78" cy="116" r="4" fill="#00F0FF" opacity="0.3" />
          <circle cx="122" cy="116" r="4" fill="#00F0FF" opacity="0.3" />

          {/* Pioneer Forehead Crest / Lightning Sigil */}
          <path d="M96 52 L106 52 L100 64 L108 64 L92 80 L96 68 L88 68 Z" fill="#FFD700" />

          {/* Jetpack Exhaust Flames */}
          <path d="M85 145 Q100 175 100 185 Q100 175 115 145 Z" fill="url(#tp-flame)" className="animate-bounce" />

          <defs>
            <linearGradient id="tp-visor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#0088FF" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <linearGradient id="tp-wing-l" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#091834" />
            </linearGradient>
            <linearGradient id="tp-wing-r" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#091834" />
            </linearGradient>
            <linearGradient id="tp-flame" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FF5500" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'ket-noi':
      // HỆ KẾT NỐI: Friendly Social Bot with antenna hearts and floating network nodes
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_0_16px_rgba(123,97,255,0.7)] ${className}`}
        >
          {/* Orbiting Network Satellite Nodes */}
          <circle cx="100" cy="100" r="75" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
          <circle cx="35" cy="85" r="10" fill="#7B61FF" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="165" cy="85" r="10" fill="#00F0FF" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="100" cy="175" r="8" fill="#FF55A3" stroke="#FFFFFF" strokeWidth="2" />
          
          {/* Antenna with Glowing Heart Beacon */}
          <line x1="100" y1="62" x2="100" y2="40" stroke="#7B61FF" strokeWidth="4" strokeLinecap="round" />
          <path d="M100 42 C92 30 80 38 88 48 L100 58 L112 48 C120 38 108 30 100 42 Z" fill="#FF4081" className="animate-pulse" />

          {/* Cute Curved Robot Head */}
          <rect x="58" y="62" width="84" height="74" rx="28" fill="#130D32" stroke="#7B61FF" strokeWidth="3.5" />
          
          {/* Cyber Face Screen */}
          <rect x="68" y="72" width="64" height="52" rx="18" fill="#06031A" stroke="#C084FC" strokeWidth="1.5" />
          
          {/* Joyful Star / Curve Eyes */}
          <path d="M78 88 Q85 80 92 88" stroke="#00F0FF" strokeWidth="4" strokeLinecap="round" />
          <path d="M108 88 Q115 80 122 88" stroke="#00F0FF" strokeWidth="4" strokeLinecap="round" />

          {/* Happy Open Smile */}
          <path d="M92 104 Q100 114 108 104" stroke="#FF4081" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="74" cy="102" r="4" fill="#FF69B4" opacity="0.6" />
          <circle cx="126" cy="102" r="4" fill="#FF69B4" opacity="0.6" />

          {/* Network Signal Waves */}
          <path d="M42 60 Q32 75 42 90" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M158 60 Q168 75 158 90" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        </svg>
      );

    case 'kien-tao':
      // HỆ KIẾN TẠO: Master Mecha Builder with Blueprint Monocle & Floating Cubes
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_0_16px_rgba(245,158,11,0.7)] ${className}`}
        >
          {/* Architectural Blueprint Grid Background */}
          <circle cx="100" cy="100" r="82" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 4" opacity="0.3" />
          
          {/* Floating Isometric Cyber Building Blocks */}
          <g transform="translate(30, 45) scale(0.65)" className="animate-pulse">
            <path d="M25 0 L50 14 L25 28 L0 14 Z" fill="#FBBF24" />
            <path d="M0 14 L25 28 L25 56 L0 42 Z" fill="#D97706" />
            <path d="M50 14 L25 28 L25 56 L50 42 Z" fill="#B45309" />
          </g>
          <g transform="translate(135, 120) scale(0.65)" className="animate-pulse">
            <path d="M25 0 L50 14 L25 28 L0 14 Z" fill="#00E5BC" />
            <path d="M0 14 L25 28 L25 56 L0 42 Z" fill="#059669" />
            <path d="M50 14 L25 28 L25 56 L50 42 Z" fill="#047857" />
          </g>

          {/* Builder Head with Hardhat Ears */}
          <rect x="62" y="68" width="76" height="70" rx="22" fill="#1C1304" stroke="#F59E0B" strokeWidth="3.5" />
          
          {/* Safety Hardhat Visor */}
          <path d="M54 68 Q100 48 146 68 L142 80 Q100 66 58 80 Z" fill="#F59E0B" />

          {/* Dual Precision Eyepiece / Blueprint Monocle */}
          <circle cx="84" cy="98" r="14" fill="#000" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="84" cy="98" r="6" fill="#00E5BC" />
          <circle cx="116" cy="98" r="14" fill="#000" stroke="#00E5BC" strokeWidth="3" />
          <line x1="110" y1="98" x2="122" y2="98" stroke="#00E5BC" strokeWidth="2" />
          <line x1="116" y1="92" x2="116" y2="104" stroke="#00E5BC" strokeWidth="2" />
          
          {/* Confident Maker Smirk */}
          <path d="M94 122 Q106 128 114 120" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />

          {/* Laser Stylus / Tool in Hand */}
          <rect x="142" y="70" width="8" height="42" rx="4" transform="rotate(30 142 70)" fill="#F59E0B" stroke="#FFF" strokeWidth="1" />
          <circle cx="160" cy="112" r="4" fill="#00F0FF" className="animate-ping" />
        </svg>
      );

    case 'kham-pha':
      // HỆ KHÁM PHÁ: Cosmic Chibi Astronaut with Nebula Visor & Ringed Planet
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_0_16px_rgba(59,130,246,0.7)] ${className}`}
        >
          {/* Orbiting Planet with Cosmic Rings */}
          <g transform="translate(138, 38) scale(0.6)">
            <circle cx="30" cy="30" r="18" fill="#EC4899" />
            <ellipse cx="30" cy="30" rx="36" ry="10" stroke="#60A5FA" strokeWidth="3" transform="rotate(-25 30 30)" fill="none" />
          </g>

          {/* Distant Twinkling Stars */}
          <path d="M40 50 L43 58 L51 61 L43 64 L40 72 L37 64 L29 61 L37 58 Z" fill="#FDE047" className="animate-pulse" />
          <circle cx="50" cy="140" r="3" fill="#60A5FA" />
          <circle cx="160" cy="150" r="2.5" fill="#FFFFFF" />

          {/* Astronaut Space Helmet */}
          <circle cx="100" cy="98" r="50" fill="#051229" stroke="#3B82F6" strokeWidth="3.5" />
          
          {/* Nebula Curved Bubble Visor */}
          <rect x="66" y="72" width="68" height="52" rx="24" fill="url(#kp-nebula)" stroke="#60A5FA" strokeWidth="2" />
          
          {/* Visor Glint reflection */}
          <ellipse cx="82" cy="84" rx="10" ry="5" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 82 84)" />
          
          {/* Cute Big Sparkle Eyes visible inside helmet */}
          <circle cx="86" cy="98" r="6" fill="#FFFFFF" />
          <circle cx="88" cy="96" r="2" fill="#051229" />
          <circle cx="114" cy="98" r="6" fill="#FFFFFF" />
          <circle cx="116" cy="96" r="2" fill="#051229" />

          {/* Joyful mouth */}
          <path d="M96 110 Q100 115 104 110" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Small Star Compass on top */}
          <path d="M100 36 L103 44 L111 44 L105 49 L107 57 L100 52 L93 57 L95 49 L89 44 L97 44 Z" fill="#FDE047" />

          <defs>
            <linearGradient id="kp-nebula" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'chien-luoc':
      // HỆ CHIẾN LƯỢC: Cyber Tactician Fox / Agent with Holographic Chess Crown & Monocle
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_0_16px_rgba(99,102,241,0.7)] ${className}`}
        >
          {/* Circular Cyber Matrix Radar */}
          <circle cx="100" cy="100" r="82" stroke="#6366F1" strokeWidth="2" strokeDasharray="4 8" opacity="0.4" className="animate-[spin_20s_linear_infinite]" />
          
          {/* Tactical Monocle Data Streams */}
          <circle cx="78" cy="96" r="18" fill="#0A0C22" stroke="#6366F1" strokeWidth="3" />
          <circle cx="78" cy="96" r="10" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="78" cy="96" r="4" fill="#00F0FF" />
          
          {/* Right Smart Winking Eye */}
          <path d="M112 96 Q122 88 132 96" stroke="#C7D2FE" strokeWidth="4" strokeLinecap="round" />
          
          {/* Sleek Mask / High Collar Head */}
          <path d="M58 80 Q100 60 142 80 L142 120 Q100 155 58 120 Z" fill="#0D1130" stroke="#818CF8" strokeWidth="3" />

          {/* Floating Hologram Chess King Piece */}
          <g transform="translate(86, 26) scale(0.9)" className="animate-bounce">
            <path d="M14 0 L18 0 L18 6 L24 6 L24 10 L18 10 L18 16 L14 16 L14 10 L8 10 L8 6 L14 6 Z" fill="#00F0FF" />
            <path d="M6 18 Q16 12 26 18 L24 30 L8 30 Z" fill="#6366F1" stroke="#00F0FF" strokeWidth="1.5" />
            <rect x="4" y="30" width="24" height="4" rx="2" fill="#00F0FF" />
          </g>

          {/* Confident Mastermind Smile */}
          <path d="M92 128 Q102 136 112 126" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'but-pha':
      // HỆ BỨT PHÁ: Turbo Jet Runner with Supersonic Flames & Sonic Boom Rings
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_0_18px_rgba(255,85,0,0.8)] ${className}`}
        >
          {/* Sonic Boom Expanding Rings */}
          <ellipse cx="100" cy="100" rx="85" ry="50" stroke="#FF5500" strokeWidth="3" opacity="0.5" transform="rotate(-15 100 100)" className="animate-ping [animation-duration:1.5s]" />
          <ellipse cx="100" cy="100" rx="65" ry="38" stroke="#FFB800" strokeWidth="2" opacity="0.6" transform="rotate(-15 100 100)" />

          {/* Speed Trail Lines */}
          <line x1="20" y1="65" x2="60" y2="65" stroke="#FF5500" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="100" x2="55" y2="100" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" />
          <line x1="25" y1="135" x2="65" y2="135" stroke="#FF5500" strokeWidth="3" strokeLinecap="round" />

          {/* Dynamic Angled Turbo Head */}
          <g transform="rotate(8 100 100)">
            <rect x="68" y="65" width="78" height="70" rx="24" fill="#240A00" stroke="#FF5500" strokeWidth="3.5" />
            
            {/* Supersonic Flame Visor */}
            <path d="M72 82 Q106 68 142 82 L138 102 Q106 90 74 102 Z" fill="url(#bp-flame)" stroke="#FFF" strokeWidth="1.5" />
            
            {/* Intense Racing Eyes */}
            <circle cx="90" cy="92" r="4" fill="#FFFFFF" />
            <circle cx="124" cy="92" r="4" fill="#FFFFFF" />

            {/* Fierce Energetic Grin */}
            <path d="M92 118 Q108 128 124 116" stroke="#FFB800" strokeWidth="3.5" strokeLinecap="round" />

            {/* Nitro Boost Crown Horns */}
            <path d="M70 65 L60 40 L84 58 Z" fill="#FF5500" />
            <path d="M144 65 L154 40 L130 58 Z" fill="#FF5500" />
          </g>

          <defs>
            <linearGradient id="bp-flame" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF5500" />
              <stop offset="50%" stopColor="#FFB800" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'truyen-cam-hung':
      // HỆ TRUYỀN CẢM HỨNG: Cyber Stage MC / Radiant Idol with Neon Megaphone & Music Chimes
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_0_18px_rgba(244,63,94,0.8)] ${className}`}
        >
          {/* Radiant Halo Rays */}
          <circle cx="100" cy="96" r="78" stroke="#F43F5E" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" className="animate-[spin_15s_linear_infinite]" />
          
          {/* Floating Musical Notes & Stars */}
          <path d="M40 65 C40 55 52 50 60 58 L60 80 C56 78 50 78 46 82 C40 88 44 96 52 94 C60 92 62 84 62 76 L62 56 L42 62 Z" fill="#F43F5E" className="animate-bounce" />
          <path d="M152 45 L155 52 L162 55 L155 58 L152 65 L149 58 L142 55 L149 52 Z" fill="#FDE047" className="animate-pulse" />

          {/* Joyful Head / Star Hairpins */}
          <circle cx="100" cy="96" r="46" fill="#200511" stroke="#F43F5E" strokeWidth="3.5" />
          
          {/* Sparkling Starlight Eyes */}
          <path d="M84 90 L86 96 L92 98 L86 100 L84 106 L82 100 L76 98 L82 96 Z" fill="#FFF" />
          <path d="M116 90 L118 96 L124 98 L118 100 L116 106 L114 100 L108 98 L114 96 Z" fill="#FFF" />

          {/* Big Radiant Cheerful Smile */}
          <path d="M88 114 Q100 130 112 114 Z" fill="#F43F5E" />
          <circle cx="76" cy="112" r="5" fill="#FB7185" opacity="0.6" />
          <circle cx="124" cy="112" r="5" fill="#FB7185" opacity="0.6" />

          {/* Glowing Neon Cyber Megaphone in front */}
          <g transform="translate(125, 105) rotate(15)">
            <path d="M0 8 L24 0 L24 24 L0 16 Z" fill="#F43F5E" stroke="#FFF" strokeWidth="1.5" />
            <ellipse cx="24" cy="12" rx="4" ry="12" fill="#FDE047" />
            <path d="M28 6 Q36 12 28 18" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      );

    case 'tu-do':
      // HỆ TỰ DO: Chill Sky Surfer on Hoverboard with Retro Sunglasses & Wings
      return (
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-[0_0_16px_rgba(16,185,129,0.7)] ${className}`}
        >
          {/* Breezy Cloud & Wind Swirls */}
          <path d="M30 65 Q55 45 80 60 Q105 45 130 65" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
          <path d="M60 165 Q100 145 140 165 Q170 150 185 160" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Solar Glider Wings */}
          <path d="M35 90 C20 70 45 60 70 80 Z" fill="#059669" opacity="0.8" />
          <path d="M165 90 C180 70 155 60 130 80 Z" fill="#059669" opacity="0.8" />

          {/* Relaxed Chill Surfer Head */}
          <circle cx="100" cy="95" r="46" fill="#021C14" stroke="#10B981" strokeWidth="3.5" />
          
          {/* Cool Retro Sunglasses */}
          <rect x="68" y="85" width="28" height="18" rx="6" fill="#000" stroke="#10B981" strokeWidth="2" />
          <rect x="104" y="85" width="28" height="18" rx="6" fill="#000" stroke="#10B981" strokeWidth="2" />
          <line x1="96" y1="92" x2="104" y2="92" stroke="#10B981" strokeWidth="3" />
          <line x1="72" y1="88" x2="88" y2="98" stroke="#34D399" strokeWidth="2" opacity="0.7" />
          <line x1="108" y1="88" x2="124" y2="98" stroke="#34D399" strokeWidth="2" opacity="0.7" />

          {/* Ultra chill contented smile */}
          <path d="M92 118 Q100 126 108 118" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />

          {/* Anti-Grav Hoverboard Deck below */}
          <ellipse cx="100" cy="155" rx="55" ry="12" fill="#065F46" stroke="#34D399" strokeWidth="2.5" />
          <ellipse cx="100" cy="158" rx="42" ry="6" fill="#10B981" opacity="0.5" className="animate-pulse" />
        </svg>
      );

    default:
      return null;
  }
};
