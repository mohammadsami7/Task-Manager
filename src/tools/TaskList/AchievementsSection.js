import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Collapse, 
  IconButton,
  Divider,
  Badge,
  Tooltip,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

const AchievementsSection = ({ completedTasks, priorityColors, deleteCompletedTask }) => {
  // Start expanded by default in the sidebar context
  const [expanded, setExpanded] = useState(true);
  
  // Group tasks by completion date
  const groupedTasks = completedTasks.reduce((acc, task) => {
    const completionDate = task.completedAt ? 
      new Date(task.completedAt).toLocaleDateString() : 
      'Today';
    
    if (!acc[completionDate]) {
      acc[completionDate] = [];
    }
    
    acc[completionDate].push(task);
    return acc;
  }, {});
  
  // Calculate statistics
  const totalCompleted = completedTasks.length;
  const highPriorityCompleted = completedTasks.filter(task => task.priority === 'high').length;
  
  // Toggle expansion
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <Box sx={{ mt: 1 }}>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
          p: 1,
          borderRadius: 1,
          bgcolor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(76, 175, 80, 0.15)' 
            : 'rgba(76, 175, 80, 0.1)',
          '&:hover': {
            bgcolor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(76, 175, 80, 0.25)' 
              : 'rgba(76, 175, 80, 0.2)',
          },
          mb: 1
        }}
        onClick={toggleExpand}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge 
            badgeContent={totalCompleted} 
            color="success" 
            sx={{ mr: 1 }}
          >
            <StarIcon sx={{ color: '#FFD700' }} />
          </Badge>
          <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
            Completed Tasks
          </Typography>
        </Box>
        
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      {/* Collapsible content */}
      <Collapse in={expanded}>
        {/* Summary statistics */}
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(45, 45, 55, 0.8)' 
              : 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1,
            boxShadow: (theme) => theme.palette.mode === 'dark' 
              ? '0 4px 12px rgba(0,0,0,0.3)' 
              : 1,
            mb: 2,
            mt: 1
          }}
        >
          <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
            <Tooltip title="Total tasks completed">
              <Chip 
                icon={<EmojiEventsIcon />} 
                label={`${totalCompleted} completed`}
                color="success" 
                variant="outlined"
              />
            </Tooltip>
            
            <Tooltip title="High priority tasks completed">
              <Chip 
                icon={<StarIcon />} 
                label={`${highPriorityCompleted} high priority`}
                color="warning"
                variant="outlined" 
              />
            </Tooltip>
          </Stack>
        </Box>
        
        {/* Completed tasks by date */}
        {Object.entries(groupedTasks).map(([date, tasks]) => (
          <Box key={date} sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1, 
                color: 'text.primary' 
              }}
            >
              {date}
            </Typography>
            
            <Divider sx={{ mb: 1 }} />
            
            {tasks.map(task => (
              <Card 
                key={task.id} 
                sx={{ 
                  mb: 1,
                  position: 'relative',
                  borderLeft: `4px solid ${priorityColors[task.priority]}`,
                  opacity: 0.9,
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                  transform: `rotate(${task.crumpleProps?.rotationDeg || Math.random() * 1.5 - 0.75}deg)`,
                  backgroundColor: (theme) => theme.palette.mode === 'dark' 
                    ? theme.palette.background.paper 
                    : 'rgba(250, 250, 250, 0.9)',
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)'
                    : '0 2px 6px rgba(0,0,0,0.15)',
                  '&:hover': {
                    opacity: 1,
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(255,255,255,0.1)'
                      : '0 2px 6px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{
                  py: 1, 
                  '&:last-child': { pb: 1 },
                  position: 'relative',
                  zIndex: 5,
                  backgroundColor: 'transparent'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          textDecoration: 'line-through',
                          opacity: 0.8,
                          color: (theme) => theme.palette.mode === 'dark' 
                            ? theme.palette.text.primary 
                            : '#333',
                          letterSpacing: '-0.3px',
                          display: 'inline-block'
                        }}
                      >
                        {task.title}
                      </Typography>
                      
                      <Box sx={{ mt: 0.5 }}>
                        <Chip 
                          label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} 
                          size="small"
                          sx={{ 
                            fontSize: '0.6rem', 
                            height: 20, 
                            bgcolor: priorityColors[task.priority],
                            color: 'white'
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <IconButton 
                      size="small" 
                      sx={{ color: 'text.secondary' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCompletedTask(task.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

export default AchievementsSection;
