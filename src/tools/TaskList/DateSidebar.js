import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem,
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Paper,
  Divider,
  IconButton,
  alpha,
  useTheme,
  Badge
} from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EventIcon from '@mui/icons-material/Event';

const DateSidebar = ({ selectedDayTab, setSelectedDayTab, dayTabs, tasks }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  // Count tasks by priority for each date
  const getTaskCountsByPriority = (dayIndex) => {
    const targetDate = dayTabs[dayIndex].date;
    let tasksByPriority = { high: 0, medium: 0, low: 0 };
    
    tasks.forEach(task => {
      // For today (index 0), also include tasks with no due date
      if (dayIndex === 0 && !task.dueDate) {
        tasksByPriority[task.priority] += 1;
        return;
      }
      
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        const isMatchingDate = taskDate.setHours(0,0,0,0) === targetDate.setHours(0,0,0,0);
        if (isMatchingDate) {
          tasksByPriority[task.priority] += 1;
        }
      }
    });
    
    return tasksByPriority;
  };

  // Helper function to format dates
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  // Get today and tomorrow dates for header display
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Focus spotlight overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 100,
          background: `radial-gradient(circle at center, transparent 0%, ${theme.palette.background.paper} 80%)`,
          opacity: 0.1,
          display: 'block'
        }}
      />
      {/* Calendar Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.light, 0.1),
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography variant="h6" fontWeight="medium" color="primary">
              Date Navigator
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Today's Date Display */}
      <Box 
        sx={{ 
          p: 2, 
          textAlign: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.background.default, 0.6),
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric' })}
        </Typography>
      </Box>
      
      {/* Date Navigation List */}
      <List sx={{ overflow: 'auto', flexGrow: 1, py: 0 }}>
        {dayTabs.map((day, index) => {
          const taskPriorityCounts = getTaskCountsByPriority(index);
          const totalTasks = taskPriorityCounts.high + taskPriorityCounts.medium + taskPriorityCounts.low;
          const isSelected = selectedDayTab === index;
          const isToday = index === 0;
          const isTomorrow = index === 1;
          
          return (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton 
                  selected={isSelected}
                  onClick={() => setSelectedDayTab(index)}
                  sx={{
                    py: 2,
                    borderLeft: isSelected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                    backgroundColor: isSelected ? 
                      (theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.light, 0.1)) : 
                      'transparent',
                    transition: 'all 0.2s ease',
                    filter: isSelected ? 'none' : 'blur(0.5px)',
                    opacity: isSelected ? 1 : 0.65,
                    transform: isSelected ? 'scale(1)' : 'scale(0.98)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 
                        alpha(theme.palette.primary.main, 0.1) : 
                        alpha(theme.palette.primary.light, 0.05),
                      filter: 'none',
                      opacity: 1,
                      transform: 'scale(1)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isSelected ? 'primary.main' : 'text.secondary',
                    minWidth: '42px'
                  }}>
                    {isToday ? (
                      <TodayIcon color={isSelected ? 'primary' : 'inherit'} />
                    ) : isTomorrow ? (
                      <EventAvailableIcon color={isSelected ? 'primary' : 'inherit'} />
                    ) : (
                      <EventIcon color={isSelected ? 'primary' : 'inherit'} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight={isSelected ? 'bold' : 'medium'}
                          color={isSelected ? 'primary.main' : 'text.primary'}
                        >
                          {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : formatDate(day.date)}
                        </Typography>
                        {totalTasks > 0 && (
                          <Badge 
                            badgeContent={totalTasks} 
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', mt: 1 }}>
                        {taskPriorityCounts.high > 0 && (
                          <Box sx={{ 
                            mr: 1.5, 
                            px: 1, 
                            py: 0.25, 
                            borderRadius: '4px', 
                            backgroundColor: alpha('#f44336', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            color: '#f44336'
                          }}>
                            <Typography variant="caption" fontWeight="medium">
                              {taskPriorityCounts.high} high
                            </Typography>
                          </Box>
                        )}
                        {taskPriorityCounts.medium > 0 && (
                          <Box sx={{ 
                            mr: 1.5, 
                            px: 1, 
                            py: 0.25, 
                            borderRadius: '4px', 
                            backgroundColor: alpha('#ff9800', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            color: '#ff9800'
                          }}>
                            <Typography variant="caption" fontWeight="medium">
                              {taskPriorityCounts.medium} med
                            </Typography>
                          </Box>
                        )}
                        {taskPriorityCounts.low > 0 && (
                          <Box sx={{ 
                            px: 1, 
                            py: 0.25, 
                            borderRadius: '4px', 
                            backgroundColor: alpha('#4caf50', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            color: '#4caf50'
                          }}>
                            <Typography variant="caption" fontWeight="medium">
                              {taskPriorityCounts.low} low
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < dayTabs.length - 1 && (
                <Divider sx={{ my: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </List>

      {/* Future improvement: Add calendar picker button at bottom */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <IconButton 
          size="small" 
          color="primary"
          sx={{
            mr: 1,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            }
          }}
        >
          <KeyboardArrowLeftIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small"
          color="primary"
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
            }
          }}
        >
          <KeyboardArrowRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DateSidebar;
