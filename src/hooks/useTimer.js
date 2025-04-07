import { useState, useEffect, useRef } from 'react';
import { startTimer as startSocketTimer } from '../services/socketService';

export const useTimer = (socket, roomId, onTimerEnd) => {
  const [timer, setTimer] = useState(0);
  const [showTimerPrompt, setShowTimerPrompt] = useState(false);
  const [timerDuration, setTimerDuration] = useState(60);
  
  // Don't need to track timer end here as it's now handled in useSocketEvents
  // But we'll keep the callback for compatibility
  
  const handleStartTimer = () => {
    setShowTimerPrompt(true);
  };

  const startTimer = () => {
    console.log(`Starting timer for ${timerDuration} seconds`);
    startSocketTimer(roomId, timerDuration);
    setShowTimerPrompt(false);
  };

  return {
    timer,
    setTimer,
    showTimerPrompt,
    setShowTimerPrompt,
    timerDuration,
    setTimerDuration,
    handleStartTimer,
    startTimer
  };
}; 