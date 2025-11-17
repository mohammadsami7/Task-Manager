import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Chip,
  useTheme,
  Fade,
  Zoom,
  Slide,
  Button,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';

// Component to display completed tasks for a selected date in flashcard style
const TaskFlashcards = ({ 
  tasks, 
  selectedDate, 
  priorityColors, 
  onClose 
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // State to track which card is being hovered
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);
  
  // Filter tasks completed on selected date
  const tasksForSelectedDate = tasks.filter(task => {
    if (!selectedDate || !task.completedAt) return false;
    
    const taskDate = new Date(task.completedAt);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  // Format time from date
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Toggle expanded card
  const toggleExpandCard = (id) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(id);
    }
  };
  
  // Reset expanded card when selected date changes
  useEffect(() => {
    setExpandedCardId(null);
    setHoveredCardId(null);
  }, [selectedDate]);
  
  // If no tasks for the selected date
  if (tasksForSelectedDate.length === 0) {
    return (
      <Fade in={true} timeout={800}>
        <Paper
          elevation={6}
          sx={{
            position: 'relative',
            p: 4,
            maxWidth: '750px',
            width: '100%',
            borderRadius: '12px',
            background: isDarkMode 
              ? 'linear-gradient(145deg, #1e1e1e, #2d2d2d)' 
              : 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            boxShadow: isDarkMode
              ? '20px 20px 60px #1a1a1a, -20px -20px 60px #242424'
              : '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
            overflow: 'hidden',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
              '100%': { transform: 'translateY(0px)' }
            }
          }}
        >
          <IconButton 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8,
              backgroundColor: theme.palette.action.hover
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          
          <NoMeetingRoomIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          
          <Typography variant="h5" gutterBottom>
            No Tasks Completed
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '80%' }}>
            You haven't completed any tasks on {formatDate(selectedDate)}.
          </Typography>
          
          <Button 
            variant="outlined" 
            color="primary"
            onClick={onClose}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Paper>
      </Fade>
    );
  }
  
  return (
    <Box 
      sx={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <Fade in={true} timeout={600}>
        <Box sx={{ width: '100%', textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {formatDate(selectedDate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completed Tasks ({tasksForSelectedDate.length})
          </Typography>
        </Box>
      </Fade>

      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          width: '100%',
          maxWidth: '800px',
          perspective: '1000px'
        }}
      >
        {tasksForSelectedDate.map((task, index) => {
          const isHovered = hoveredCardId === task.id;
          const isExpanded = expandedCardId === task.id;
          
          // Generate random offsets for scattered card look
          const randomRotate = Math.floor(Math.random() * 7) - 3; // -3 to 3 degrees
          const randomOffsetX = Math.floor(Math.random() * 20) - 10; // -10px to 10px
          const randomScale = 0.95 + (Math.random() * 0.1); // 0.95 to 1.05
          
          // Unique elevation for each card
          const baseElevation = 3 + (index % 3);
          
          return (
            <Zoom 
              in={true} 
              style={{ 
                transitionDelay: `${index * 100}ms`,
                transitionDuration: '500ms'
              }} 
              key={task.id}
            >
              <Paper
                elevation={isHovered ? baseElevation + 6 : isExpanded ? baseElevation + 4 : baseElevation}
                sx={{
                  position: 'relative',
                  p: 3,
                  borderRadius: '15px',
                  width: isExpanded ? '100%' : '320px',
                  minHeight: '200px',
                  maxHeight: isExpanded ? 'none' : '280px',
                  transformStyle: 'preserve-3d',
                  transform: isExpanded ? 'scale(1.02) translateY(-5px)' : 
                              isHovered ? 'scale(1.05) translateY(-8px)' : 
                              `scale(${randomScale}) rotate(${randomRotate}deg) translateX(${randomOffsetX}px)`,
                  transformOrigin: '50% 50%',
                  background: isDarkMode 
                    ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})` 
                    : `linear-gradient(135deg, #ffffff, ${theme.palette.background.default})`,
                  boxShadow: isHovered ?
                    (isDarkMode ?
                      `0 14px 28px rgba(0,0,0,0.4), 0 10px 10px rgba(0,0,0,0.35), 0 0 0 1px ${theme.palette.divider}` :
                      `0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.9)`
                    ) :
                    isExpanded ?
                    (isDarkMode ?
                      `0 10px 20px rgba(0,0,0,0.35), 0 6px 6px rgba(0,0,0,0.3), 0 0 0 1px ${theme.palette.divider}` :
                      `0 10px 20px rgba(0,0,0,0.2), 0 6px 6px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.8)`
                    ) :
                    (isDarkMode ?
                      `5px 5px 10px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.05), 0 0 0 1px ${theme.palette.divider}` :
                      `5px 5px 10px rgba(0,0,0,0.1), -2px -2px 8px rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.5)`
                    ),
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  zIndex: isExpanded ? 5 : isHovered ? 4 : 3 - (index % 3),
                  order: isExpanded ? -1 : 0,
                  cursor: 'pointer',
                  // Add unique "ripped paper" decoration to each card
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '60px',
                    height: '60px',
                    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L40 0 C45 0, 50 0, 55 5 C60 10, 60 15, 60 20 L60 60 L0 60 Z' fill='${encodeURIComponent(priorityColors[task.priority] || '#f5f5f5')}' opacity='0.15' /%3E%3C/svg%3E")`,
                    transform: `rotate(${Math.floor(Math.random() * 4) * 90}deg)`,
                    opacity: 0.8,
                    pointerEvents: 'none'
                  },
                  // Add unique fold effect
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '40px',
                    height: '40px',
                    background: `linear-gradient(135deg, transparent 50%, ${isDarkMode ? 'rgba(30,30,30,0.5)' : 'rgba(200,200,200,0.5)'} 50%)`,
                    borderTopLeftRadius: '4px',
                    transform: 'rotate(0deg)',
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease'
                  },
                  // Add paper texture
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
                  backgroundBlendMode: 'overlay',
                  // Add subtle edge gradient
                  backgroundImage: `linear-gradient(to bottom, ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'}, transparent 20%, transparent 80%, ${isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.03)'})`,
                }}
                onMouseEnter={() => setHoveredCardId(task.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => toggleExpandCard(task.id)}
              >
                {/* Priority chip */}
                <Chip 
                  label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  size="small"
                  sx={{ 
                    bgcolor: priorityColors[task.priority], 
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    mb: 2,
                    position: 'relative',
                    zIndex: 2
                  }}
                />
                
                {/* Task title */}
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'medium', 
                    lineHeight: 1.3,
                    textShadow: isDarkMode ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    mb: 2
                  }}
                >
                  <CheckCircleIcon 
                    sx={{ 
                      color: theme.palette.success.main,
                      animation: isHovered ? 'pulse 1.5s infinite ease-in-out' : 'none',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.7, transform: 'scale(1)' },
                        '50%': { opacity: 1, transform: 'scale(1.2)' },
                        '100%': { opacity: 0.7, transform: 'scale(1)' }
                      },
                      mt: 0.5
                    }}
                  />
                  <Box>
                    {task.title}
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      <Typography variant="caption">
                        {formatTime(task.completedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Typography>
                
                {/* Task description - only fully visible when expanded */}
                <Divider sx={{ mb: 2 }} />
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    px: 1, 
                    py: 1, 
                    fontStyle: 'italic',
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: 1,
                    minHeight: '60px',
                    maxHeight: isExpanded ? 'none' : '60px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? 'unset' : 2,
                    WebkitBoxOrient: 'vertical',
                    position: 'relative',
                    '&::after': !isExpanded ? {
                      content: '"..."',
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      fontWeight: 'bold',
                      backgroundColor: theme.palette.action.hover
                    } : {}
                  }}
                >
                  {task.description || "No description provided."}
                </Typography>
                
                {isExpanded && (
                  <Button
                    fullWidth
                    variant="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCardId(null);
                    }}
                    sx={{ mt: 2 }}
                  >
                    Show Less
                  </Button>
                )}
                
                {!isExpanded && task.description && task.description.length > 80 && (
                  <Button
                    fullWidth
                    variant="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCardId(task.id);
                    }}
                    sx={{ mt: 1, opacity: 0.7 }}
                  >
                    Read More
                  </Button>
                )}
              </Paper>
            </Zoom>
          );
        })}
      </Box>
      
      <IconButton 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 2,
          zIndex: 10
        }}
        onClick={onClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default TaskFlashcards;
