import React from 'react';

// Smooth physics-based transitions
const SMOOTH_SPRING = 'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';
const SMOOTH_FADE = 'transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';

export function MotionTerminal({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} overflow-visible`}
    >
      {/* Terminal prompt chevron - slides right smoothly without touching cursor */}
      <polyline
        points="4 17 9 12 4 7"
        className={`${SMOOTH_SPRING} group-hover:translate-x-1`}
      />
      {/* Underscore cursor - stays safely spaced at x=13 to x=19 */}
      <line
        x1="13"
        y1="19"
        x2="20"
        y2="19"
        className={`${SMOOTH_SPRING} ${SMOOTH_FADE} opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5`}
      />
    </svg>
  );
}

export function MotionCode2({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} overflow-visible`}
    >
      {/* Left bracket - pulls left cleanly away from slash */}
      <polyline
        points="7 7 3 12 7 17"
        className={`${SMOOTH_SPRING} group-hover:-translate-x-1`}
      />
      {/* Right bracket - pulls right cleanly away from slash */}
      <polyline
        points="17 7 21 12 17 17"
        className={`${SMOOTH_SPRING} group-hover:translate-x-1`}
      />
      {/* Center code slash - centered and stable, no overlapping */}
      <line
        x1="13.5"
        y1="5"
        x2="10.5"
        y2="19"
        className={`${SMOOTH_SPRING} opacity-80 group-hover:opacity-100`}
      />
    </svg>
  );
}

export function MotionUsers({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} overflow-visible`}
    >
      {/* Secondary collaborator in back - floats up gently without colliding into primary user */}
      <g className={`${SMOOTH_SPRING} group-hover:-translate-y-1`}>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </g>
      {/* Primary front user - stays perfectly grounded */}
      <g>
        <circle cx="9" cy="7" r="4" />
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      </g>
    </svg>
  );
}

export function MotionShield({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} overflow-visible`}
    >
      {/* Outer shield perimeter */}
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
      {/* Inner checkmark - comfortably positioned inside shield, scales cleanly */}
      <polyline
        points="9 12 11 14 15 10"
        className={`${SMOOTH_SPRING} ${SMOOTH_FADE} opacity-50 group-hover:opacity-100 group-hover:scale-105 origin-center`}
      />
    </svg>
  );
}

export function MotionBarChart({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} overflow-visible`}
    >
      {/* Scorecard bars rising cleanly with safe clearances */}
      <line
        x1="6"
        y1="20"
        x2="6"
        y2="14"
        className={`${SMOOTH_SPRING} origin-bottom group-hover:scale-y-120`}
      />
      <line
        x1="12"
        y1="20"
        x2="12"
        y2="6"
        className={`transition-transform duration-300 delay-75 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom group-hover:scale-y-110`}
      />
      <line
        x1="18"
        y1="20"
        x2="18"
        y2="10"
        className={`transition-transform duration-300 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom group-hover:scale-y-125`}
      />
    </svg>
  );
}

export function MotionLock({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} overflow-visible`}
    >
      {/* Lock Shackle - smooth lift upwards, overflow-visible guarantees it is never cut off */}
      <path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        className={`${SMOOTH_SPRING} origin-bottom group-hover:-translate-y-1`}
      />
      {/* Lock Body */}
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      {/* Keyhole dot */}
      <circle cx="12" cy="16.5" r="1" className="fill-current" />
    </svg>
  );
}
