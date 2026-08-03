/** Olive leaf / herb line illustrations matching the farm-fresh mockup */
export function LeafMark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M58 128c2-28 6-52 18-74 10-18 24-32 40-42-4 22-14 42-28 58-12 14-22 28-30 58Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M62 122c-8-22-22-40-40-54-8-6-16-12-22-14 12 18 20 38 24 60 2 12 4 22 6 32"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 70c8-6 16-10 24-12M48 86c-8-4-16-6-24-6M66 52c6-8 10-16 12-24"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="96" cy="28" r="3.5" fill="currentColor" opacity="0.45" />
      <circle cx="18" cy="58" r="2.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function BotanicalCorners({ variant = "full" }) {
  if (variant === "hero") {
    return (
      <>
        <LeafMark className="botanical botanical--bl" />
        <LeafMark className="botanical botanical--tr" />
      </>
    );
  }

  return (
    <>
      <LeafMark className="botanical botanical--tl" />
      <LeafMark className="botanical botanical--tr" />
      <LeafMark className="botanical botanical--bl" />
      <LeafMark className="botanical botanical--br" />
    </>
  );
}

export function WaveDivider() {
  return (
    <svg
      className="wave-divider"
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 40c120 30 240-20 360 0s240 40 360 10 240-40 360-10 240 40 360 20v30H0V40Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconTruck({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 64 48" fill="none" aria-hidden="true">
      <path
        d="M4 30h28V14H4v16Zm28 0h14l8-10V14H32v16Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="36" r="5" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="42" cy="36" r="5" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M2 22h-6M4 17H0M6 12h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function IconChef({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 48 56" fill="none" aria-hidden="true">
      <path
        d="M14 22c0-8 5-14 10-14s10 6 10 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M12 22h24v6c0 2-1 4-3 4H15c-2 0-3-2-3-4v-6Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 32v6c0 6 4 10 8 10s8-4 8-10v-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="40" r="1.4" fill="currentColor" />
      <circle cx="28" cy="40" r="1.4" fill="currentColor" />
      <path d="M22 45h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconBox({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 56 52" fill="none" aria-hidden="true">
      <path
        d="M8 18 28 8l20 10v22L28 50 8 40V18Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M8 18l20 10 20-10M28 28v22" stroke="currentColor" strokeWidth="2.2" />
      <path d="M18 14l10 5 10-5" stroke="currentColor" strokeWidth="1.8" opacity="0.65" />
    </svg>
  );
}
