import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, LinearProgress } from '@mui/material';
import ConfettiEffect from './ConfettiEffect';

const SpotlightEffect = ({ task, visible, onClose, priorityColors }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Trigger confetti with a slight delay after spotlight appears
  useEffect(() => {
    if (visible && task) {
      // Show confetti shortly after spotlight appears for dramatic effect
      const timer = setTimeout(() => setShowConfetti(true), 300);
      
      // Keep confetti showing even after the user clicks to close
      // Only hide it after it has completed its animation
      return () => {
        // Allow confetti to continue until natural completion
        // The confetti effect itself will handle cleanup after the specified duration
        clearTimeout(timer);
      };
    } else {
      // Only fully hide confetti when spotlight is completely gone
      setShowConfetti(false);
    }
  }, [visible, task]);
  
  if (!visible || !task) return null;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        // This will prevent mouse interactions while active
        pointerEvents: 'all'
      }}
      onClick={onClose}
    >
      {/* Handheld torch at the top */}
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          width: '40px',
          height: '100px',
          background: 'linear-gradient(to bottom, #555, #333)',
          borderRadius: '5px',
          transform: 'translateX(-50%)',
          zIndex: 11,
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '60px',
            height: '30px',
            background: 'linear-gradient(to bottom, #888, #555)',
            borderRadius: '10px 10px 0 0',
            transform: 'translateX(-50%)',
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            top: '-5px',
            left: '50%',
            width: '70px',
            height: '15px',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,220,130,0.8) 50%, rgba(255,255,255,0) 100%)',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 20px 10px rgba(255,255,255,0.8), 0 0 40px 20px rgba(255,220,130,0.5)',
            animation: 'pulseTorchLight 1.5s infinite alternate',
          },
          '@keyframes pulseTorchLight': {
            '0%': { opacity: 0.8, boxShadow: '0 0 20px 10px rgba(255,255,255,0.7), 0 0 40px 20px rgba(255,220,130,0.4)' },
            '100%': { opacity: 1, boxShadow: '0 0 30px 15px rgba(255,255,255,0.9), 0 0 60px 30px rgba(255,220,130,0.6)' }
          }
        }}
      />
      
      {/* Torch light glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '25px',
          left: '50%',
          width: '100px',
          height: '40px',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,220,130,0.6) 50%, rgba(255,255,255,0) 100%)',
          borderRadius: '50%',
          transform: 'translateX(-50%)',
          zIndex: 12,
          boxShadow: '0 0 30px 15px rgba(255,255,255,0.6)',
          animation: 'flickerLight 2s infinite alternate',
          '@keyframes flickerLight': {
            '0%': { opacity: 0.8, width: '100px' },
            '25%': { opacity: 0.9, width: '105px' },
            '50%': { opacity: 1, width: '100px' },
            '75%': { opacity: 0.9, width: '95px' },
            '100%': { opacity: 1, width: '100px' }
          }
        }}
      />
      
      {/* Full-page torch beam with straight edges - triangular cone shape */}
      <Box
        sx={{
          position: 'absolute',
          top: '110px', // Start right below the torch
          left: '0',
          width: '100%',
          height: 'calc(100% - 110px)',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.2) 100%)',
          clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)', // Simple triangular cone shape
          zIndex: 10,
          animation: 'fadeInBeam 1.5s forwards',
          '@keyframes fadeInBeam': {
            '0%': { opacity: 0 },
            '100%': { opacity: 0.7 }
          }
        }}
      />
      
      {/* Interior beam with brighter center - also straight edges */}
      <Box
        sx={{
          position: 'absolute',
          top: '110px', // Start right below the torch
          left: '0',
          width: '100%',
          height: 'calc(100% - 110px)',
          background: 'linear-gradient(to bottom, rgba(255,220,130,0) 0%, rgba(255,220,130,0.1) 30%, rgba(255,255,220,0.2) 100%)',
          clipPath: 'polygon(50% 0%, 30% 100%, 70% 100%)', // Narrower inner triangle
          zIndex: 11,
          animation: 'fadeInCenterBeam 1.8s forwards',
          '@keyframes fadeInCenterBeam': {
            '0%': { opacity: 0 },
            '100%': { opacity: 0.8 }
          }
        }}
      />
      
      {/* Light rays with straight edges */}
      <Box
        sx={{
          position: 'absolute',
          top: '110px',
          left: '0',
          width: '100%',
          height: 'calc(100% - 110px)',
          background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0) 10px, rgba(255,255,255,0.03) 20px)',
          clipPath: 'polygon(50% 0%, 10% 100%, 90% 100%)', // Match outer beam shape
          zIndex: 12,
          animation: 'pulseRays 4s infinite linear',
          '@keyframes pulseRays': {
            '0%': { opacity: 0.3 },
            '50%': { opacity: 0.7 },
            '100%': { opacity: 0.3 }
          }
        }}
      />
      
      {/* Confetti explosion effect - cascade from top in the beam shape */}
      <ConfettiEffect active={showConfetti} />
      
      {/* Spotlight cone light effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '0',
          left: '50%',
          width: '600px',
          height: '100%',
          background: 'conic-gradient(from 90deg at 50% 0%, rgba(255, 255, 255, 0) 0deg, rgba(255, 255, 255, 0) 75deg, rgba(255, 255, 255, 0.1) 80deg, rgba(255, 255, 255, 0.2) 85deg, rgba(255, 255, 255, 0.1) 95deg, rgba(255, 255, 255, 0) 100deg, rgba(255, 255, 255, 0) 180deg, rgba(255, 255, 255, 0) 255deg, rgba(255, 255, 255, 0.1) 260deg, rgba(255, 255, 255, 0.2) 265deg, rgba(255, 255, 255, 0.1) 275deg, rgba(255, 255, 255, 0) 280deg, rgba(255, 255, 255, 0) 360deg)',
          transform: 'translateX(-50%)',
          zIndex: 9,
          opacity: 0,
          animation: 'fadeInCone 1.5s forwards 0.2s',
          '@keyframes fadeInCone': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 }
          }
        }}
      />
      
      {/* Task highlight glow (subtle) */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '350px',
          height: '200px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,220,130,0.1) 50%, rgba(255,255,255,0) 100%)',
          transform: 'translate(-50%, -60%)',
          zIndex: 9,
          animation: 'fadeInGlow 2s forwards',
          '@keyframes fadeInGlow': {
            '0%': { opacity: 0 },
            '100%': { opacity: 0.6 }
          }
        }}
      />

      {/* Task Card (enlarged) */}
      <Card
        elevation={24}
        sx={{
          width: '90%',
          maxWidth: '550px',
          transform: 'scale(0)',
          animation: 'zoomIn 0.8s forwards ease-out',
          '@keyframes zoomIn': {
            '0%': { transform: 'scale(0.3)', opacity: 0 },
            '30%': { transform: 'scale(0.5)', opacity: 0.5 },
            '60%': { transform: 'scale(1.1)', opacity: 0.8 },
            '100%': { transform: 'scale(1)', opacity: 1 }
          },
          borderRadius: '12px',
          borderLeft: `8px solid ${priorityColors[task.priority]}`,
          position: 'relative',
          zIndex: 100,
          boxShadow: `0 0 50px 10px rgba(255,255,255,0.5), 0 0 100px 20px ${priorityColors[task.priority]}40`,
          background: 'rgba(255,255,255,0.9)',
          color: '#333'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textDecoration: 'line-through',
              textDecorationThickness: '3px',
              textDecorationColor: 'rgba(0,0,0,0.4)',
              mb: 2,
              color: '#000',
              fontWeight: 'bold',
            }}
          >
            {task.title}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
            {task.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
            <Chip 
              label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} 
              size="medium"
              sx={{ 
                bgcolor: priorityColors[task.priority],
                color: 'white',
                fontWeight: 'bold',
                px: 2
              }}
            />
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              100% Complete
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={100} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              mt: 2,
              bgcolor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                bgcolor: '#4caf50',
                animation: 'progressPulse 1.5s infinite alternate',
                '@keyframes progressPulse': {
                  '0%': { opacity: 0.8 },
                  '100%': { opacity: 1 }
                }
              }
            }}
          />
        </CardContent>
      </Card>
      
      {/* Appreciation message from bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          textAlign: 'center',
          animation: 'riseUp 1s forwards 0.5s',
          opacity: 0,
          '@keyframes riseUp': {
            '0%': { transform: 'translate(-50%, 100px)', opacity: 0 },
            '100%': { transform: 'translate(-50%, 0)', opacity: 1 }
          }
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: '#fff',
            textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)',
            fontWeight: 'bold',
            letterSpacing: 1.2,
            animation: 'pulse 1.5s infinite alternate',
            '@keyframes pulse': {
              '0%': { textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6)' },
              '100%': { textShadow: '0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.8), 0 0 60px rgba(76,175,80,0.6)' }
            }
          }}
        >
          {task.title} Completed!
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            color: '#fff',
            mt: 2,
            textShadow: '0 0 10px rgba(255,255,255,0.6)',
            fontWeight: 'medium'
          }}
        >
          Great job! 👏
        </Typography>
      </Box>
    </Box>
  );
};

export default SpotlightEffect;
