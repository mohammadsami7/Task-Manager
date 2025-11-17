import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent, Box, Typography, Chip, Slider, Button, CircularProgress, Tooltip, Badge } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TodayIcon from '@mui/icons-material/Today';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FlagIcon from '@mui/icons-material/Flag';
import LowPriorityIcon from '@mui/icons-material/LowPriority';

const DraggableTaskCard = ({ 
  task, 
  priorityColors, 
  updateTaskProgress, 
  startEditingTask,
  toggleComplete,
  deleteTask
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, priority: task.priority },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  // Priority-specific elements
  const PriorityIcon = () => {
    switch(task.priority) {
      case 'high':
        return <LocalFireDepartmentIcon sx={{ color: priorityColors.high, fontSize: 18 }} />;
      case 'medium':
        return <FlagIcon sx={{ color: priorityColors.medium, fontSize: 18 }} />;
      case 'low':
        return <LowPriorityIcon sx={{ color: priorityColors.low, fontSize: 18 }} />;
      default:
        return null;
    }
  };

  // Priority-specific glow effect
  const getPriorityEffect = () => {
    if (task.priority === 'high') {
      return {
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `linear-gradient(90deg, ${priorityColors.high}10 0%, transparent 50%)`,
          pointerEvents: 'none'
        }
      };
    }
    return {};
  };

  return (
    <Card 
      ref={drag}
      key={task.id} 
      sx={{ 
        width: '100%', 
        marginBottom: 1,
        borderLeft: `4px solid ${priorityColors[task.priority]}`,
        backgroundColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(30, 30, 35, 0.8)' 
          : '#fff',
        transition: 'all 0.2s ease',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        position: 'relative',
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? `0 3px 6px rgba(0,0,0,0.3)${task.priority === 'high' ? ', 0 0 8px ' + priorityColors.high + '40' : ''}`
          : '0 2px 4px rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? `0 6px 10px rgba(0,0,0,0.4)${task.priority === 'high' ? ', 0 0 12px ' + priorityColors.high + '60' : ''}`
            : '0 4px 8px rgba(0,0,0,0.15)'
        },
        ...getPriorityEffect(),
        '&:hover .drag-dots': {
          opacity: 1
        }
      }}
    >
      <CardContent>
        {/* Drag Handle Indicator */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.7,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <Tooltip title="Drag to reorder" arrow placement="top">
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2px 8px',
              borderRadius: '0 0 8px 8px',
              backgroundColor: priorityColors[task.priority],
              color: 'white',
              fontSize: '12px',
            }}>
              <DragIndicatorIcon fontSize="small" />
            </Box>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pt: 1.5, px: 0.5 }}>
          <Box sx={{ flex: 1 }}>
            {/* Priority indicator - top left corner */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 8,
                left: 8,
                display: 'flex',
                alignItems: 'center',
                opacity: 0.9
              }}
            >
              <Tooltip title={
                task.autoEscalated
                  ? `Priority automatically escalated from ${task.originalPriority.charAt(0).toUpperCase() + task.originalPriority.slice(1)} to ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} due to approaching deadline`
                  : `${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority`
              }>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8, 
                      borderRadius: task.priority === 'high' ? '0' : '50%',
                      bgcolor: priorityColors[task.priority],
                      transform: task.priority === 'high' ? 'rotate(45deg)' : 'none',
                      boxShadow: `0 0 4px ${priorityColors[task.priority]}80`,
                      mr: 0.7,
                      animation: task.autoEscalated ? 'pulse 2s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.7, boxShadow: `0 0 4px ${priorityColors[task.priority]}80` },
                        '50%': { opacity: 1, boxShadow: `0 0 8px ${priorityColors[task.priority]}` },
                        '100%': { opacity: 0.7, boxShadow: `0 0 4px ${priorityColors[task.priority]}80` }
                      }
                    }}
                  />
                  {task.autoEscalated ? 
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PriorityIcon />
                      <Box 
                        component="span" 
                        sx={{ 
                          fontSize: '0.6rem', 
                          ml: 0.3, 
                          color: 'warning.main',
                          animation: 'blink 1.5s infinite',
                          '@keyframes blink': {
                            '0%': { opacity: 0.6 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.6 }
                          }
                        }}
                      >↑</Box>
                    </Box>
                    : <PriorityIcon />
                  }
                </Box>
              </Tooltip>
            </Box>

            {/* Task title */}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                mt: 0.5, 
                fontSize: '1.05rem', 
                lineHeight: 1.3,
                pl: 3.5, // space for the priority indicator 
                pr: 1
              }}
            >
              {task.title}
            </Typography>

            {/* Deadline indicator - always show deadline if exists */}
            {task.dueDate && (
              <Box sx={{ display: 'flex', mt: 0.5, ml: 3.5 }}>
                <Chip 
                  size="small" 
                  icon={<TodayIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />}
                  label={(() => {
                    const deadlineDate = new Date(task.dueDate);
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    
                    // Check if deadline is today - show urgency
                    if (deadlineDate.toDateString() === today.toDateString()) {
                      return 'DUE TODAY';
                    }
                    // Check if deadline is tomorrow
                    else if (deadlineDate.toDateString() === tomorrow.toDateString()) {
                      return 'DUE TOMORROW';
                    }
                    // Check if deadline is in the past
                    else if (deadlineDate < today) {
                      return 'OVERDUE';
                    }
                    // Otherwise show days until deadline
                    else {
                      const diffTime = Math.abs(deadlineDate - today);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                      return `DUE IN ${diffDays} DAY${diffDays !== 1 ? 'S' : ''}`;
                    }
                  })()} 
                  color={(() => {
                    const deadlineDate = new Date(task.dueDate);
                    const today = new Date();
                    // If deadline is today or in the past, show urgent color
                    if (deadlineDate <= today) return 'error';
                    
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    // If deadline is tomorrow, show warning color
                    if (deadlineDate <= tomorrow) return 'warning';
                    
                    // Otherwise default color
                    return 'default';
                  })()}
                  variant="outlined"
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '0.65rem', 
                    height: 20, 
                    mb: 0.5,
                    borderWidth: (() => {
                      const deadlineDate = new Date(task.dueDate);
                      const today = new Date();
                      return deadlineDate <= today ? 2 : 1; // Make overdue tasks more visible
                    })(),
                  }} 
                />
              </Box>
            )}

            {/* Task description */}
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 1, 
                mt: 0.5, 
                pl: 3.5,
                lineHeight: 1.4,
                opacity: 0.85
              }}
            >
              {task.description}
            </Typography>
          </Box>
          
          {/* Circular progress indicator */}
          <Box 
            sx={{ 
              position: 'relative', 
              width: 50, 
              height: 50,
              ml: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.85
            }}
          >
            <CircularProgress 
              variant="determinate" 
              value={task.progress} 
              size={50}
              thickness={4}
              sx={{ 
                color: task.progress >= 75 ? 'success.main' : 
                       task.progress >= 25 ? 'warning.main' : 'error.main',
                position: 'absolute'
              }}
            />
            <Typography 
              variant="caption" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}
            >
              {`${task.progress}%`}
            </Typography>
          </Box>
        </Box>
        
        {/* Task details shown in a cleaner way - we don't need this section since we show the deadline above */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            alignItems: 'center', 
            gap: 1,
            mt: 0.5, 
            px: 3.5,
            opacity: 0.9
          }}
        />
        
        {/* Progress slider - simplified and cleaner */}
        <Box sx={{ px: 2, mt: 2 }}>
          <Slider
            value={task.progress}
            onChange={(e, value) => updateTaskProgress(task.id, value)}
            step={5}
            marks={[
              { value: 0 },
              { value: 25 },
              { value: 50 },
              { value: 75 },
              { value: 100 }
            ]}
            valueLabelDisplay="auto"
            sx={{ 
              color: task.progress >= 75 ? 'success.main' : 
                     task.progress >= 25 ? 'warning.main' : 'error.main',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
              '& .MuiSlider-rail': {
                opacity: 0.3,
              }
            }}
          />
        </Box>
        
        {/* Action buttons - cleaner layout */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mt: 1.5,
            px: 1.5,
            pb: 0.5
          }}
        >
          <Button
            variant="text"
            startIcon={<EditIcon />}
            size="small"
            onClick={() => startEditingTask(task)}
            color="info"
            sx={{ 
              minWidth: 'unset', 
              px: 1.5,
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(40, 120, 200, 0.15)' : 'rgba(40, 120, 200, 0.08)'
              }
            }}
          >
            Edit
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="text"
              startIcon={<CheckCircleIcon />}
              size="small"
              onClick={() => toggleComplete(task.id)}
              color={task.completed ? "default" : "success"}
              sx={{ 
                minWidth: 'unset', 
                px: 1.5,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 
                    task.completed ? 'rgba(100, 100, 100, 0.15)' : 'rgba(40, 180, 100, 0.15)' : 
                    task.completed ? 'rgba(100, 100, 100, 0.08)' : 'rgba(40, 180, 100, 0.08)'
                }
              }}
            >
              {task.completed ? "Undo" : "Done"}
            </Button>
            
            <Tooltip title="Delete this task">
              <Button
                variant="text"
                startIcon={<DeleteIcon />}
                size="small"
                onClick={() => deleteTask(task.id)}
                color="error"
                sx={{ 
                  minWidth: 'unset', 
                  px: 1.5, 
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(210, 50, 50, 0.15)' : 'rgba(210, 50, 50, 0.08)'
                  }
                }}
              >
                Delete
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DraggableTaskCard;
