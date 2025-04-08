import { useState, useEffect, useRef } from 'react';
import { startTimer as startSocketTimer } from '../services/socketService';

export const useTimer = (socket, roomId, onTimerEnd) => {
  const [timer, setTimer] = useState(0);
  const [showTimerPrompt, setShowTimerPrompt] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60);
  
  // Don't need to track timer end here as it's now handled in useSocketEvents
  // But we'll keep the callback for compatibility
  
  const openTimerPrompt = () => {
    setShowTimerPrompt(true);
  };

  const handleStartTimer = () => {
    console.log(`Starting timer for ${timerDuration} seconds`);
    if (socket && roomId) {
      startSocketTimer(roomId, timerDuration);
    } else {
      console.error('Cannot start timer: socket or roomId is missing');
    }
    setShowTimerPrompt(false);
  };

  return {
    timer,
    setTimer,
    showTimerPrompt,
    setShowTimerPrompt,
    timerDuration,
    setTimerDuration,
    openTimerPrompt,
    handleStartTimer
  };
}; 