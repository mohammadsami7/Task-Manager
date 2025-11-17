import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Slider,
  IconButton,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Backdrop,
  Badge,
  Zoom,
  CircularProgress,
  Tooltip,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  ClickAwayListener,
  Fab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FlagIcon from '@mui/icons-material/Flag';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// Import custom components
import SpotlightEffect from './SpotlightEffect';
import PaperCrumpleEffect from './PaperCrumpleEffect';
import AchievementsSection from './AchievementsSection';
import ThreeDCalendar from './3DCalendar';
import FlyingTaskCard from './FlyingTaskCard';
import DroppableColumn from './DroppableColumn'; // Restored back to column layout
import DateSidebar from './DateSidebar';
import DraggableWidget from './DraggableWidget';

const initialTasks = [
  { id: 1, title: 'Complete project proposal', description: 'Draft and finalize the project proposal document', priority: 'high', completed: false, progress: 0 },
  { id: 2, title: 'Schedule team meeting', description: 'Coordinate with team members for weekly sync-up', priority: 'medium', completed: false, progress: 0 },
  { id: 3, title: 'Research market trends', description: 'Analyze current industry trends and compile findings', priority: 'low', completed: false, progress: 0 },
];

const priorityColors = {
  high: '#f44336',
  medium: '#ff9800',
  low: '#4caf50'
};

// Array of appreciation messages
const appreciationMessages = [
  "Great job! Task completed! 🎉",
  "Achievement unlocked! ⭐",
  "Well done! One less thing to worry about! 👍",
  "Awesome work! Keep it up! 💪",
  "That's the spirit! Progress feels good! 🚀",
  "Another one bites the dust! 💯",
  "You're on fire today! 🔥",
  "Success tastes sweet! 🍯",
  "Productivity level: Hero! 🦸‍♂️",
  "Mission accomplished! 🏆"
];

