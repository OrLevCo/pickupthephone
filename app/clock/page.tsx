'use client';

import React, { useState, useEffect } from 'react';

export default function Clock() {
  // TEMPORARY: Set to true to show 10:10, false to show actual time
  const USE_FIXED_TIME = false;
  const FIXED_HOUR = 10;
  const FIXED_MINUTE = 10;

  const [time, setTime] = useState(() => {
    // Initialize with current local time
    // new Date() automatically uses the browser's system timezone and local time
    return new Date();
  });

  // Rotating text states
  const rotatingTexts = [
    'scrolling Linkedin',
    'reading emails',
    'sending DMs',
    'updating CRM',
    'checking news'
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const nextTextIndexRef = React.useRef(1);
  const [pillWidth, setPillWidth] = useState(0);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [pillWidthReady, setPillWidthReady] = useState(false);
  const [timeInitialized, setTimeInitialized] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  // Wait for fonts to load
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsReady(true);
      });
    } else {
      // Fallback if fonts API is not available
      setFontsReady(true);
    }
  }, []);

  // Measure the longest text to determine pill width
  useEffect(() => {
    if (measureRef.current && fontsReady) {
      const longestText = rotatingTexts.reduce((a, b) => a.length > b.length ? a : b);
      measureRef.current.textContent = longestText;
      const width = measureRef.current.offsetWidth;
      setPillWidth(width + 20); // Add padding (10px * 2)
      setPillWidthReady(true);
    }
  }, [rotatingTexts, fontsReady]);

  useEffect(() => {
    let animationFrameId: number;
    let firstUpdate = true;
    
    const updateTime = () => {
      // Get fresh local time on each frame
      // new Date() uses the system's local timezone automatically
      // This is the standard JavaScript way - no external API needed
      const now = new Date();
      setTime(now);
      
      // Mark time as initialized after first update to ensure correct positioning
      if (firstUpdate) {
        firstUpdate = false;
        // Use requestAnimationFrame to ensure hands are rendered
        requestAnimationFrame(() => {
          setTimeInitialized(true);
        });
      }
      
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

  // Set contentReady only when time is initialized, pill width is calculated, and fonts are loaded
  useEffect(() => {
    if (timeInitialized && pillWidthReady && fontsReady) {
      setContentReady(true);
    }
  }, [timeInitialized, pillWidthReady, fontsReady]);

  // Rotate text every 5 seconds, synced with clock time
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let animationTimeoutId: NodeJS.Timeout;
    let animationInTimeoutId: NodeJS.Timeout;

    const scheduleNextAnimation = () => {
      const now = new Date();
      const currentSeconds = now.getSeconds();
      const currentMilliseconds = now.getMilliseconds();
      
      // Calculate milliseconds until next 5-second mark (0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55)
      const secondsUntilNextTick = 5 - (currentSeconds % 5);
      const millisecondsUntilNextTick = secondsUntilNextTick * 1000 - currentMilliseconds;
      
      // Start animation 200ms before the tick so it finishes exactly at the tick
      const animationStartDelay = Math.max(0, millisecondsUntilNextTick - 200);
      
      timeoutId = setTimeout(() => {
        // Phase 1: Slide out current text
        setAnimationPhase('out');
        // Phase 2: After slide out, switch to next text and slide in
        animationTimeoutId = setTimeout(() => {
          const nextIndex = nextTextIndexRef.current;
          setCurrentTextIndex(nextIndex);
          nextTextIndexRef.current = (nextIndex + 1) % rotatingTexts.length;
          setAnimationPhase('in');
          // Phase 3: After slide in, return to idle
          animationInTimeoutId = setTimeout(() => {
            setAnimationPhase('idle');
            // Schedule next animation
            scheduleNextAnimation();
          }, 200);
        }, 200);
      }, animationStartDelay);
    };

    // Initial schedule
    scheduleNextAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationTimeoutId) clearTimeout(animationTimeoutId);
      if (animationInTimeoutId) clearTimeout(animationInTimeoutId);
    };
  }, [rotatingTexts.length]);

  // Extract local time components
  // These methods automatically use the local timezone from the Date object
  const hours = USE_FIXED_TIME ? FIXED_HOUR % 12 : time.getHours() % 12; // 0-11 for 12-hour format (getHours() returns 0-23)
  const minutes = USE_FIXED_TIME ? FIXED_MINUTE : time.getMinutes(); // 0-59
  const seconds = USE_FIXED_TIME ? 0 : time.getSeconds(); // 0-59
  const milliseconds = USE_FIXED_TIME ? 0 : time.getMilliseconds(); // 0-999

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div 
      className="flex items-center justify-center" 
      style={{ 
        height: '100vh',
        maxWidth: '100vw',
        backgroundColor: '#fafafa',
        overflow: 'visible',
        position: 'relative'
      }}
    >
      {/* Share button */}
      <button
        onClick={handleShare}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          width: '40px',
          height: '40px',
          minWidth: '40px',
          maxWidth: '40px',
          minHeight: '40px',
          maxHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          border: '1.5px solid black',
          cursor: 'pointer',
          padding: '0',
          borderRadius: '50%',
          boxSizing: 'border-box',
          flexShrink: 0,
          transition: 'opacity 0.15s',
          zIndex: 1000,
          filter: `
            drop-shadow(1px 2px 2px hsl(0deg 0% 0% / 0.12))
            drop-shadow(2px 4px 4px hsl(0deg 0% 0% / 0.09))
            drop-shadow(4px 8px 8px hsl(0deg 0% 0% / 0.06))
            drop-shadow(8px 16px 16px hsl(0deg 0% 0% / 0.03))
          `.replace(/\s+/g, ' ').trim()
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.7';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        aria-label="Share"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_5837_1611)">
            <path d="M8 6L12 2L16 6" stroke="black" strokeWidth="2" strokeLinecap="square"/>
            <path d="M12 3V13" stroke="black" strokeWidth="2" strokeLinecap="square"/>
            <path d="M7 10H5V20H19V10H17" stroke="black" strokeWidth="2" strokeLinecap="square"/>
          </g>
          <defs>
            <clipPath id="clip0_5837_1611">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              backgroundColor: '#333333',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'Satoshi, sans-serif',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              animation: 'fadeIn 0.2s linear'
            }}
          >
            Link copied
          </div>
        )}
      </button>
      <div 
        className="flex flex-col items-center clock-container-mobile" 
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
        {/* Clock container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%',
            flexShrink: 0,
            position: 'relative'
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
            animation: contentReady ? 'fadeIn 1s linear both' : 'none',
            opacity: 0
          }}
        >
          <a
            href="https://www.linkedin.com/company/pick-up-the-phone-club/?viewAsMember=true"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#666666',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.5'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            PICK UP THE PHONE CLUB
          </a>
          {' '}
          <span style={{ color: '#b3b3b3' }}>PRESENTS</span>
        </div>

        <svg
          viewBox={`0 0 ${clockSize} ${clockSize}`}
          style={{ 
            flex: '0 0 auto',
            minWidth: 0,
            minHeight: 0,
            width: 'min(calc(100vw - 48px), calc(100vh - 48px - 120px))',
            height: 'min(calc(100vw - 48px), calc(100vh - 48px - 120px))',
            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: '1',
            overflow: 'visible'
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
                style={{
                  animation: contentReady ? `fadeIn 0.3s linear ${i * 0.02 + 0.1}s both` : 'none',
                  opacity: contentReady ? undefined : 0
                }}
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
                animation: contentReady ? `fadeIn 0.3s linear ${i * 0.1 + 0.1}s both` : 'none',
                opacity: contentReady ? undefined : 0
              }}
            >
              CALL
            </text>
          ))}

          {/* Hidden element to measure text width */}
          <foreignObject
            x="-1000"
            y="-1000"
            width="1"
            height="1"
            style={{ overflow: 'hidden', position: 'absolute', visibility: 'hidden' }}
          >
            <span
              ref={measureRef}
              style={{
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '12px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                position: 'absolute'
              }}
            />
          </foreignObject>

          {/* Stop text and rotating pill - positioned between center and top (behind hands) */}
          <foreignObject
            x={center - (pillWidth || 160) / 2}
            y={center - radius * 0.5 - 10}
            width={pillWidth || 160}
            height="60"
            style={{ 
              overflow: 'visible',
              animation: contentReady ? 'fadeIn 0.3s linear 0.1s both' : 'none',
              opacity: contentReady ? undefined : 0,
              pointerEvents: 'none'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '12px',
                width: '100%',
                height: '100%'
              }}
            >
              <span style={{ 
                textAlign: 'center',
                fontWeight: '700',
                color: '#666666',
                fontSize: '12px'
              }}>Stop</span>
              <div
                style={{
                  backgroundColor: 'white',
                  border: '1.5px solid #b3b3b3',
                  borderRadius: '20px',
                  padding: '9px 10px',
                  width: pillWidth ? `${pillWidth}px` : 'auto',
                  minWidth: pillWidth ? `${pillWidth}px` : 'auto',
                  maxWidth: pillWidth ? `${pillWidth}px` : 'auto',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  boxShadow: 'inset 0.5px 1px 1px hsl(0deg 0% 0% / 0.12), inset 1px 2px 2px hsl(0deg 0% 0% / 0.08), 0 1px 2px rgba(0, 0, 0, 0.1)',
                  margin: '0 auto',
                  boxSizing: 'border-box'
                }}
              >
                {animationPhase === 'out' && (
                  <span
                    key={`out-${currentTextIndex}`}
                    className="text-slide-up-out"
                    style={{
                      position: 'absolute',
                      whiteSpace: 'nowrap',
                      fontWeight: '700'
                    }}
                  >
                    {rotatingTexts[currentTextIndex]}
                  </span>
                )}
                {(animationPhase === 'in' || animationPhase === 'idle') && (
                  <span
                    key={`in-${currentTextIndex}`}
                    className={animationPhase === 'in' ? 'text-slide-up-in' : ''}
                    style={{
                      position: 'absolute',
                      whiteSpace: 'nowrap',
                      fontWeight: '700'
                    }}
                  >
                    {rotatingTexts[currentTextIndex]}
                  </span>
                )}
              </div>
            </div>
          </foreignObject>

          {/* Start dialing text - positioned between center and bottom (behind hands) */}
          <foreignObject
            x={center - 80}
            y={center + radius * 0.5 - 37}
            width={160}
            height="20"
            style={{ 
              overflow: 'visible',
              animation: contentReady ? 'fadeIn 0.3s linear 0.1s both' : 'none',
              opacity: contentReady ? undefined : 0
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '12px'
              }}
            >
              <span style={{ 
                textAlign: 'center',
                fontWeight: '700',
                color: '#666666',
                fontSize: '12px'
              }}>Start dialing.</span>
            </div>
          </foreignObject>

          {/* Hour hand - Thick hand, moderate elevation with layered shadows */}
          <g style={{ 
            filter: `
              drop-shadow(1px 2px 2px hsl(0deg 0% 0% / 0.15))
              drop-shadow(2px 4px 4px hsl(0deg 0% 0% / 0.1))
              drop-shadow(4px 8px 6px hsl(0deg 0% 0% / 0.05))
            `.replace(/\s+/g, ' ').trim(),
            animation: contentReady ? 'fadeIn 0.3s linear 0s both' : 'none',
            opacity: contentReady ? undefined : 0
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
              drop-shadow(1px 2px 2px hsl(0deg 0% 0% / 0.15))
              drop-shadow(2px 4px 4px hsl(0deg 0% 0% / 0.1))
              drop-shadow(4px 8px 6px hsl(0deg 0% 0% / 0.05))
            `.replace(/\s+/g, ' ').trim(),
            animation: contentReady ? 'fadeIn 0.3s linear 0s both' : 'none',
            opacity: contentReady ? undefined : 0
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
          <g style={{
            animation: contentReady ? 'fadeIn 0.3s linear 0s both' : 'none',
            opacity: contentReady ? undefined : 0
          }}>
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
          </g>

          {/* Second hand - Thin hand, subtle elevation with layered shadows, rendered on top */}
          <g style={{ 
            filter: `
              drop-shadow(0.5px 1px 1px hsl(0deg 0% 0% / 0.12))
              drop-shadow(1px 2px 2px hsl(0deg 0% 0% / 0.08))
            `.replace(/\s+/g, ' ').trim(),
            animation: contentReady ? 'fadeIn 0.3s linear 0s both' : 'none',
            opacity: contentReady ? undefined : 0
          }}>
            {/* Main grey part of second hand */}
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius * 0.75 + 20.4}
              stroke="#333333"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${secondAngle}, ${center}, ${center})`}
            />
            {/* Red tip of second hand - 70% longer (20.4px instead of 12px) */}
            <line
              x1={center}
              y1={center - radius * 0.75 + 20.4}
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
            animation: contentReady ? 'fadeIn 1s linear both' : 'none',
            opacity: 0
          }}
        >
          Calls drive CRE business more than anything else.
          <br />
          Pick up the phone.
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
            animation: contentReady ? 'fadeIn 1s linear both' : 'none',
            opacity: 0
          }}
        >
          <span>Created by</span>
          <a
            href="https://trophy.inc"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', transition: 'opacity 0.15s' }}
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
    </div>
  );
}

