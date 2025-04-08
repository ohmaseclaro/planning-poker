import { useState, useEffect, useRef } from 'react';
import { initSocket, joinRoom, showResults as showResultsAction } from '../services/socketService';
import { getUserPixelCoordinates } from '../utils/positionUtils';

export const useSocketEvents = (roomId, userAvatar) => {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(0);
  const [travelingEmojis, setTravelingEmojis] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [userPositions, setUserPositions] = useState({});
  const prevTimerRef = useRef(timer);

  // Refs to maintain stable references for callbacks
  const usersRef = useRef(users);
  const userPositionsRef = useRef(userPositions);

  // Update refs when state changes
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    userPositionsRef.current = userPositions;
  }, [userPositions]);

  // Initialize socket and join room
  useEffect(() => {
    console.log('Initializing socket with roomId:', roomId, 'userAvatar:', userAvatar ? 'set' : 'not set');
    
    // Initialize the socket
    const newSocket = initSocket();
    setSocket(newSocket);
    
    // Get username from localStorage
    const userName = localStorage.getItem('userName');
    if (!userName) {
      console.error('No userName found in localStorage!');
    } else {
      console.log('Joining room with userName:', userName);
      
      // Join the room
      joinRoom(roomId, userName, userAvatar);
    }

    // Cleanup on unmount
    return () => {
      console.log('useSocketEvents unmounting - socket will remain for reuse');
      // We don't disconnect the socket here because we'll reuse it
    };
  }, [roomId, userAvatar]);

  // Watch for timer end
  useEffect(() => {
    // If timer was > 0 and is now 0, show results
    if (prevTimerRef.current > 0 && timer === 0) {
      console.log('Timer reached 0, showing results');
      setShowResults(true);
      
      // Also notify the server to show results for everyone
      if (socket) {
        showResultsAction(roomId);
      }
    }
    prevTimerRef.current = timer;
  }, [timer, roomId, socket]);

  // Set up event listeners
  useEffect(() => {
    if (!socket) return;
    
    console.log('Setting up socket event listeners');
    
    // Update users event
    const handleUpdateUsers = (updatedUsers) => {
      console.log('Received updateUsers event with', updatedUsers.length, 'users:', updatedUsers);
      setUsers(updatedUsers);

      // Extract positions from user objects sent by the server
      const newPositions = {};
      updatedUsers.forEach(user => {
        if (user.position !== undefined) {
          newPositions[user.id] = user.position;
        }
      });
      
      console.log('Using server-provided positions:', newPositions);
      setUserPositions(newPositions);
    };

    // Show results event
    const handleShowResults = () => {
      setShowResults(true);
    };

    // Reset votes event
    const handleResetVotes = () => {
      setShowResults(false);
    };

    // Update timer event
    const handleUpdateTimer = (time) => {
      console.log('Timer updated:', time);
      setTimer(time);
    };

    // Emoji thrown event
    const handleEmojiThrown = (data) => {
      console.log('Received emojiThrown event:', data);
      const { emoji, targetId, sourceId } = data;
      const emojiId = Date.now() + Math.random();

      // Get current values from refs
      const currentUsers = usersRef.current;
      const positions = userPositionsRef.current;

      const sourceUser = currentUsers.find((u) => u.id === sourceId);
      const targetUser = currentUsers.find((u) => u.id === targetId);

      console.log('Source user found:', sourceUser ? 'yes' : 'no');
      console.log('Target user found:', targetUser ? 'yes' : 'no');

      if (sourceUser && targetUser) {
        console.log('Creating traveling emoji');
        // Create a traveling emoji that starts from the source
        setTravelingEmojis((prev) => [
          ...prev,
          {
            id: emojiId,
            emoji,
            sourceId,
            targetId,
            timestamp: Date.now(),
          },
        ]);

        // Remove traveling emoji after animation completes
        setTimeout(() => {
          console.log('Animation complete, transitioning to bounce emoji');
          setTravelingEmojis((prev) => prev.filter((e) => e.id !== emojiId));

          // Add the bounce emoji at target location
          setEmojis((prev) => [
            ...prev,
            {
              id: emojiId,
              emoji,
              targetId,
              sourceId,
              timestamp: Date.now(),
            },
          ]);

          // Remove bounce emoji after animation
          setTimeout(() => {
            setEmojis((prev) => prev.filter((e) => e.id !== emojiId));
          }, 1000);
        }, 800); // 800ms for travel animation
      }
    };

    // Add all event listeners
    socket.on('updateUsers', handleUpdateUsers);
    socket.on('showResults', handleShowResults);
    socket.on('resetVotes', handleResetVotes);
    socket.on('updateTimer', handleUpdateTimer);
    socket.on('emojiThrown', handleEmojiThrown);
    
    // Remove event listeners on cleanup
    return () => {
      console.log('Removing socket event listeners');
      socket.off('updateUsers', handleUpdateUsers);
      socket.off('showResults', handleShowResults);
      socket.off('resetVotes', handleResetVotes);
      socket.off('updateTimer', handleUpdateTimer);
      socket.off('emojiThrown', handleEmojiThrown);
    };
  }, [socket]);

  // Clean up old emojis
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setEmojis((prev) => prev.filter((emoji) => now - emoji.timestamp < 1000));
      setTravelingEmojis((prev) => prev.filter((emoji) => now - emoji.timestamp < 1000));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return {
    socket,
    users,
    userPositions,
    userPositionsRef,
    showResults,
    setShowResults,
    timer,
    travelingEmojis,
    emojis,
    usersRef
  };
}; 