const TaskList = () => {
  // Request notification permission when the component mounts
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);
  
  // Helper function to send notifications
  const sendNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/favicon.ico'
      });
    }
  };
  
  // State for tasks and form
  const [tasks, setTasks] = useState(initialTasks);
  
  // State for task form visibility
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // State for new/edited task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    dueTime: '23:59',
    progress: 0
  });
  
  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Helper function to reset the task form with default values
  const resetTaskForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      dueTime: '23:59',
      progress: 0
    });
  };
  
  // State for day tabs
  const [selectedDayTab, setSelectedDayTab] = useState(0);
  
  // State for calendar selected date
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get the next 7 days for tabs
  const getDayTabs = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + date.getDate()
      });
    }
    
    return days;
  };
  
  const dayTabs = getDayTabs();
  
  // Filter tasks based on selected day
  const getTasksForSelectedDay = () => {
    if (selectedDayTab === 0) {
      // Today's tasks and overdue tasks
      return tasks.filter(task => {
        if (!task.dueDate) return true; // Tasks with no due date always show
        
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        
        return dueDate <= today;
      });
    } else {
      const selectedDate = dayTabs[selectedDayTab].date;
      selectedDate.setHours(0, 0, 0, 0);
      
      return tasks.filter(task => {
        if (!task.dueDate) return selectedDayTab === 0; // Only show tasks with no due date on Today tab
        
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        return dueDate.getTime() === selectedDate.getTime();
      });
    }
  };
  
  const filteredTasks = getTasksForSelectedDay();
  
  // State for completed tasks (achievements)
  const [completedTasks, setCompletedTasks] = useState(() => {
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    return savedCompletedTasks ? JSON.parse(savedCompletedTasks) : [];
  });
  
  // State for task flying animation
  const [flyingTask, setFlyingTask] = useState(null);
  const achievementsSectionRef = useRef(null);
  
  // State for add task focus mode
  const [addTaskFocusMode, setAddTaskFocusMode] = useState(false);
  
  // State for dramatic spotlight effect
  const [spotlightTaskData, setSpotlightTaskData] = useState(null);
  const [showSpotlight, setShowSpotlight] = useState(false);
  
  // State for confetti animation
  const [showConfetti, setShowConfetti] = useState(false);
  
  // State for paper crumple effect
  const [crumplingTask, setCrumplingTask] = useState(null);
  
  // State for appreciation message
  const [appreciationMessage, setAppreciationMessage] = useState({ 
    show: false, 
    message: '' 
  });
  
  // Handle sidebar section display
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('achievements'); // 'achievements' or 'calendar'
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleSidebarCalendar = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(true);
  };

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save completed tasks to localStorage
  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);
  
  // Automatic priority escalation based on deadlines
  useEffect(() => {
    // This will run every minute to check task priorities
    const priorityCheckInterval = setInterval(() => {
      // Only update tasks if there are any
      if (tasks.length === 0) return;
      
      // Make a copy of tasks to see if we need to update
      const updatedTasks = tasks.map(task => {
        // Skip completed tasks
        if (task.completed) return task;
        
        // Skip tasks without deadlines
        if (!task.dueDate) return task;
        
        // Create a full deadline with date and time
        const deadlineDate = new Date(task.dueDate);
        const [hours, minutes] = (task.dueTime || '23:59').split(':');
        deadlineDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        
        // Current datetime for comparison
        const now = new Date();
        
        // Calculate hours until deadline
        const hoursUntilDeadline = Math.max(0, (deadlineDate - now) / (1000 * 60 * 60));
        
        // Store original priority if not already set
        const originalPriority = task.originalPriority || task.priority;
        
        // Determine appropriate priority based on time until deadline
        let newPriority = originalPriority;
        
        // Priority escalation logic:
        // - Tasks due in <= 25 minutes become high priority
        // - Tasks overdue become high priority
        if (hoursUntilDeadline <= 25/60 || now > deadlineDate) {
          newPriority = 'high';
          
          // Send notification for tasks approaching deadline
          if (hoursUntilDeadline <= 25/60 && hoursUntilDeadline > 0 && newPriority !== task.priority) {
            const minutesLeft = Math.round(hoursUntilDeadline * 60);
            sendNotification(
              `Urgent: ${task.title}`, 
              `Task due in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}!`
            );
          } else if (now > deadlineDate && newPriority !== task.priority) {
            // For overdue tasks
            sendNotification(
              `Overdue: ${task.title}`,
              'This task is now overdue!'
            );
          }
        }
        
        // Only update if priority changed
        if (newPriority !== task.priority) {
          return {
            ...task,
            priority: newPriority,
            originalPriority: originalPriority,
            autoEscalated: true // Flag to indicate this was auto-escalated
          };
        }
        
        return task;
      });
      
      // Check if any priorities were changed
      const prioritiesChanged = JSON.stringify(tasks) !== JSON.stringify(updatedTasks);
      
      // Only update state if changes were made
      if (prioritiesChanged) {
        setTasks(updatedTasks);
      }
    }, 60000); // Check every minute
    
    // Run once immediately on component mount
    const initialCheck = setTimeout(() => {
      const updatedTasks = tasks.map(task => {
        if (task.completed || !task.dueDate) return task;
        
        const deadlineDate = new Date(task.dueDate);
        const [hours, minutes] = (task.dueTime || '23:59').split(':');
        deadlineDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        
        const now = new Date();
        const hoursUntilDeadline = Math.max(0, (deadlineDate - now) / (1000 * 60 * 60));
        const originalPriority = task.originalPriority || task.priority;
        
        let newPriority = originalPriority;
        
        if (hoursUntilDeadline <= 4 || now > deadlineDate) {
          newPriority = 'high';
        } else if (hoursUntilDeadline <= 24 && originalPriority === 'low') {
          newPriority = 'medium';
        }
        
        if (newPriority !== task.priority) {
          return {
            ...task,
            priority: newPriority,
            originalPriority: originalPriority,
            autoEscalated: true
          };
        }
        
        return task;
      });
      
      const prioritiesChanged = JSON.stringify(tasks) !== JSON.stringify(updatedTasks);
      
      if (prioritiesChanged) {
        setTasks(updatedTasks);
      }
    }, 1000);
    
    // Clean up interval on component unmount
    return () => {
      clearInterval(priorityCheckInterval);
      clearTimeout(initialCheck);
    };
  }, [tasks]);

  // Handle task form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new task
  const addTask = () => {
    if (newTask.title.trim() === '') return;
    
    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      originalPriority: newTask.priority, // Store original priority for reference
      dueDate: newTask.dueDate || '',
      dueTime: newTask.dueTime || '23:59',
      completed: false,
      progress: newTask.progress || 0
    };
    
    setTasks([...tasks, task]);
    
    // Create a brief delay to show success before closing
    setTimeout(() => {
      // Reset form using the helper function
      resetTaskForm();
      
      // Exit focus mode with animation
      setAddTaskFocusMode(false);
    }, 300);
  };

  // Start editing a task
  const startEditingTask = (task) => {
    setEditingTask(task);
    setIsEditMode(true);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || '23:59',
      progress: task.progress || 0
    });
    setAddTaskFocusMode(true);
  };

  // Save edited task
  const saveEditedTask = () => {
    if (!editingTask || newTask.title.trim() === '') return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? { 
        ...task, 
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        dueTime: newTask.dueTime || '23:59',
        progress: newTask.progress
      } : task
    ));
    
    setTimeout(() => {
      // Reset form using the helper function
      resetTaskForm();
      
      // Exit edit mode
      setIsEditMode(false);
      setEditingTask(null);
      setAddTaskFocusMode(false);
    }, 300);
  };

  // Update task progress
  const updateTaskProgress = (id, newProgress) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, progress: newProgress } : task
    ));
  };

  // Update task priority (for drag and drop)
  const updateTaskPriority = (id, newPriority) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority: newPriority } : task
    ));
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Delete a completed task (from achievements)
  const deleteCompletedTask = (id) => {
    setCompletedTasks(completedTasks.filter(task => task.id !== id));
  };

  // Toggle task completion with spotlight effect and paper crumple
  const toggleComplete = (id) => {
    const taskToComplete = tasks.find(t => t.id === id);
    
    if (!taskToComplete) return;
    
    if (!taskToComplete.completed) {
      // First start the paper crumple effect - highlight this happening
      setCrumplingTask({...taskToComplete, animationStartTime: Date.now()});
      
      // Set this task as completed first in the active list
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: true, progress: 100 } : task
      ));
      
      // After a delay, show the spotlight effect
      setTimeout(() => {
        setSpotlightTaskData(taskToComplete);
        setShowSpotlight(true);
        setShowConfetti(true);
        
        // Get random appreciation message
        const randomMessage = appreciationMessages[Math.floor(Math.random() * appreciationMessages.length)];
        setAppreciationMessage({
          show: true,
          message: randomMessage
        });
        
        // Create completed task with timestamp and randomized crumple properties
        const completedTask = {
          ...taskToComplete,
          completed: true,
          progress: 100,
          completedAt: new Date().toISOString(),
          crumpleProps: {
            rotationDeg: Math.random() * 2 - 1,
            gradientAngle: Math.random() * 360,
            spotPositionX1: Math.random() * 100,
            spotPositionY1: Math.random() * 100,
            spotPositionX2: Math.random() * 100,
            spotPositionY2: Math.random() * 100,
            spotPositionX3: Math.random() * 100,
            spotPositionY3: Math.random() * 100,
            wrinkleDeg1: Math.random() * 180,
            wrinkleDeg2: Math.random() * 180,
            letterSpacing: Math.random() * 0.5 - 0.25,
            textSkewX: Math.random() * 1 - 0.5,
            textSkewY: Math.random() * 1 - 0.5,
            shadowX: Math.random() * 2,
            shadowY: Math.random() * 2,
            shadowBlur: Math.random() * 3 + 1
          }
        };
        
        // Remove from active tasks after crumple effect is mostly complete
        setTimeout(() => {
          setTasks(tasks.filter(task => task.id !== id));
        }, 3100);
        
        // SEQUENCE: First show spotlight, then close it, then fly task to achievements
        // After spotlight has been shown for a while, close it and show flying animation
        setTimeout(() => {
          // First hide spotlight
          setShowSpotlight(false);
          setShowConfetti(false);
          setAppreciationMessage({ show: false, message: '' });
          
          // Short delay then start flying animation
          setTimeout(() => {
            // Set flying task to trigger animation
            setFlyingTask(completedTask);
          }, 300);
        }, 3500);
      }, 800);
    } else {
      // For completed tasks in the achievements section, this won't be called
      // but keep the logic for handling edge cases
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: false, progress: 0 } : task
      ));
    }
  };
  
  // Handle the end of crumple animation
  const handleCrumpleComplete = () => {
    // Don't immediately clear the crumpling task - let the setTimeout handle it
  };

  // Handle closing the spotlight effect
  const closeSpotlightEffect = () => {
    setShowSpotlight(false);
    setShowConfetti(false);
    setAppreciationMessage({ show: false, message: '' });
    
    setTimeout(() => {
      setSpotlightTaskData(null);
      
      // If there's a crumpling task, initiate the flying animation
      if (crumplingTask) {
        const completedTask = {
          ...crumplingTask,
          completed: true,
          progress: 100,
          completedAt: new Date().toISOString(),
          crumpleProps: {
            rotationDeg: Math.random() * 2 - 1,
            gradientAngle: Math.random() * 360,
            spotPositionX1: Math.random() * 100,
            spotPositionY1: Math.random() * 100,
            spotPositionX2: Math.random() * 100,
            spotPositionY2: Math.random() * 100,
            spotPositionX3: Math.random() * 100,
            spotPositionY3: Math.random() * 100,
            wrinkleDeg1: Math.random() * 180,
            wrinkleDeg2: Math.random() * 180,
            letterSpacing: Math.random() * 0.5 - 0.25,
            textSkewX: Math.random() * 1 - 0.5,
            textSkewY: Math.random() * 1 - 0.5,
            shadowX: Math.random() * 2,
            shadowY: Math.random() * 2,
            shadowBlur: Math.random() * 3 + 1
          }
        };
        
        // Show flying animation
        setTimeout(() => {
          setFlyingTask(completedTask);
        }, 300);
      }
    }, 500);
  };

  // Open sidebar with specified tab
  const openSidebar = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(true);
  };
  
  // This section was removed to fix duplicate function declaration
  
  // Change active tab
  const changeTab = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle new task button click
  const handleNewTaskClick = () => {
    // Reset task form to defaults
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: dayTabs[selectedDayTab].date.toISOString().split('T')[0], // Set due date to selected day
      progress: 0
    });
    
    // Show the form
    setShowTaskForm(true);
  };
  
  // Handle calendar date selection
  const handleDateSelection = (date) => {
    setSelectedDate(date);
    // Set default date for new task
    setNewTask(prev => ({
      ...prev,
      dueDate: date.toISOString().split('T')[0]
    }));
    setAddTaskFocusMode(true);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100%', backgroundColor: 'background.default' }}>
      {/* Date Navigation Sidebar */}
      <Box 
        sx={{ 
          width: '280px', 
          flexShrink: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <DateSidebar 
          selectedDayTab={selectedDayTab} 
          setSelectedDayTab={setSelectedDayTab} 
          dayTabs={dayTabs}
          tasks={tasks}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100%', overflow: 'auto' }}>
        {/* Header */}
        <Paper elevation={0} sx={{ mb: 2, p: 2, borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', m: 0 }}>
            {dayTabs[selectedDayTab].label} Tasks
          </Typography>
        </Paper>
        
        {/* Add task button or focus mode form */}
        {!addTaskFocusMode ? (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            size="large"
            onClick={() => setAddTaskFocusMode(true)}
            sx={{
              py: 1.5,
              mb: 3,
              fontSize: '1.1rem',
              boxShadow: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            Add New Task
          </Button>
        ) : null}
        
        {/* Focus mode overlay for adding tasks */}
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: 1000,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(0, 0, 0, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
          }}
          open={addTaskFocusMode}
          onClick={(e) => {
            // Only close if clicking the backdrop directly, not the form
            if (e.target === e.currentTarget) {
              setAddTaskFocusMode(false);
            }
          }}
        >
          <Paper 
            elevation={10}
            sx={{ 
              p: 3, 
              maxWidth: '600px',
              width: '90%',
              borderRadius: 2,
              transform: addTaskFocusMode ? 'scale(1)' : 'scale(0.9)',
              opacity: addTaskFocusMode ? 1 : 0,
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
              Add New Task
            </Typography>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              isEditMode ? saveEditedTask() : addTask();
            }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="title"
                    name="title"
                    label="Task Title"
                    fullWidth
                    autoComplete="off"
                    value={newTask.title}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="description"
                    name="description"
                    label="Task Description"
                    fullWidth
                    autoComplete="off"
                    value={newTask.description}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                      labelId="priority-label"
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      label="Priority"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={7}>
                      <TextField
                        id="dueDate"
                        name="dueDate"
                        label="Deadline Date"
                        type="date"
                        fullWidth
                        autoComplete="off"
                        value={newTask.dueDate}
                        onChange={handleInputChange}
                        InputLabelProps={{
                          shrink: true, // This ensures the label moves out of the way
                        }}
                        placeholder="yyyy-MM-dd"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        id="dueTime"
                        name="dueTime"
                        label="Time"
                        type="time"
                        fullWidth
                        autoComplete="off"
                        value={newTask.dueTime || '23:59'}
                        onChange={handleInputChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min steps
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Task Progress: {newTask.progress}%</Typography>
                    <Slider
                      name="progress"
                      value={newTask.progress}
                      onChange={(e, value) => setNewTask({...newTask, progress: value})}
                      step={5}
                      marks
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      sx={{
                        color: newTask.progress >= 75 ? 'success.main' : 
                               newTask.progress >= 25 ? 'warning.main' : 'error.main',
                        mb: 2
                      }}
                    />
                  </Grid>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      boxShadow: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    {isEditMode ? 'Save Changes' : 'Add Task'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Backdrop>
        
        {/* Paper crumple effect */}
        {crumplingTask && (
          <PaperCrumpleEffect
            active={true}
            onAnimationComplete={handleCrumpleComplete}
          >
            <Card
              sx={{
                width: '100%',
                maxWidth: '450px',
                borderLeft: `4px solid ${priorityColors[crumplingTask.priority]}`,
                m: 1
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {crumplingTask.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {crumplingTask.description}
                </Typography>
              </CardContent>
            </Card>
          </PaperCrumpleEffect>
        )}
        
        {/* Task List - Priority Kanban Board with Drag & Drop - Row Layout */}
        <DndProvider backend={HTML5Backend}>
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', width: '100%', pb: 2 }}>
            {/* Task Form */}
            {showTaskForm && (
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: '8px',
                  position: 'relative',
                  borderTop: isEditMode ? `3px solid ${priorityColors[newTask.priority]}` : '3px solid #2196f3',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {isEditMode ? 'Edit Task' : 'Add New Task'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Task Title"
                      name="title"
                      value={newTask.title}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={1}>
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          label="Deadline Date"
                          name="dueDate"
                          type="date"
                          value={newTask.dueDate || ''}
                          onChange={handleInputChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          helperText="Date when task must be completed"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label="Time"
                          name="dueTime"
                          type="time"
                          value={newTask.dueTime || '23:59'}
                          onChange={handleInputChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min steps
                          }}
                          helperText="Time deadline"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={newTask.description}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="priority-label">Priority</InputLabel>
                      <Select
                        labelId="priority-label"
                        name="priority"
                        value={newTask.priority}
                        onChange={handleInputChange}
                        label="Priority"
                      >
                        <MenuItem value="high">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: priorityColors.high, mr: 1 }} />
                            High Priority
                          </Box>
                        </MenuItem>
                        <MenuItem value="medium">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: priorityColors.medium, mr: 1 }} />
                            Medium Priority
                          </Box>
                        </MenuItem>
                        <MenuItem value="low">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: priorityColors.low, mr: 1 }} />
                            Low Priority
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography id="progress-slider" gutterBottom>
                        Progress: {newTask.progress}%
                      </Typography>
                      <Slider
                        name="progress"
                        value={newTask.progress || 0}
                        onChange={(e, newValue) => setNewTask({...newTask, progress: newValue})}
                        aria-labelledby="progress-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        marks
                        min={0}
                        max={100}
                        sx={{ 
                          color: newTask.progress >= 75 ? 'success.main' : 
                                newTask.progress >= 25 ? 'warning.main' : 'error.main' 
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    onClick={() => setShowTaskForm(false)} 
                    sx={{ mr: 1 }}
                    variant="outlined"
                    color="inherit"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={isEditMode ? saveEditedTask : addTask}
                    variant="contained"
                    color="primary"
                  >
                    {isEditMode ? 'Save Changes' : 'Add Task'}
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Display message when no tasks for selected day */}
            {filteredTasks.length === 0 && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 4,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: 2,
                  border: '1px dashed rgba(0,0,0,0.2)',
                  my: 4
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tasks scheduled for {dayTabs[selectedDayTab].label}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleNewTaskClick}
                  sx={{ mt: 1 }}
                >
                  Add a new task
                </Button>
              </Box>
            )}
            
            {filteredTasks.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                width: '100%', 
                gap: 2, 
                transition: 'all 0.3s ease',
              }}>
                {/* High Priority Column */}
                <DroppableColumn
                  title="High Priority"
                  color={priorityColors.high}
                  tasks={filteredTasks
                    .filter(task => task.priority === 'high')
                    .sort((a, b) => {
                      // Sort by deadline (earliest first)
                      if (!a.dueDate && !b.dueDate) return 0;
                      if (!a.dueDate) return 1; // Tasks without deadline go last
                      if (!b.dueDate) return -1; // Tasks with deadline come first
                      return new Date(a.dueDate) - new Date(b.dueDate);
                    })}
                  priorityType="high"
                  taskCount={filteredTasks.filter(t => t.priority === 'high').length}
                  priorityColors={priorityColors}
                  updateTaskProgress={updateTaskProgress}
                  startEditingTask={startEditingTask}
                  toggleComplete={toggleComplete}
                  deleteTask={deleteTask}
                  updateTaskPriority={updateTaskPriority}
                  selectedDayTab={selectedDayTab}
                />
                
                {/* Medium Priority Column */}
                <DroppableColumn
                  title="Medium Priority"
                  color={priorityColors.medium}
                  tasks={filteredTasks
                    .filter(task => task.priority === 'medium')
                    .sort((a, b) => {
                      // Sort by deadline (earliest first)
                      if (!a.dueDate && !b.dueDate) return 0;
                      if (!a.dueDate) return 1; // Tasks without deadline go last
                      if (!b.dueDate) return -1; // Tasks with deadline come first
                      return new Date(a.dueDate) - new Date(b.dueDate);
                    })}
                  priorityType="medium"
                  taskCount={filteredTasks.filter(t => t.priority === 'medium').length}
                  priorityColors={priorityColors}
                  updateTaskProgress={updateTaskProgress}
                  startEditingTask={startEditingTask}
                  toggleComplete={toggleComplete}
                  deleteTask={deleteTask}
                  updateTaskPriority={updateTaskPriority}
                  selectedDayTab={selectedDayTab}
                />
                
                {/* Low Priority Column */}
                <DroppableColumn
                  title="Low Priority"
                  color={priorityColors.low}
                  tasks={filteredTasks
                    .filter(task => task.priority === 'low')
                    .sort((a, b) => {
                      // Sort by deadline (earliest first)
                      if (!a.dueDate && !b.dueDate) return 0;
                      if (!a.dueDate) return 1; // Tasks without deadline go last
                      if (!b.dueDate) return -1; // Tasks with deadline come first
                      return new Date(a.dueDate) - new Date(b.dueDate);
                    })}
                  priorityType="low"
                  taskCount={filteredTasks.filter(t => t.priority === 'low').length}
                  priorityColors={priorityColors}
                  updateTaskProgress={updateTaskProgress}
                  startEditingTask={startEditingTask}
                  toggleComplete={toggleComplete}
                  deleteTask={deleteTask}
                  updateTaskPriority={updateTaskPriority}
                  selectedDayTab={selectedDayTab}
                />
              </Box>
            )}
          </Box>
        </DndProvider>
      </Box>

      {/* Spotlight effect */}
      <SpotlightEffect 
        task={spotlightTaskData} 
        visible={showSpotlight} 
        onClose={closeSpotlightEffect}
        priorityColors={priorityColors}
      />
      
      {/* Flying Task Card Animation */}
      {flyingTask && (
        <FlyingTaskCard
          task={flyingTask}
          priorityColors={priorityColors}
          sidebarOpen={sidebarOpen}
          onAnimationEnd={() => {
            // After flying animation completes, add to achievements
            setCompletedTasks([flyingTask, ...completedTasks]);
            setFlyingTask(null);
            setCrumplingTask(null);
            // Open achievements sidebar to show where the task landed
            setSidebarOpen(true);
            setActiveTab('achievements');
          }}
        />
      )}
      
      {/* Right Sidebar for Calendar or Achievements - Using temporary drawer */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={toggleSidebar}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 380,
            boxSizing: 'border-box',
            boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.15)',
            zIndex: 9
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {activeTab === 'achievements' ? (
              <>
                <EmojiEventsIcon sx={{ mr: 1 }} color="primary" />
                Achievements
              </>
            ) : (
              <>
                <CalendarMonthIcon sx={{ mr: 1 }} color="secondary" />
                Calendar
              </>
            )}
          </Typography>
          <IconButton edge="end" onClick={toggleSidebar}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ overflow: 'auto', p: 2, height: 'calc(100vh - 64px)' }}>
          {activeTab === 'achievements' && (
            <AchievementsSection 
              completedTasks={completedTasks}
              priorityColors={priorityColors}
              deleteCompletedTask={deleteCompletedTask}
            />
          )}
          {activeTab === 'calendar' && (
            <ThreeDCalendar 
              tasks={tasks} 
              completedTasks={completedTasks}
              priorityColors={priorityColors}
            />
          )}
        </Box>
      </Drawer>
      
      {/* Movable Achievements Button */}
      <DraggableWidget
        id="achievements-widget"
        tooltipTitle="Achievements"
        defaultPosition={{ x: window.innerWidth - 70, y: window.innerHeight * 0.35 }}
        onOpen={() => toggleSidebarCalendar('achievements')}
        sx={{ 
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'primary.main',
          color: 'white',
          boxShadow: 3,
          '&:hover': {
            backgroundColor: 'primary.dark',
            transform: 'translateY(-3px)'
          },
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <Badge badgeContent={completedTasks.length} color="error" overlap="circular">
          <EmojiEventsIcon fontSize="large" />
        </Badge>
      </DraggableWidget>
      
      {/* Movable Calendar Button */}
      <DraggableWidget
        id="calendar-widget"
        tooltipTitle="Calendar"
        defaultPosition={{ x: window.innerWidth - 70, y: window.innerHeight * 0.55 }}
        onOpen={() => toggleSidebarCalendar('calendar')}
        sx={{ 
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'secondary.main',
          color: 'white',
          boxShadow: 3,
          '&:hover': {
            backgroundColor: 'secondary.dark',
            transform: 'translateY(-3px)'
          },
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <Badge badgeContent={tasks.filter(t => t.dueDate).length} color="info" overlap="circular">
          <CalendarMonthIcon fontSize="large" />
        </Badge>
      </DraggableWidget>
    </Box>
  );
};

export default TaskList;
