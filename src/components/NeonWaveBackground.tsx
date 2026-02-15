"use client";

export default function NeonWaveBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Neon Sun — top-right corner */}
      <div
        className="absolute animate-neon-sun-pulse"
        style={{
          top: "-150px",
          right: "-150px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(168, 85, 247, 0.35) 30%, rgba(236, 72, 153, 0.3) 60%, transparent 100%)",
          filter: "blur(60px)",
          mixBlendMode: "screen",
          willChange: "transform, opacity",
        }}
      />
      <div
        className="absolute animate-neon-sun-pulse"
        style={{
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.5) 0%, rgba(168, 85, 247, 0.4) 40%, rgba(236, 72, 153, 0.3) 70%, transparent 100%)",
          filter: "blur(40px)",
          mixBlendMode: "screen",
          willChange: "transform, opacity",
          animationDelay: "1s",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "-50px",
          right: "-50px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.6) 0%, rgba(168, 85, 247, 0.5) 35%, rgba(236, 72, 153, 0.4) 65%, transparent 100%)",
          filter: "blur(20px)",
          mixBlendMode: "screen",
          willChange: "transform, opacity",
        }}
      />

      {/* Glow blobs behind the waves */}
      <div
        className="absolute animate-wave-drift-1"
        style={{
          top: "15%",
          left: "10%",
          width: "50vw",
          height: "50vw",
          maxWidth: "600px",
          maxHeight: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute animate-wave-drift-2"
        style={{
          top: "10%",
          right: "5%",
          width: "55vw",
          height: "55vw",
          maxWidth: "650px",
          maxHeight: "650px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute animate-wave-drift-3"
        style={{
          bottom: "5%",
          left: "25%",
          width: "40vw",
          height: "40vw",
          maxWidth: "500px",
          maxHeight: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* SVG wave ribbons */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filters */}
          <filter id="wave-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wave-glow-purple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wave-glow-magenta" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient strokes */}
          <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
            <stop offset="20%" stopColor="rgba(6, 182, 212, 0.6)" />
            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.8)" />
            <stop offset="80%" stopColor="rgba(6, 182, 212, 0.6)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
          </linearGradient>
          <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
            <stop offset="25%" stopColor="rgba(168, 85, 247, 0.5)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.7)" />
            <stop offset="75%" stopColor="rgba(168, 85, 247, 0.5)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
          </linearGradient>
          <linearGradient id="grad-magenta" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0)" />
            <stop offset="30%" stopColor="rgba(236, 72, 153, 0.4)" />
            <stop offset="50%" stopColor="rgba(244, 114, 182, 0.6)" />
            <stop offset="70%" stopColor="rgba(236, 72, 153, 0.4)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0)" />
          </linearGradient>
        </defs>

        {/* Wave 1: Cyan — flowing from top-right */}
        <path
          className="animate-wave-flow-1"
          d="M1440,0 C1350,100 1200,180 1000,250 C800,320 600,380 400,420 C200,460 0,480 -200,490"
          fill="none"
          stroke="url(#grad-cyan)"
          strokeWidth="2.5"
          opacity="0.7"
          filter="url(#wave-glow-cyan)"
        />

        {/* Wave 1b: Cyan echo — slightly offset */}
        <path
          className="animate-wave-flow-1"
          d="M1440,50 C1350,130 1200,210 1000,280 C800,350 600,410 400,450 C200,490 0,510 -200,520"
          fill="none"
          stroke="url(#grad-cyan)"
          strokeWidth="1"
          opacity="0.3"
          filter="url(#wave-glow-cyan)"
        />

        {/* Wave 2: Purple — offset timing */}
        <path
          className="animate-wave-flow-2"
          d="M1440,100 C1300,200 1150,280 950,350 C750,420 550,470 350,500 C150,530 -50,550 -200,560"
          fill="none"
          stroke="url(#grad-purple)"
          strokeWidth="2"
          opacity="0.6"
          filter="url(#wave-glow-purple)"
        />

        {/* Wave 2b: Purple echo */}
        <path
          className="animate-wave-flow-2"
          d="M1440,150 C1300,230 1150,310 950,380 C750,450 550,500 350,530 C150,560 -50,580 -200,590"
          fill="none"
          stroke="url(#grad-purple)"
          strokeWidth="0.8"
          opacity="0.25"
          filter="url(#wave-glow-purple)"
        />

        {/* Wave 3: Magenta — lower, subtle */}
        <path
          className="animate-wave-flow-3"
          d="M1440,200 C1250,300 1100,380 900,450 C700,520 500,570 300,600 C100,630 -100,650 -200,660"
          fill="none"
          stroke="url(#grad-magenta)"
          strokeWidth="1.5"
          opacity="0.5"
          filter="url(#wave-glow-magenta)"
        />
      </svg>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 20%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
