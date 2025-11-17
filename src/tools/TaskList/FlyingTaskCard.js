import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * A component that displays a task card animation that flies from the center
 * to the achievements section when a task is completed
 */
const FlyingTaskCard = ({ task, priorityColors, sidebarOpen, onAnimationEnd }) => {
  if (!task) return null;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        animation: 'flyToAchievements 1s forwards cubic-bezier(0.075, 0.82, 0.165, 1)',
        '@keyframes flyToAchievements': {
          '0%': {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
            opacity: 1
          },
          '100%': {
            top: sidebarOpen ? '120px' : '20px', // Fly to sidebar if open, or to the button if closed
            left: '95%',
            transform: 'translate(-100%, 0) scale(0.2) rotate(10deg)',
            opacity: 0.7
          }
        }
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <Card
        sx={{
          width: '300px',
          borderLeft: `4px solid ${priorityColors[task.priority]}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2), 0 1px 5px rgba(0,0,0,0.1)',
          background: theme => theme.palette.background.paper,
          transition: 'transform 0.3s ease'
        }}
      >
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {task.description}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              size="small"
              sx={{ 
                bgcolor: priorityColors[task.priority] + '30',
                color: priorityColors[task.priority],
                fontWeight: 'bold'
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon 
                sx={{ 
                  color: 'success.main', 
                  mr: 0.5,
                  animation: 'pulse 1s infinite alternate',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.7, transform: 'scale(1)' },
                    '100%': { opacity: 1, transform: 'scale(1.2)' }
                  }
                }} 
                fontSize="small" 
              />
              <Typography variant="caption" fontWeight="bold" color="success.main">
                Completed!
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FlyingTaskCard;
