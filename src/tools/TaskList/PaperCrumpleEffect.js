import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

// SVG crumpled paper texture background - inline for simplicity
const crumpledTextureSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="600" height="600" filter="url(#noise)" opacity="0.15"/>
</svg>
`;

// Encode SVG for use in CSS
const encodedSvg = encodeURIComponent(crumpledTextureSvg);
const svgBackground = `url("data:image/svg+xml,${encodedSvg}")`;

// Component for creating a very obvious paper crumpling effect
const PaperCrumpleEffect = ({ active, children, onAnimationComplete }) => {
  const [animationStage, setAnimationStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const boxRef = useRef(null);
  
  // Animation duration controls
  const stageDuration = 600; // ms per stage (slowed down further)
  const totalStages = 5;
  
  // Effect images for stages - start with a flatter paper then get more crumpled
  const crumpleBackgrounds = [
    'linear-gradient(to bottom, white, #f8f8f8)',
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M40,40 L160,20 L180,160 L30,130 Z' fill='none' stroke='rgba(0,0,0,0.1)' stroke-width='1'/%3E%3Cpath d='M50,60 L150,50 L140,140 L60,130 Z' fill='none' stroke='rgba(0,0,0,0.1)' stroke-width='1'/%3E%3C/svg%3E"),linear-gradient(to bottom, white, #f5f5f5)`,
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M40,40 L160,20 L180,160 L30,130 Z' fill='none' stroke='rgba(0,0,0,0.15)' stroke-width='1.5'/%3E%3Cpath d='M50,60 L150,50 L140,140 L60,130 Z' fill='none' stroke='rgba(0,0,0,0.15)' stroke-width='1.5'/%3E%3Cpath d='M30,30 L90,50 L170,60 L150,150 L80,170 L20,120 Z' fill='none' stroke='rgba(0,0,0,0.1)' stroke-width='1'/%3E%3C/svg%3E"),linear-gradient(to bottom, white, #f2f2f2)`,
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M40,40 L160,20 L180,160 L30,130 Z' fill='none' stroke='rgba(0,0,0,0.2)' stroke-width='2'/%3E%3Cpath d='M50,60 L150,50 L140,140 L60,130 Z' fill='none' stroke='rgba(0,0,0,0.2)' stroke-width='2'/%3E%3Cpath d='M30,30 L90,50 L170,60 L150,150 L80,170 L20,120 Z' fill='none' stroke='rgba(0,0,0,0.15)' stroke-width='1.5'/%3E%3Cpath d='M60,40 L120,30 L170,100 L130,170 L40,150 Z' fill='none' stroke='rgba(0,0,0,0.15)' stroke-width='1.5'/%3E%3C/svg%3E"),linear-gradient(to bottom, #fafafa, #eaeaea)`,
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M40,40c30-10,60-5,90,15c30,20,50,40,40,80c-10,40-30,50-70,40c-40-10-70-30-80-70c-10-40,10-60,20-65' fill='none' stroke='rgba(0,0,0,0.3)' stroke-width='3'/%3E%3Cpath d='M60,50c20,0,40,10,60,30c20,20,30,40,20,60c-10,20-30,30-50,20c-20-10-40-30-50-50c-10-20,0-40,20-60' fill='none' stroke='rgba(0,0,0,0.3)' stroke-width='2'/%3E%3Cpath d='M80,60c10,5,20,15,30,25c10,10,15,25,10,35c-5,10-15,15-30,10c-15-5-25-15-30-30c-5-15,5-30,20-40' fill='none' stroke='rgba(0,0,0,0.25)' stroke-width='2'/%3E%3C/svg%3E"),linear-gradient(to bottom, #f5f5f5, #e5e5e5)`
  ];
  
  // More distinctive shadows for crumple creases
  const generateRandomCreases = (stage) => {
    if (stage < 1) return '';
    
    let creases = [];
    const count = 5 + stage * 3; // More creases as we progress
    
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 100);
      const y = Math.floor(Math.random() * 100);
      const blur = Math.floor(Math.random() * 6) + 2;
      const opacity = Math.random() * 0.25 + 0.1; // More pronounced shadows
      
      creases.push(`inset ${blur}px ${blur}px ${blur}px rgba(0,0,0,${opacity}) at ${x}% ${y}%`);
    }
    
    // Add outer shadow for depth
    creases.push(`0 ${stage}px ${stage * 3}px rgba(0,0,0,0.2)`);
    
    return creases.join(', ');
  };
  
  // More dramatic non-uniform folding
  const generateCrumpleFold = (stage) => {
    if (stage === 0) return 'none';
    
    const intensity = stage / 5; // Normalize to 0-1 range
    // Make the transform more dramatic based on stage
    const skewX = (Math.random() * 30 - 15) * intensity;
    const skewY = (Math.random() * 30 - 15) * intensity;
    const rotateX = (Math.random() * 60 - 30) * intensity;
    const rotateY = (Math.random() * 60 - 30) * intensity;
    const rotateZ = (Math.random() * 30 - 15) * intensity;
    const scale = 1 - (intensity * 0.8); // More dramatic shrinking
    
    return `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) skew(${skewX}deg, ${skewY}deg) scale(${scale})`;
  };
  
  // More dramatic final crumpled ball effect
  const finalCrumple = `
    perspective(500px) 
    rotateX(${Math.random() * 360}deg) 
    rotateY(${Math.random() * 360}deg) 
    rotateZ(${Math.random() * 180}deg)
    scale(0.15) 
    skew(${Math.random() * 30 - 15}deg, ${Math.random() * 30 - 15}deg)
  `;

  // Generate some random crumple points for more realistic effect
  const crumples = new Array(7).fill(0).map((_, i) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    return {
      x, 
      y,
      size: Math.random() * 30 + 10,
      opacity: Math.random() * 0.15 + 0.05
    };
  });

  // Define the transition for the animation - slower with more easing
  const getTransition = () => {
    if (animationStage === 0) return {};

    return {
      transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' // Even slower for more feeling
    };
  };

  // Very direct and obvious animation sequence
  useEffect(() => {
    if (active && !isAnimating) {
      setIsAnimating(true);
      
      // Sequence through stages at fixed intervals
      for (let i = 1; i <= totalStages; i++) {
        setTimeout(() => {
          setAnimationStage(i);
          
          // Call the completion callback after the final stage
          if (i === totalStages && onAnimationComplete) {
            setTimeout(() => {
              onAnimationComplete();
            }, stageDuration);
          }
        }, i * stageDuration);
      }
    } else if (!active) {
      setAnimationStage(0);
      setIsAnimating(false);
    }
  }, [active, onAnimationComplete]);
  
  // Get specific visual styles based on animation stage
  const getStageStyles = (stage) => {
    // Not crumpling yet
    if (stage === 0) {
      return {
        transform: 'scale(1)',
        borderRadius: '0px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        backgroundImage: crumpleBackgrounds[0]
      };
    }
    
    // During crumpling animation (stages 1-4)
    if (stage < 5) {
      return {
        transform: `scale(${1 - stage*0.15}) rotate(${stage % 2 === 0 ? -stage*2 : stage*2}deg) perspective(500px) rotateX(${stage*5}deg) rotateY(${stage*3}deg)`,
        borderRadius: `${stage * 5}px`,
        boxShadow: `0 ${stage}px ${stage*3}px rgba(0,0,0,0.2)`,
        backgroundImage: crumpleBackgrounds[stage-1] || crumpleBackgrounds[0]
      };
    }
    
    // Final crumpled ball (stage 5)
    return {
      transform: 'scale(0.2) rotate(15deg) perspective(300px) rotateX(45deg) rotateY(45deg) rotateZ(45deg)',
      borderRadius: '50%', // Fully rounded like a ball
      boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
      opacity: 0.7,
      backgroundImage: crumpleBackgrounds[4]
    };
  };

  return (
    <Box
      ref={boxRef}
      sx={{
        position: 'relative',
        transformOrigin: 'center center',
        ...getStageStyles(animationStage),
        transition: `all ${stageDuration/1000}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
        overflow: 'hidden',
        zIndex: 10, // Ensure it's visible above other elements
        // Add visible fold lines that appear during animation
        '&::before': animationStage > 0 ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0, 
          backgroundImage: `
            linear-gradient(${30*animationStage}deg, transparent 30%, rgba(0,0,0,0.05) 50%, transparent 70%), 
            linear-gradient(${120*animationStage}deg, transparent 30%, rgba(0,0,0,0.05) 50%, transparent 70%)
          `,
          opacity: animationStage * 0.5,
          pointerEvents: 'none',
          zIndex: 2
        } : {}
      }}
    >
      {/* Simple but visible fold marks */}
      {animationStage > 0 && (
        <React.Fragment>
          {/* Crumple shadows */}
          {[...Array(5 * animationStage)].map((_, i) => {
            const size = 30 + (i % 3) * 20;
            // Strategically place shadows to be visible
            const positions = [
              {top: '20%', left: '30%'},
              {top: '70%', left: '20%'},
              {top: '40%', left: '80%'},
              {top: '80%', left: '70%'},
              {top: '30%', left: '50%'}
            ];
            const pos = positions[i % positions.length];
            
            return (
              <Box
                key={`shadow-${i}`}
                sx={{
                  position: 'absolute',
                  ...pos,
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(0,0,0,${0.1 * animationStage}) 0%, transparent 70%)`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3
                }}
              />
            );
          })}
          
          {/* Major fold lines */}
          {[...Array(Math.min(6, animationStage * 2))].map((_, i) => {
            // Create a pattern of fold lines that's clearly visible
            const angle = (i * 30) % 180;
            const width = i % 2 === 0 ? '100%' : '70%';
            const left = i % 2 === 0 ? '0%' : '15%';
            
            return (
              <Box
                key={`fold-${i}`}
                sx={{
                  position: 'absolute',
                  top: `${20 + i * 15}%`,
                  left: left,
                  height: '2px',
                  width: width,
                  background: `linear-gradient(${angle}deg, transparent, rgba(0,0,0,0.15), transparent)`,
                  transform: `rotate(${i % 2 === 0 ? 0 : -5}deg)`,
                  zIndex: 3
                }}
              />
            );
          })}
        </React.Fragment>
      )}
      
      {/* The actual task content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 0,
          opacity: 1 - (animationStage / 7),
          filter: `blur(${animationStage * 0.6}px)`,
          transform: animationStage > 0 ? `scale(${1 - animationStage * 0.05})` : 'none'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PaperCrumpleEffect;
