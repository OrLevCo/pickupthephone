'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(() => {
    // Initialize with current local time
    // new Date() automatically uses the browser's system timezone and local time
    return new Date();
  });

  useEffect(() => {
    let animationFrameId: number;
    
    const updateTime = () => {
      // Get fresh local time on each frame
      // new Date() uses the system's local timezone automatically
      // This is the standard JavaScript way - no external API needed
      const now = new Date();
      setTime(now);
      animationFrameId = requestAnimationFrame(updateTime);
    };
    
    // Start updating immediately
    animationFrameId = requestAnimationFrame(updateTime);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Extract local time components
  // These methods automatically use the local timezone from the Date object
  const hours = time.getHours() % 12; // 0-11 for 12-hour format (getHours() returns 0-23)
  const minutes = time.getMinutes(); // 0-59
  const seconds = time.getSeconds(); // 0-59
  const milliseconds = time.getMilliseconds(); // 0-999

  // Calculate rotation angles with smooth movement
  // Hour hand: 30 degrees per hour + 0.5 degrees per minute + smooth seconds/milliseconds
  const hourAngle = (hours * 30) + (minutes * 0.5) + (seconds * 0.5 / 60) + (milliseconds * 0.5 / 60000);
  // Minute hand: 6 degrees per minute + smooth seconds/milliseconds
  const minuteAngle = (minutes * 6) + (seconds * 0.1) + (milliseconds * 0.1 / 1000);
  
  // Second hand: ticks (moves in discrete steps each second)
  const secondAngle = (seconds * 6);
  
  // Smooth second hand (commented out - uncomment to restore smooth movement):
  // const secondAngle = (seconds * 6) + (milliseconds * 6 / 1000) - 90;

  const clockSize = 400;
  const center = clockSize / 2;
  const radius = clockSize / 2 - 10; // Base radius for ticks, text, and hands
  const clockFaceRadius = clockSize / 2 - 3; // Larger radius for outer stroke
  const baseX = 14; // Base movement distance in pixels

  // Movement multipliers based on hour position
  const getMovementMultiplier = (hourIndex: number) => {
    // 12 and 6 o'clock (indices 0 and 6)
    if (hourIndex === 0 || hourIndex === 6) return 1.0;
    // 1, 5, 7, 11 o'clock (indices 1, 5, 7, 11)
    if (hourIndex === 1 || hourIndex === 5 || hourIndex === 7 || hourIndex === 11) return 0.7;
    // 2, 4, 8, 10 o'clock (indices 2, 4, 8, 10)
    if (hourIndex === 2 || hourIndex === 4 || hourIndex === 8 || hourIndex === 10) return 0.3;
    // 3 and 9 o'clock (indices 3 and 9) - moved a bit more
    if (hourIndex === 3 || hourIndex === 9) return 0.2;
    return 0;
  };

  // Generate hour positions (12 positions)
  const hourPositions = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30) - 90; // Start at top (12 o'clock)
    const radian = (angle * Math.PI) / 180;
    const movementMultiplier = getMovementMultiplier(i);
    const distanceFromCenter = 0.75 + (baseX * movementMultiplier) / radius;
    let x = center + radius * distanceFromCenter * Math.cos(radian);
    let y = center + radius * distanceFromCenter * Math.sin(radian);
    
    // Adjust 3 and 9 o'clock positions: move down to align with horizontal center
    if (i === 3 || i === 9) {
      y = center + 1; // Move down 1px from horizontal center
    }
    
    return { x, y, angle };
  });

  // Generate tick marks
  const tickMarks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6) - 90;
    const radian = (angle * Math.PI) / 180;
    const isHourMark = i % 5 === 0;
    const tickLength = isHourMark ? 12 : 6;
    const tickRadius = radius - 5;
    const x1 = center + tickRadius * Math.cos(radian);
    const y1 = center + tickRadius * Math.sin(radian);
    const x2 = center + (tickRadius - tickLength) * Math.cos(radian);
    const y2 = center + (tickRadius - tickLength) * Math.sin(radian);
    return { x1, y1, x2, y2, isHourMark };
  });

  return (
    <div 
      className="flex items-center justify-center" 
      style={{ 
        height: '100vh',
        maxWidth: '100vw',
        backgroundColor: '#fafafa',
        overflow: 'visible' 
      }}
    >
      <div 
        className="flex flex-col items-center" 
        style={{ 
          width: '100%',
          height: '100%',
          padding: '24px',
          minHeight: 0,
          overflow: 'hidden',
          boxSizing: 'border-box',
          justifyContent: 'center',
          gap: '0'
        }}
      >
        {/* Text above clock */}
        <div
          className="text-center"
          style={{
            marginBottom: '12px',
            flexShrink: 0,
            flexGrow: 0,
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '-0.3px',
          }}
        >
          <span style={{ color: '#666666' }}>PICK UP THE PHONE CLUB </span>
          <span style={{ color: '#b3b3b3' }}>PRESENTS</span>
        </div>

        <svg
          viewBox={`0 0 ${clockSize} ${clockSize}`}
          style={{ 
            flex: '1 1 0',
            minWidth: 0,
            minHeight: 0,
            width: 'min(calc(100vw - 48px), calc(100vh - 48px - 120px))',
            height: 'min(calc(100vw - 48px), calc(100vh - 48px - 120px))',
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: '1',
            overflow: 'visible',
            animation: 'fadeIn 1s ease-out 0.3s both',
            opacity: 0
          }}
        >

          {/* Clock face circle - Large element, substantial elevation with layered shadows */}
          <circle
            cx={center}
            cy={center}
            r={clockFaceRadius}
            fill="white"
            stroke="black"
            strokeWidth="3"
            style={{ 
              filter: `
                drop-shadow(1px 2px 2px hsl(0deg 0% 0% / 0.12))
                drop-shadow(2px 4px 4px hsl(0deg 0% 0% / 0.09))
                drop-shadow(4px 8px 8px hsl(0deg 0% 0% / 0.06))
                drop-shadow(8px 16px 16px hsl(0deg 0% 0% / 0.03))
              `.replace(/\s+/g, ' ').trim()
            }}
          />

          {/* Tick marks - Small elements, subtle layered shadows */}
          <g style={{ 
            filter: `
              drop-shadow(0.5px 1px 1px hsl(0deg 0% 0% / 0.2))
              drop-shadow(1px 2px 2px hsl(0deg 0% 0% / 0.1))
            `.replace(/\s+/g, ' ').trim()
          }}>
            {tickMarks.map((tick, i) => (
              <line
                key={i}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke="black"
                strokeWidth={tick.isHourMark ? 3 : 1}
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* "CALL" text at each hour position */}
          {hourPositions.map((pos, i) => (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold text-black select-none"
              style={{
                fontSize: '16px',
                fontFamily: 'Satoshi, sans-serif',
                letterSpacing: '-0.8px',
              }}
            >
              CALL
            </text>
          ))}

          {/* Hour hand - Thick hand, moderate elevation with layered shadows */}
          <g style={{ 
            filter: `
              drop-shadow(1px 2px 2px hsl(0deg 0% 0% / 0.3))
              drop-shadow(2px 4px 4px hsl(0deg 0% 0% / 0.2))
              drop-shadow(4px 8px 6px hsl(0deg 0% 0% / 0.1))
            `.replace(/\s+/g, ' ').trim()
          }}>
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius * 0.5}
              stroke="black"
              strokeWidth="6"
              strokeLinecap="round"
              transform={`rotate(${hourAngle}, ${center}, ${center})`}
            />
          </g>

          {/* Minute hand - Medium hand, moderate elevation with layered shadows */}
          <g style={{ 
            filter: `
              drop-shadow(1px 2px 2px hsl(0deg 0% 0% / 0.3))
              drop-shadow(2px 4px 4px hsl(0deg 0% 0% / 0.2))
              drop-shadow(4px 8px 6px hsl(0deg 0% 0% / 0.1))
            `.replace(/\s+/g, ' ').trim()
          }}>
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius * 0.7}
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle}, ${center}, ${center})`}
            />
          </g>

          {/* Center dot / Pivot */}
          <circle
            cx={center}
            cy={center}
            r="6"
            fill="black"
          />
          {/* Inner grey circle */}
          <circle
            cx={center}
            cy={center}
            r="2.5"
            fill="#333333"
          />

          {/* Second hand - Thin hand, subtle elevation with layered shadows, rendered on top */}
          <g style={{ 
            filter: `
              drop-shadow(0.5px 1px 1px hsl(0deg 0% 0% / 0.25))
              drop-shadow(1px 2px 2px hsl(0deg 0% 0% / 0.15))
            `.replace(/\s+/g, ' ').trim()
          }}>
            {/* Main grey part of second hand */}
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius * 0.75 + 12}
              stroke="#333333"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${secondAngle}, ${center}, ${center})`}
            />
            {/* Red tip of second hand - 50% longer (12px instead of 8px) */}
            <line
              x1={center}
              y1={center - radius * 0.75 + 12}
              x2={center}
              y2={center - radius * 0.75}
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${secondAngle}, ${center}, ${center})`}
            />
          </g>
        </svg>

        {/* Text below clock */}
        <div
          className="text-center"
          style={{
            marginTop: '12px',
            flexShrink: 0,
            flexGrow: 0,
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            color: '#666666',
            lineHeight: '1.5',
            letterSpacing: '-0.4px',
          }}
        >
          In CRE, Calls &gt; Everything Else.
          <br />
          Pick Up The Phone.
        </div>

        {/* Created by with Trophy logo */}
        <div
          className="text-center flex items-center justify-center gap-2"
          style={{
            marginTop: '24px',
            flexShrink: 0,
            flexGrow: 0,
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '10px',
            fontWeight: '500',
            color: '#b3b3b3',
          }}
        >
          <span>Created by</span>
          <a
            href="https://trophy.inc"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', transition: 'opacity 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <img
              src="/trophy-logo.svg"
              alt="Trophy"
              style={{
                height: '16px',
                width: 'auto',
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

