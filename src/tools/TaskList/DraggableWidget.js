import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

/**
 * DraggableWidget - A component that can be freely positioned anywhere on the screen
 * @param {object} props
 * @param {string} props.id - Unique ID for saving position in localStorage
 * @param {React.ReactNode} props.children - Content to be rendered inside the widget
 * @param {string} props.tooltipTitle - Text to show in tooltip on hover
 * @param {object} props.defaultPosition - Default x/y coordinates { x: 100, y: 100 }
 * @param {function} props.onOpen - Function to call when widget is clicked/opened
 * @param {object} props.sx - Additional styling for the widget
 */
const DraggableWidget = ({ 
  id, 
  children, 
  tooltipTitle,
  defaultPosition = { x: 20, y: 20 },
  onOpen,
  sx = {}
}) => {
  const draggableRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDragHandle, setShowDragHandle] = useState(false);

  // Load saved position from localStorage on mount
  useEffect(() => {
    try {
      const savedPosition = localStorage.getItem(`draggable-${id}-position`);
      if (savedPosition) {
        const parsedPosition = JSON.parse(savedPosition);
        
        // Make sure the widget isn't positioned off-screen
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Ensure widget is at least partially visible
        const x = Math.min(Math.max(parsedPosition.x, -50), screenWidth - 50);
        const y = Math.min(Math.max(parsedPosition.y, -20), screenHeight - 50);
        
        setPosition({ x, y });
      }
    } catch (error) {
      console.error("Error loading widget position:", error);
    }
  }, [id]);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem(`draggable-${id}-position`, JSON.stringify(position));
    }
  }, [position, id, isDragging]);

  // Add event listeners when dragging starts
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset]);

  // Mouse event handlers
  // Track click position and time to distinguish between drag and click
  const [clickInfo, setClickInfo] = useState({ startX: 0, startY: 0, startTime: 0 });
  
  const handleMouseDown = (e) => {
    // Record starting position and time for click detection
    setClickInfo({
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now()
    });
    
    setIsDragging(true);
    const rect = draggableRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      setPosition({ x, y });
    }
  };

  const handleMouseUp = (e) => {
    // Determine if this was a drag or a click
    // A click is when: 
    // 1. Movement was minimal (less than 5px in any direction)
    // 2. Duration was short (less than 250ms)
    const moveDeltaX = Math.abs(e.clientX - clickInfo.startX);
    const moveDeltaY = Math.abs(e.clientY - clickInfo.startY);
    const duration = Date.now() - clickInfo.startTime;
    
    const isActualClick = moveDeltaX < 5 && moveDeltaY < 5 && duration < 250;
    
    // Only consider it a click if minimal movement occurred
    if (isActualClick && onOpen) {
      onOpen();
    }
    
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    // Record starting position and time for click detection
    setClickInfo({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now()
    });
    
    setIsDragging(true);
    const rect = draggableRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      const x = touch.clientX - dragOffset.x;
      const y = touch.clientY - dragOffset.y;
      setPosition({ x, y });
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    // Similar to mouse up, determine if this was a tap or a drag
    if (e.changedTouches && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const moveDeltaX = Math.abs(touch.clientX - clickInfo.startX);
      const moveDeltaY = Math.abs(touch.clientY - clickInfo.startY);
      const duration = Date.now() - clickInfo.startTime;
      
      const isActualTap = moveDeltaX < 10 && moveDeltaY < 10 && duration < 300;
      
      // Only consider it a tap if minimal movement occurred
      if (isActualTap && onOpen) {
        onOpen();
      }
    }
    
    setIsDragging(false);
  };

  return (
    <Paper
      ref={draggableRef}
      elevation={isDragging ? 8 : 3}
      sx={{
        position: 'fixed',
        zIndex: isDragging ? 9999 : 100,
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        borderRadius: '50%',
        transition: isDragging ? 'none' : 'box-shadow 0.3s ease, transform 0.2s ease',
        transform: `scale(${isDragging ? 1.1 : 1})`,
        userSelect: 'none',
        touchAction: 'none',
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        },
        overflow: 'visible',
        ...sx
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setShowDragHandle(true)}
      onMouseLeave={() => !isDragging && setShowDragHandle(false)}
      // Using our custom click detection instead of onClick
    >
      <Tooltip title={tooltipTitle} placement="left" arrow>
        {children}
      </Tooltip>
      
      {/* Drag handle indicator */}
      {showDragHandle && (
        <Box
          sx={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'primary.main',
            borderRadius: '4px',
            color: 'white',
            padding: '2px 4px',
            fontSize: '0.6rem',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        >
          <DragIndicatorIcon fontSize="inherit" />
        </Box>
      )}
    </Paper>
  );
};

export default DraggableWidget;
