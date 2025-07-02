'use client';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

type RobotAvatarProps = {
  status: 'idle' | 'listening' | 'thinking' | 'speaking';
};

export function RobotAvatar({ status }: RobotAvatarProps) {
  const [isMouthOpen, setIsMouthOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === 'speaking') {
      interval = setInterval(() => {
        setIsMouthOpen(prev => !prev);
      }, 200);
    } else {
      setIsMouthOpen(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  return (
    <div className={cn("relative w-48 h-48", status === 'idle' && 'animate-breathing')}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        
        {/* Head */}
        <circle cx="100" cy="100" r="80" fill="url(#grad1)" stroke="hsl(var(--accent))" strokeWidth="2" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--background))" strokeWidth="4" />
        
        {/* Antenna */}
        <line x1="100" y1="20" x2="100" y2="5" stroke="hsl(var(--accent))" strokeWidth="2" />
        <circle cx="100" cy="5" r="3" fill="hsl(var(--accent))" className={cn(status === 'listening' && 'animate-pulse')} />
        
        {/* Eyes */}
        <g id="eyes">
          <Eye cx={70} cy={85} status={status} />
          <Eye cx={130} cy={85} status={status} />
        </g>
        
        {/* Mouth */}
        <g id="mouth">
          {isMouthOpen ? (
            <path d="M 85 130 Q 100 145, 115 130" stroke="hsl(var(--background))" strokeWidth="4" fill="none" strokeLinecap="round" />
          ) : (
            <line x1="85" y1="130" x2="115" y2="130" stroke="hsl(var(--background))" strokeWidth="4" strokeLinecap="round" />
          )}
        </g>

        {/* Thinking Indicator */}
        {status === 'thinking' && (
          <g id="thinking-dots">
            <circle cx="90" cy="110" r="3" fill="hsl(var(--background))" className="thinking-dot-1" />
            <circle cx="100" cy="110" r="3" fill="hsl(var(--background))" className="thinking-dot-2" />
            <circle cx="110" cy="110" r="3" fill="hsl(var(--background))" className="thinking-dot-3" />
          </g>
        )}
      </svg>
    </div>
  );
}

const Eye = ({ cx, cy, status }: { cx: number, cy: number, status: RobotAvatarProps['status'] }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (status === 'idle') {
      const blink = () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
        timeout = setTimeout(blink, Math.random() * 5000 + 2000);
      };
      timeout = setTimeout(blink, Math.random() * 5000 + 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [status]);
  
  if (isBlinking) {
    return <line x1={cx - 15} y1={cy} x2={cx + 15} y2={cy} stroke="hsl(var(--background))" strokeWidth="4" strokeLinecap="round" />;
  }

  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={15} ry={status === 'listening' ? 20 : 15} fill="hsl(var(--background))" className="transition-all duration-300" />
      <circle cx={cx} cy={cy-2} r={status === 'listening' ? 8 : 5} fill="hsl(var(--accent))" className="transition-all duration-300" />
    </g>
  );
};
