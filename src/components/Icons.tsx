import { LucideProps } from "lucide-react";

export const Icons = {
  Logo: (props: LucideProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="hsl(24.6, 95%, 53.1%)" />
        </linearGradient>
      </defs>

      {/* Dark background */}
      {/* <rect x="0" y="0" width="200" height="200" fill="#1A1A1A" /> */}

      {/* Main paper with rounded corners (dark version) */}
      <rect x="20" y="20" width="160" height="160" rx="20" ry="20" fill="#2A2A2A" stroke="#3A3A3A" strokeWidth="2" />

      {/* Folded corner (with rounded outer corner) */}
      <path d="M180 40 A20 20 0 0 0 160 20 L100 20 L180 100 Z" fill="url(#grad1)" />

      {/* Fold line */}
      <line x1="100" y1="20" x2="180" y2="100" stroke="#2A2A2A" strokeWidth="2" />

      {/* Shadow under the fold (lighter in dark mode) */}
      <path d="M100 20 L180 100 L180 40 A20 20 0 0 0 160 20 Z" fill="#FFFFFF" fillOpacity="0.1" />

      {/* UIC text */}
      <text x="30" y="140" fontFamily="Arial, sans-serif" fontSize="80" fontWeight="bold" fill="url(#grad1)">
        UIC
      </text>
    </svg>
  ),
};
