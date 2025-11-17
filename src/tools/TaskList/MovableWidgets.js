import React, { useState } from 'react';
import { Box, IconButton, Badge, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Fade, Backdrop } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';
import TodayIcon from '@mui/icons-material/Today';
import DraggableWidget from './DraggableWidget';
import ThreeDCalendar from './3DCalendar';
import AchievementsSection from './AchievementsSection';

/**
 * MovableCalendarWidget - A draggable calendar widget that opens in the right sidebar
 */
export const MovableCalendarWidget = ({ tasks, completedTasks, priorityColors, toggleSidebarCalendar }) => {
  return (
    <DraggableWidget
      id="calendar-widget"
      tooltipTitle="Calendar View"
      defaultPosition={{ x: window.innerWidth - 120, y: 80 }}
      onOpen={() => toggleSidebarCalendar('calendar')}
      sx={{ 
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        '&:hover': {
          transform: 'translateY(-3px)'
        },
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <Badge
        color="error"
        badgeContent={tasks.filter(t => {
          const today = new Date();
          if (!t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          return dueDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
        }).length}
        overlap="circular"
      >
        <IconButton
          size="large"
          sx={{ color: 'white' }}
          disableRipple
        >
          <CalendarTodayIcon fontSize="medium" />
        </IconButton>
      </Badge>
    </DraggableWidget>
  );
};

/**
 * MovableAchievementsWidget - A draggable achievements widget that opens in the right sidebar
 */
export const MovableAchievementsWidget = ({ completedTasks, priorityColors, deleteCompletedTask, toggleSidebarCalendar }) => {
  return (
    <DraggableWidget
      id="achievements-widget"
      tooltipTitle="Achievements"
      defaultPosition={{ x: window.innerWidth - 120, y: 140 }}
      onOpen={() => toggleSidebarCalendar('achievements')}
      sx={{ 
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.secondary.main,
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        '&:hover': {
          transform: 'translateY(-3px)'
        },
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <Badge
        color="error"
        badgeContent={completedTasks.length}
        overlap="circular"
      >
        <IconButton
          size="large"
          sx={{ color: 'white' }}
          disableRipple
        >
          <EmojiEventsIcon fontSize="medium" />
        </IconButton>
      </Badge>
    </DraggableWidget>
  );
};
