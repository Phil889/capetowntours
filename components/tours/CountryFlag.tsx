import React from "react";

interface CountryFlagProps {
  countryCode: string;
  className?: string;
}

// Map of country codes to their flag SVGs (simplified versions for better browser support)
const flagSvgs: Record<string, React.JSX.Element> = {
  DE: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="13.33" fill="#000000"/>
      <rect y="13.33" width="60" height="13.34" fill="#DD0000"/>
      <rect y="26.67" width="60" height="13.33" fill="#FFCE00"/>
    </svg>
  ),
  US: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#B22234"/>
      {[...Array(7)].map((_, i) => (
        <rect key={i} y={i * 6.15} width="60" height="3.08" fill="white"/>
      ))}
      <rect width="24" height="21.54" fill="#3C3B6E"/>
    </svg>
  ),
  AU: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#012169"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="white" strokeWidth="8"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 L30,40 M0,20 L60,20" stroke="white" strokeWidth="8"/>
      <path d="M30,0 L30,40 M0,20 L60,20" stroke="#C8102E" strokeWidth="4"/>
    </svg>
  ),
  AE: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="10" fill="#00732F"/>
      <rect y="10" width="60" height="10" fill="white"/>
      <rect y="20" width="60" height="10" fill="#000000"/>
      <rect y="30" width="60" height="10" fill="#FF0000"/>
      <rect width="20" height="40" fill="#FF0000"/>
    </svg>
  ),
  ZA: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#002395"/>
      <path d="M0,0 L30,20 L0,40 Z" fill="#000000"/>
      <path d="M0,4 L26,20 L0,36 Z" fill="#FFB612"/>
      <path d="M0,8 L22,20 L0,32 Z" fill="#007A4D"/>
      <rect y="16" width="60" height="8" fill="white"/>
      <rect x="20" width="40" height="16" fill="#DE3831"/>
      <rect x="20" y="24" width="40" height="16" fill="#002395"/>
    </svg>
  ),
  GB: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#012169"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="white" strokeWidth="8"/>
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4.8"/>
      <path d="M30,0 L30,40 M0,20 L60,20" stroke="white" strokeWidth="13.3"/>
      <path d="M30,0 L30,40 M0,20 L60,20" stroke="#C8102E" strokeWidth="8"/>
    </svg>
  ),
  ES: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="10" fill="#AA151B"/>
      <rect y="10" width="60" height="20" fill="#F1BF00"/>
      <rect y="30" width="60" height="10" fill="#AA151B"/>
    </svg>
  ),
  JP: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="white"/>
      <circle cx="30" cy="20" r="12" fill="#BC002D"/>
    </svg>
  ),
  FR: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="40" fill="#002395"/>
      <rect x="20" width="20" height="40" fill="white"/>
      <rect x="40" width="20" height="40" fill="#ED2939"/>
    </svg>
  ),
  BR: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#009B3A"/>
      <path d="M30,5 L55,20 L30,35 L5,20 Z" fill="#FEDF00"/>
      <circle cx="30" cy="20" r="10" fill="#002776"/>
    </svg>
  ),
  NO: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#C8102E"/>
      <rect x="16" width="8" height="40" fill="white"/>
      <rect y="16" width="60" height="8" fill="white"/>
      <rect x="18" width="4" height="40" fill="#003087"/>
      <rect y="18" width="60" height="4" fill="#003087"/>
    </svg>
  ),
  SE: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#004B87"/>
      <rect x="16" width="8" height="40" fill="#FFCD00"/>
      <rect y="16" width="60" height="8" fill="#FFCD00"/>
    </svg>
  ),
  IT: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="40" fill="#009246"/>
      <rect x="20" width="20" height="40" fill="white"/>
      <rect x="40" width="20" height="40" fill="#CE2B37"/>
    </svg>
  ),
  PT: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="40" fill="#006600"/>
      <rect x="24" width="36" height="40" fill="#FF0000"/>
      <circle cx="24" cy="20" r="8" fill="#FFCC00"/>
    </svg>
  ),
  CN: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#DE2910"/>
      <path d="M12,12 l2.4,7.4 h7.8 l-6.3,4.6 2.4,7.4 -6.3-4.6 -6.3,4.6 2.4-7.4 -6.3-4.6 h7.8 z" fill="#FFDE00"/>
      <path d="M20,6 l1.2,0.8 -0.5,1.3 -0.7-1.3z" fill="#FFDE00" transform="rotate(18 20 8)"/>
      <path d="M24,10 l1.2,0.8 -0.5,1.3 -0.7-1.3z" fill="#FFDE00" transform="rotate(36 24 12)"/>
      <path d="M24,16 l1.2,0.8 -0.5,1.3 -0.7-1.3z" fill="#FFDE00" transform="rotate(-36 24 18)"/>
      <path d="M20,20 l1.2,0.8 -0.5,1.3 -0.7-1.3z" fill="#FFDE00" transform="rotate(-18 20 22)"/>
    </svg>
  ),
  KW: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="13.33" fill="#00732F"/>
      <rect y="13.33" width="60" height="13.34" fill="#FFFFFF"/>
      <rect y="26.67" width="60" height="13.33" fill="#CE1126"/>
      <path d="M0,0 L20,13.33 L0,26.67 L0,13.33 L20,26.67 L0,40 Z" fill="#000000"/>
    </svg>
  ),
  IN: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="13.33" fill="#FF9933"/>
      <rect y="13.33" width="60" height="13.34" fill="#FFFFFF"/>
      <rect y="26.67" width="60" height="13.33" fill="#138808"/>
      <circle cx="30" cy="20" r="5" fill="#000080"/>
      <circle cx="30" cy="20" r="4.5" fill="#FFFFFF"/>
      <circle cx="30" cy="20" r="1" fill="#000080"/>
      {/* Simplified Ashoka Chakra with 24 spokes */}
      {[...Array(24)].map((_, i) => (
        <line
          key={i}
          x1="30"
          y1="20"
          x2={30 + 4.5 * Math.cos((i * 15 * Math.PI) / 180)}
          y2={20 + 4.5 * Math.sin((i * 15 * Math.PI) / 180)}
          stroke="#000080"
          strokeWidth="0.2"
        />
      ))}
    </svg>
  ),
  RU: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="13.33" fill="#FFFFFF"/>
      <rect y="13.33" width="60" height="13.34" fill="#0039A6"/>
      <rect y="26.67" width="60" height="13.33" fill="#D52B1E"/>
    </svg>
  ),
  KR: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#FFFFFF"/>
      <circle cx="30" cy="20" r="8" fill="#C60C30"/>
      <path d="M30,12 A8,8 0 0,1 30,28" fill="#003478"/>
      {/* Simplified Taeguk */}
      <circle cx="27" cy="16" r="2.5" fill="#C60C30"/>
      <circle cx="33" cy="24" r="2.5" fill="#003478"/>
      {/* Simplified trigrams */}
      <rect x="8" y="6" width="12" height="2" fill="#000000"/>
      <rect x="8" y="9" width="5" height="2" fill="#000000"/>
      <rect x="15" y="9" width="5" height="2" fill="#000000"/>
      <rect x="8" y="12" width="12" height="2" fill="#000000"/>
      
      <rect x="40" y="6" width="5" height="2" fill="#000000"/>
      <rect x="47" y="6" width="5" height="2" fill="#000000"/>
      <rect x="40" y="9" width="5" height="2" fill="#000000"/>
      <rect x="47" y="9" width="5" height="2" fill="#000000"/>
      <rect x="40" y="12" width="12" height="2" fill="#000000"/>
    </svg>
  ),
  CA: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="15" height="40" fill="#FF0000"/>
      <rect x="15" width="30" height="40" fill="#FFFFFF"/>
      <rect x="45" width="15" height="40" fill="#FF0000"/>
      {/* Simplified maple leaf */}
      <path d="M30,8 L32,14 L34,12 L33,16 L36,15 L34,18 L38,18 L34,20 L36,23 L33,22 L34,26 L32,24 L30,30 L28,24 L26,26 L27,22 L24,23 L26,20 L22,18 L26,18 L24,15 L27,16 L26,12 L28,14 Z" fill="#FF0000"/>
    </svg>
  ),
  DK: (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="40" fill="#C60C30"/>
      <rect x="16" width="8" height="40" fill="#FFFFFF"/>
      <rect y="16" width="60" height="8" fill="#FFFFFF"/>
    </svg>
  ),
};

// Fallback for unknown country codes
const defaultFlag = (
  <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="40" fill="#E0E0E0"/>
    <text x="30" y="25" textAnchor="middle" fontSize="16" fill="#666">?</text>
  </svg>
);

const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode, className = "" }) => {
  const flag = flagSvgs[countryCode.toUpperCase()] || defaultFlag;
  
  return (
    <div 
      className={`inline-block overflow-hidden ${className}`}
      style={{ 
        width: "24px", 
        height: "16px",
        borderRadius: "2px",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.1)"
      }}
      aria-label={`Flag of ${countryCode}`}
    >
      {flag}
    </div>
  );
};

export default CountryFlag;
