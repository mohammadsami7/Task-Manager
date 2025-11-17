import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  useTheme,
  Badge,
  Tooltip,
  Button,
  Fade,
  Dialog,
  Backdrop
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TodayIcon from '@mui/icons-material/Today';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

// Import flashcards component
import TaskFlashcards from './TaskFlashcards';

const ThreeDCalendar = ({ tasks, completedTasks, onDateClick, priorityColors = {} }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [flashcardsDate, setFlashcardsDate] = useState(null);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [pageTurnDirection, setPageTurnDirection] = useState('right');
  
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Navigate to previous month with realistic page flip animation
  const prevMonth = () => {
    setPageTurnDirection('up');
    setIsPageTurning(true);
    
    // Longer animation duration for more dramatic effect
    setTimeout(() => {
      setCurrentDate(prevDate => {
        const prevMonth = prevDate.getMonth() - 1;
        const newYear = prevDate.getFullYear() + (prevMonth < 0 ? -1 : 0);
        const newMonth = prevMonth < 0 ? 11 : prevMonth;
        return new Date(newYear, newMonth, 1);
      });
      
      setTimeout(() => {
        setIsPageTurning(false);
      }, 450); // Longer cool-down
    }, 450); // Longer animation
  };
  
  // Navigate to next month with realistic page flip animation
  const nextMonth = () => {
    setPageTurnDirection('down');
    setIsPageTurning(true);
    
    // Longer animation duration for more dramatic effect
    setTimeout(() => {
      setCurrentDate(prevDate => {
        const nextMonth = prevDate.getMonth() + 1;
        const newYear = prevDate.getFullYear() + (nextMonth > 11 ? 1 : 0);
        const newMonth = nextMonth > 11 ? 0 : nextMonth;
        return new Date(newYear, newMonth, 1);
      });
      
      setTimeout(() => {
        setIsPageTurning(false);
      }, 450); // Longer cool-down
    }, 450); // Longer animation
  };
  
  // Handle date click
  const handleDateClick = (day) => {
    if (day === 0) return; // Empty cell
    
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    
    // Check if there are completed tasks for this date
    const completedTasksForDay = getCompletedTasksForDate(day);
    
    if (completedTasksForDay.length > 0) {
      // Show flashcards for completed tasks
      setFlashcardsDate(clickedDate);
      setShowFlashcards(true);
    } else {
      // Regular date selection for adding new tasks
      setSelectedDate(clickedDate);
      if (onDateClick) {
        onDateClick(clickedDate);
      }
    }
  };
  
  // Close flashcards dialog
  const handleCloseFlashcards = () => {
    setShowFlashcards(false);
    setTimeout(() => setFlashcardsDate(null), 300); // Clear after animation
  };
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Check if a date has tasks
  const getTasksForDate = (day) => {
    if (!tasks || day === 0) return [];
    
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      // For demo purposes, assume tasks have a dueDate property
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
      return taskDate === date;
    });
  };
  
  // Check if a date has completed tasks
  const getCompletedTasksForDate = (day) => {
    if (!completedTasks || day === 0) return [];
    
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).setHours(0, 0, 0, 0);
    
    return completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const taskDate = new Date(task.completedAt).setHours(0, 0, 0, 0);
      return taskDate === date;
    });
  };
  
  // Generate calendar grid
  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const today = new Date();
    const isCurrentMonth = 
      today.getFullYear() === year && 
      today.getMonth() === month;
    const currentDay = today.getDate();
    
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Add weekday headers
    weekDays.forEach(day => {
      days.push(
        <Box 
          key={`header-${day}`}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            height: '40px',
            color: theme.palette.text.secondary,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          {day}
        </Box>
      );
    });
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <Paper
          key={`empty-${i}`}
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            height: '70px',
            m: 0.5,
            borderRadius: 2
          }}
        />
      );
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDate(day);
      const dayCompletedTasks = getCompletedTasksForDate(day);
      const hasCompletedTasks = dayCompletedTasks.length > 0;
      const isToday = isCurrentMonth && day === currentDay;
      const isSelected = selectedDate && 
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === day;
      const isHovered = hoveredDate === day;
      
      days.push(
        <Paper
          key={`day-${day}`}
          elevation={isHovered ? 8 : isSelected ? 6 : isToday ? 4 : 1}
          sx={{
            position: 'relative',
            height: '70px',
            m: 0.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: 2,
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isHovered ? 'translateY(-5px) scale(1.05)' : 
                      isSelected ? 'translateY(-3px) scale(1.03)' : 
                      'translateY(0) scale(1)',
            backgroundColor: isSelected ? 
              theme.palette.primary.light + '33' : // 20% opacity
              isToday ? 
              theme.palette.secondary.light + '33' : 
              theme.palette.background.paper,
            border: isToday ? 
              `2px solid ${theme.palette.secondary.main}` : 
              isSelected ? 
              `2px solid ${theme.palette.primary.main}` : 
              'none',
            overflow: 'hidden',
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            },
            '&::after': isToday ? {
              content: '""',
              position: 'absolute',
              top: -8,
              right: -8,
              width: 20,
              height: 20,
              backgroundColor: theme.palette.secondary.main,
              transform: 'rotate(45deg)'
            } : {},
            // Special styling for days with completed tasks
            ...(hasCompletedTasks && {
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.success.light}22 100%)`,
              border: `1px dashed ${theme.palette.success.main}66`
            }),
            // Paper fold effect on corner
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '15px',
              height: '15px',
              background: `linear-gradient(135deg, transparent 50%, ${isDarkMode ? 'rgba(30,30,30,0.8)' : 'rgba(200,200,200,0.8)'} 50%)`,
              borderTopLeftRadius: '3px',
              zIndex: 1
            }
          }}
          onClick={() => handleDateClick(day)}
          onMouseEnter={() => setHoveredDate(day)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          <Typography 
            sx={{ 
              pt: 1, 
              fontWeight: isToday ? 'bold' : 'normal',
              color: isToday ? theme.palette.secondary.main : 
                    isSelected ? theme.palette.primary.main : 
                    theme.palette.text.primary
            }}
          >
            {day}
          </Typography>
          
          <Box sx={{ position: 'absolute', bottom: 5, right: 5, display: 'flex', gap: 1 }}>
            {dayTasks.length > 0 && (
              <Badge 
                badgeContent={dayTasks.length} 
                color="primary"
                sx={{ mr: dayCompletedTasks.length > 0 ? 1 : 0 }}
              >
                <EventAvailableIcon fontSize="small" color="action" />
              </Badge>
            )}
            
            {dayCompletedTasks.length > 0 && (
              <Badge 
                badgeContent={dayCompletedTasks.length} 
                color="success"
                sx={{
                  '& .MuiBadge-badge': {
                    animation: hasCompletedTasks ? 'pulse 2s infinite ease-in-out' : 'none',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.2)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }
                }}
              >
                <AssignmentTurnedInIcon 
                  fontSize="small" 
                  color="success"
                  sx={{ opacity: 0.8 }}
                />
              </Badge>
            )}
          </Box>
        </Paper>
      );
    }
    
    return days;
  };
  
  return (
    <Box sx={{ position: 'relative' }}>
      {/* Flashcards dialog for completed tasks */}
      <Dialog
        open={showFlashcards}
        onClose={handleCloseFlashcards}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'visible',
            background: 'transparent',
            boxShadow: 'none',
            minWidth: '600px'
          }
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: {
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        {flashcardsDate && (
          <TaskFlashcards
            tasks={completedTasks}
            selectedDate={flashcardsDate}
            priorityColors={priorityColors}
            onClose={handleCloseFlashcards}
          />
        )}
      </Dialog>
      {/* 3D Calendar header with page fold effect */}
      <Paper
        elevation={5}
        sx={{
          position: 'relative',
          p: 2,
          mb: 1,
          background: theme.palette.primary.main,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          // Paper fold effect on corners
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            width: 16,
            height: 16,
            backgroundColor: isDarkMode ? 'rgba(30,30,30,0.5)' : 'rgba(120,120,120,0.3)',
            zIndex: -1
          },
          '&::before': {
            left: 4,
            transformOrigin: 'top left',
            transform: 'skewX(45deg)'
          },
          '&::after': {
            right: 4,
            transformOrigin: 'top right',
            transform: 'skewX(-45deg)'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={prevMonth} color="inherit">
            <ChevronLeftIcon />
          </IconButton>
          
          <Typography variant="h6" color="white">
            {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </Typography>
          
          <IconButton onClick={nextMonth} color="inherit">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Paper>
      
      {/* Calendar days grid - always visible during page turns */}
      <Paper
        elevation={4}
        sx={{
          position: 'relative',
          p: 2,
          background: theme.palette.background.paper,
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          opacity: isPageTurning ? 0.5 : 1, // Still visible but slightly dimmed during turn
          // Subtle shadow inside the calendar
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '30px',
            background: `linear-gradient(to bottom, ${isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.03)'}, transparent)`,
            zIndex: 0
          },
          // Shadow on the right side (book effect)
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 10,
            bottom: 10,
            right: 0,
            width: '10px',
            background: `linear-gradient(to right, transparent, ${isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'})`,
            borderRadius: '0 2px 2px 0',
            zIndex: 0
          }
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
            position: 'relative',
            zIndex: 1
          }}
        >
          {generateCalendarGrid()}
        </Box>
      </Paper>
      
      {/* Page turning animation - realistic vertical page flip */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: isPageTurning ? 'auto' : 'none',
          zIndex: 5,
          perspective: '2000px',
          visibility: isPageTurning ? 'visible' : 'hidden'
        }}
      >
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.background.paper,
            borderRadius: 2,
            overflow: 'hidden',
            transformOrigin: pageTurnDirection === 'down' ? 'bottom center' : 'top center',
            transform: isPageTurning
              ? `perspective(1800px) rotateX(${pageTurnDirection === 'down' ? '' : '-'}60deg) scale(0.85)`
              : 'perspective(1800px) rotateX(0deg) scale(1)',
            opacity: isPageTurning ? 0.95 : 0,
            transition: 'all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            // Dynamic shadow based on flip direction
            boxShadow: pageTurnDirection === 'down' ?
              '0 -20px 30px -15px rgba(0,0,0,0.5)' :
              '0 20px 30px -15px rgba(0,0,0,0.5)',
            // Add a slight curved effect to the page
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.05))',
              borderRadius: 'inherit',
              pointerEvents: 'none'
            },
            // Paper texture
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
              opacity: 0.3,
              mixBlendMode: 'overlay'
            }
          }}
        />
      </Box>
      
      {/* Selected date display and action button */}
      {selectedDate && (
        <Box 
          sx={{
            mt: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 1,
            position: 'relative',
            // 3D paper edge effect
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(to bottom, ${theme.palette.primary.main}, transparent)`,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TodayIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="subtitle1" fontWeight="bold">
              {formatDate(selectedDate)}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => onDateClick && onDateClick(selectedDate)}
            sx={{ 
              mt: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              boxShadow: `0 3px 5px 2px ${theme.palette.primary.main}33`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 10px 2px ${theme.palette.primary.main}33`,
              }
            }}
          >
            Add Task for This Date
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ThreeDCalendar;
