import React from 'react';
import { useDrop } from 'react-dnd';
import { Box, Paper, Typography, Chip, Tooltip, Avatar } from '@mui/material';
import DraggableTaskCard from './DraggableTaskCard';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import FlagIcon from '@mui/icons-material/Flag';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Switch back to column-based layout
const DroppableColumn = ({ 
  title, 
  color, 
  tasks, 
  priorityType,
  taskCount,
  priorityColors,
  updateTaskProgress,
  startEditingTask,
  toggleComplete,
  deleteTask,
  updateTaskPriority,
  selectedDayTab
}) => {
  // Set up drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => {
      if (item.priority !== priorityType) {
        updateTaskPriority(item.id, priorityType);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <Box sx={{ 
      width: '33%', 
      flexGrow: 1,
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'transform 0.2s ease, box-shadow 0.3s ease',
      transform: isOver ? 'scale(1.01)' : 'scale(1)',
      boxShadow: (theme) => theme.palette.mode === 'dark'
        ? isOver ? '0 4px 8px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.4)'
        : isOver ? '0 6px 14px rgba(0,0,0,0.12)' : '0 2px 4px rgba(0,0,0,0.06)',
      borderRadius: '8px',
      overflow: 'hidden',
      height: 'fit-content',
      minHeight: '400px',
      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'transparent' : 'background.paper'
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          width: '100%', 
          p: 2, 
          mb: 0, 
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 
            `${color}44` : `${color}22`, 
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderLeft: `4px solid ${color}`,
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: -10,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: color,
            transform: 'translateY(-50%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 1
          }
        }}
      >
        {/* Drop indicator */}
        <Box
          className="drop-indicator"
          sx={{ 
            position: 'absolute',
            left: 'calc(50% - 30px)',
            bottom: -10,
            zIndex: 2,
            transition: 'transform 0.2s ease, opacity 0.2s ease',
            transform: isOver ? 'translateY(2px)' : 'translateY(0)',
            opacity: isOver ? 1 : 0.6,
          }}
        >
          <Tooltip title="Drag tasks here" placement="bottom" arrow>
            <ArrowDropDownCircleIcon 
              sx={{ 
                color, 
                fontSize: 20,
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.25))'
              }} 
            />
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: color,
                width: 32,
                height: 32,
                mr: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {priorityType === 'high' && (
                <LocalFireDepartmentIcon fontSize="small" />
              )}
              {priorityType === 'medium' && (
                <WaterfallChartIcon fontSize="small" />
              )}
              {priorityType === 'low' && (
                <TrendingDownIcon fontSize="small" />
              )}
            </Avatar>
            <Tooltip title={title}>
              <Typography 
                variant="subtitle1" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  display: 'flex', 
                  alignItems: 'center'
                }}
              >
                {priorityType === 'high' && 'Urgent'}
                {priorityType === 'medium' && 'Normal'}
                {priorityType === 'low' && 'Later'}
                <Tooltip title="Drag and drop tasks here" placement="right">
                  <SwapVertIcon 
                    sx={{ 
                      ml: 1,
                      opacity: 0.7,
                      fontSize: 16,
                      color: color,
                      animation: isOver ? 'pulse 1.5s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.7 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0.7 },
                      },
                    }}
                  />
                </Tooltip>
              </Typography>
            </Tooltip>
          </Box>
          
          {/* Task Counter Badge */}
          {taskCount > 0 && (
            <Chip 
              size="small" 
              label={taskCount} 
              sx={{ 
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 
                  `${color}66` : `${color}44`,
                color: (theme) => theme.palette.getContrastText(color),
                fontWeight: 'bold',
                height: 24
              }} 
            />
          )}
        </Box>
      </Paper>
      <Box 
        ref={drop}
        sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 100,
          height: '100%',
          maxHeight: '65vh',
          overflowY: 'auto',
          p: 1.5,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 
            (isOver ? `${color}22` : 'rgba(30, 30, 35, 0.7)') : 
            (isOver ? `${color}10` : 'white'),
          transition: 'all 0.3s ease'
        }}
      >
        {tasks.map((task) => {
          // Determine if the task's deadline matches the selected day
          const isTaskMatchingSelectedDay = () => {
            if (!task.dueDate) return selectedDayTab === 0; // No deadline tasks show on Today tab
            
            const taskDate = new Date(task.dueDate);
            const today = new Date();
            
            if (selectedDayTab === 0) {
              // Today tab
              return taskDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
            } else {
              // Other day tabs
              const targetDate = new Date(today);
              targetDate.setDate(today.getDate() + selectedDayTab);
              return taskDate.setHours(0,0,0,0) === targetDate.setHours(0,0,0,0);
            }
          };
          
          const matchesSelectedDay = isTaskMatchingSelectedDay();
          
          return (
            <Box 
              key={task.id}
              sx={{
                mb: 2,
                width: '100%',
                transition: 'all 0.3s ease',
                filter: matchesSelectedDay ? 'none' : 'blur(2px) grayscale(50%)',
                opacity: matchesSelectedDay ? 1 : 0.6,
                transform: matchesSelectedDay ? 'scale(1)' : 'scale(0.97)',
                '&:hover': {
                  filter: 'none',
                  opacity: 1,
                  transform: 'scale(1)'
                }
              }}
            >
              <DraggableTaskCard
                task={task}
                priorityColors={priorityColors}
                updateTaskProgress={updateTaskProgress}
                startEditingTask={startEditingTask}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
              />
            </Box>
          );
        })}
        {tasks.length === 0 && (
          <Box 
            sx={{ 
              height: '80px', 
              width: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: `2px dashed ${color}55`,
              borderRadius: '8px',
              m: 1,
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? 
                `${color}11` : `${color}05`,
              transition: 'all 0.3s ease',
              transform: isOver ? 'scale(1.03)' : 'scale(1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: isOver ? 
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' : 
                  'none',
                opacity: 0.5,
                animation: isOver ? 'move-background 30s linear infinite' : 'none',
                '@keyframes move-background': {
                  '0%': { backgroundPosition: '0 0' },
                  '100%': { backgroundPosition: '400px 400px' }
                }
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SwapVertIcon 
                sx={{ 
                  fontSize: 24, 
                  color: color, 
                  mb: 1,
                  opacity: 0.7,
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' }
                  }
                }} 
              />
              <Typography 
                color={color} 
                align="center"
                sx={{ fontWeight: 'medium' }}
              >
                Drop tasks here or add a new {priorityType} priority task
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DroppableColumn;
