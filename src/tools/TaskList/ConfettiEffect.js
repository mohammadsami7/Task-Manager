import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const ConfettiEffect = ({ active }) => {
  const [particles, setParticles] = useState([]);
  const [launchWaves, setLaunchWaves] = useState(0);
  
  // Generate sequential waves of confetti
  useEffect(() => {
    if (active) {
      // Initial wave
      generateConfettiWave();
      
      // Launch 5 additional waves for longer effect
      const waveInterval = setInterval(() => {
        setLaunchWaves(prev => {
          if (prev < 5) {
            generateConfettiWave();
            return prev + 1;
          } else {
            clearInterval(waveInterval);
            return prev;
          }
        });
      }, 800); // Space out waves for continuous effect
      
      return () => {
        clearInterval(waveInterval);
        setLaunchWaves(0);
      };
    }
  }, [active]);
  
  // Function to generate a wave of confetti particles
  const generateConfettiWave = () => {
    const newParticles = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#9900ff', '#ffffff', '#ffd700'];
    
    // Create 30 confetti particles per wave
    for (let i = 0; i < 30; i++) {
      // Make particles start from top (torch area) and with varying horizontal spread
      const horizontalSpread = Math.random() * 20 - 10; // -10 to +10 from center
      
      newParticles.push({
        id: Date.now() + i, // Unique ID combining timestamp and index
        x: 50 + horizontalSpread, // Start near center with small horizontal offset
        y: 15, // Start near the top (torch area)
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        // Make particles spread wider as they fall by adjusting X speed based on position
        speedX: horizontalSpread * 0.2 + (Math.random() * 2 - 1), 
        speedY: Math.random() * 2 + 1, // Always fall downward
        rotationSpeed: Math.random() * 10 - 5,
        gravity: 0.05 + Math.random() * 0.05, // Lower gravity for slower fall
        opacity: 1,
        lifespan: Math.random() * 8000 + 5000 // Between 5-13 seconds of life
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };
  
  // Animate confetti particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const currentTime = Date.now();
      
      setParticles(prev => prev.map(particle => {
        // Calculate age of particle
        const age = currentTime - particle.id + particle.id % 1000;
        
        // Particle age check for timed removal
        if (age > particle.lifespan) {
          return null;
        }
        
        // Calculate fading for end of life
        const fadeTime = particle.lifespan - 2000; // Start fading 2 seconds before end
        const opacity = age > fadeTime ? 1 - ((age - fadeTime) / 2000) : 1;
        
        // Apply physics to each particle
        let newX = particle.x + particle.speedX;
        let newY = particle.y + particle.speedY;
        
        // Increase horizontal spread as particles fall
        let newSpeedX = particle.speedX * 1.008; // Gradually increase horizontal movement
        let newSpeedY = particle.speedY + particle.gravity;
        let newRotation = (particle.rotation + particle.rotationSpeed) % 360;
        
        // Remove particles that went too far off screen (cleanup)
        if (newY > 150 || newX < -50 || newX > 150) {
          return null;
        }
        
        return {
          ...particle,
          x: newX,
          y: newY,
          speedX: newSpeedX,
          speedY: newSpeedY,
          rotation: newRotation,
          opacity
        };
      }).filter(Boolean));
    }, 30);
    
    return () => clearInterval(interval);
  }, [particles]);
  
  if (!active && particles.length === 0) return null;
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {particles.map(particle => (
        <Box
          key={particle.id}
          sx={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size * 0.4}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: particle.opacity || 0.8,
            boxShadow: `0 0 4px ${particle.color}`,
            transition: 'none',
            zIndex: 1000
          }}
        />
      ))}
    </Box>
  );
};

export default ConfettiEffect;
