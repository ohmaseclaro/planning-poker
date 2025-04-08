import io from 'socket.io-client';

// Create a single socket instance
let socket = null;
let isInitialized = false;

export const initSocket = () => {
  if (!socket) {
    console.log('Creating new socket connection');
    
    // Get the auth token from localStorage
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      console.error('No authentication token found');
      return null;
    }
    
    // Get socket URL from env or fall back to same origin
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    console.log('Connecting to socket URL:', socketUrl);
    
    // Connect with explicit socket.io path and include auth token
    socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: {
        token: authToken
      }
    });
    
    // Add basic diagnostic handlers
    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
      isInitialized = true;
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      
      // If the error is authentication related, clear token and redirect to home
      if (error.message === 'invalid token' || error.message === 'Authentication failed') {
        console.log('Authentication failed, redirecting to login');
        localStorage.removeItem('authToken');
        window.location.href = '/';
      }
    });
    
    // Handle duplicate login notification
    socket.on('duplicate_login', (data) => {
      console.log('Duplicate login detected:', data);
      // Show alert with the message
      alert(data.message || 'You have been disconnected because your account logged in elsewhere.');
      // Redirect to home page after acknowledgment
      window.location.href = '/';
    });
  }
  return socket;
};

export const joinRoom = (roomId, name, avatar) => {
  console.log('joinRoom called with:', { roomId, name, avatar: avatar ? 'set' : 'not set' });
  
  if (!socket) {
    console.error('Socket not created when trying to join room');
    return;
  }
  
  // If socket isn't connected yet, wait for connection
  if (!socket.connected) {
    console.log('Socket not connected yet, waiting for connection before joining room');
    socket.once('connect', () => {
      console.log('Connected now, joining room');
      socket.emit('joinRoom', { roomId, name, avatar });
    });
  } else {
    // Socket is already connected
    console.log('Socket already connected, joining room immediately');
    socket.emit('joinRoom', { roomId, name, avatar });
  }
};

export const vote = (roomId, voteValue) => {
  if (socket) {
    socket.emit('vote', { roomId, vote: voteValue });
  }
};

export const showResults = (roomId) => {
  if (socket) {
    socket.emit('showResults', { roomId });
  }
};

export const resetVotes = (roomId) => {
  if (socket) {
    socket.emit('resetVotes', { roomId });
  }
};

export const startTimer = (roomId, duration) => {
  if (socket) {
    socket.emit('startTimer', { roomId, duration });
  }
};

export const throwEmoji = (roomId, emoji, targetId, sourceId) => {
  console.log('throwEmoji called:', { roomId, emoji, targetId, sourceId });
  if (socket) {
    console.log('Emitting throwEmoji event');
    socket.emit('throwEmoji', { roomId, emoji, targetId, sourceId });
  } else {
    console.error('Socket not available for emoji throw');
  }
};

export const updateAvatar = (roomId, avatar) => {
  if (socket) {
    socket.emit('updateAvatar', { roomId, avatar });
  }
};

export const updateUsername = (roomId, username) => {
  if (socket) {
    // Update the username in localStorage
    localStorage.setItem('userName', username);
    // Send the update to the server
    socket.emit('updateUsername', { roomId, username });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isInitialized = false;
  }
}; 