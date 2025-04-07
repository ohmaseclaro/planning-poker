import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  throwEmoji,
  vote,
  showResults as showResultsAction,
  resetVotes as resetVotesAction,
  updateAvatar as updateAvatarAction,
  joinRoom as joinRoomAction,
} from '../services/socketService';

// Import the logo
import yottaaLogo from '../assets/yottaa_logo.png';

// Custom hooks
import { useSocketEvents } from '../hooks/useSocketEvents';
import { useTheme } from '../hooks/useTheme';
import { useAvatar } from '../hooks/useAvatar';
import { useTimer } from '../hooks/useTimer';

// Components
import Header from './Header';
import PokerTable from './poker/PokerTable';
import VotingCards from './poker/VotingCards';
import ControlButtons from './poker/ControlButtons';

// Modals
import EmojiPickerModal from './modals/EmojiPickerModal';
import ThemePickerModal from './modals/ThemePickerModal';
import AvatarOptionsModal from './modals/AvatarOptionsModal';
import TimerPromptModal from './modals/TimerPromptModal';

const FIBONACCI_SEQUENCE = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
const EMOJIS = ['👍', '👎', '😊', '😂', '🎉', '👏', '🤔', '😴', '🔥', '❤️'];
const THEME_COLORS = [
  { name: 'Green', table: 'bg-green-700', inner: 'bg-green-600', bg: 'bg-green-800' },
  { name: 'Blue', table: 'bg-blue-700', inner: 'bg-blue-600', bg: 'bg-blue-800' },
  { name: 'Purple', table: 'bg-purple-700', inner: 'bg-purple-600', bg: 'bg-purple-800' },
  { name: 'Red', table: 'bg-red-700', inner: 'bg-red-600', bg: 'bg-red-800' },
  { name: 'Amber', table: 'bg-amber-700', inner: 'bg-amber-600', bg: 'bg-amber-800' },
  { name: 'Teal', table: 'bg-teal-700', inner: 'bg-teal-600', bg: 'bg-teal-800' },
];

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Check if username and auth token exist
  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const authToken = localStorage.getItem('authToken');

    if (!userName || !authToken) {
      console.log('Missing authentication information, redirecting to home page');
      navigate(`/?roomId=${roomId}`);
    } else {
      console.log('Authentication verified, proceeding to room');
    }
  }, [roomId, navigate]);

  // Initialize custom hooks
  const { theme, showThemePicker, setShowThemePicker, changeTheme } = useTheme();

  // First get the userAvatar from localStorage directly to initialize
  const initialAvatar = localStorage.getItem('userAvatar');

  // Now initialize socket with userAvatar
  const {
    socket,
    users,
    userPositions,
    userPositionsRef,
    showResults,
    setShowResults,
    timer,
    travelingEmojis,
    emojis,
    usersRef,
  } = useSocketEvents(roomId, initialAvatar);

  // Now initialize the avatar hook with the socket
  const {
    userAvatar,
    previewAvatar,
    showAvatarOptions,
    setShowAvatarOptions,
    getRandomAvatar,
    saveAvatar,
  } = useAvatar(socket, roomId);

  // Add a diagnostic effect to verify socket and users
  useEffect(() => {
    console.log('Room component - socket status:', socket ? 'connected' : 'not connected');
    console.log('Room component - users:', users);
  }, [socket, users]);

  // Effect to clear selected card when results are shown
  useEffect(() => {
    if (showResults) {
      setSelectedCard(null);
    }
  }, [showResults]);

  // Define handleShowResults - now just an auxiliary function
  // as the automatic timer-based results showing is handled in useSocketEvents
  const handleShowResults = () => {
    showResultsAction(roomId);
  };

  const {
    showTimerPrompt,
    setShowTimerPrompt,
    timerDuration,
    setTimerDuration,
    handleStartTimer,
    startTimer,
  } = useTimer(socket, roomId, handleShowResults);

  // Effect to update the server with the avatar when userAvatar changes
  useEffect(() => {
    if (socket && userAvatar) {
      updateAvatarAction(roomId, userAvatar);
    }
  }, [socket, userAvatar, roomId]);

  const handleCardSelect = (card) => {
    if (!showResults) {
      setSelectedCard(card);
      vote(roomId, card);
    }
  };

  const handleResetVotes = () => {
    resetVotesAction(roomId);
    setSelectedCard(null);
  };

  const handleUserClick = (user) => {
    if (socket && user.id !== socket.id) {
      setSelectedUser(user);
      setShowEmojiPicker(true);
    }
  };

  const handleThrowEmoji = (emoji) => {
    if (selectedUser && socket) {
      throwEmoji(roomId, emoji, selectedUser.id, socket.id);
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center p-2 sm:p-4`}>
      <Header
        isLoginPage={false}
        setShowThemePicker={setShowThemePicker}
        setShowAvatarOptions={setShowAvatarOptions}
      />

      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mt-14 sm:mt-16">
        {/* Poker table */}
        <PokerTable
          theme={theme}
          users={users}
          usersRef={usersRef}
          userPositions={userPositions}
          userPositionsRef={userPositionsRef}
          showResults={showResults}
          timer={timer}
          roomId={roomId}
          travelingEmojis={travelingEmojis}
          emojis={emojis}
          onUserClick={handleUserClick}
        />

        {/* Voting cards */}
        <VotingCards
          selectedCard={selectedCard}
          showResults={showResults}
          onCardSelect={handleCardSelect}
        />

        {/* Control buttons */}
        <ControlButtons
          showResults={showResults}
          onShowResults={handleShowResults}
          onStartTimer={handleStartTimer}
          onResetVotes={handleResetVotes}
        />

        {/* Modals */}
        <EmojiPickerModal
          show={showEmojiPicker}
          user={selectedUser}
          onEmojiClick={handleThrowEmoji}
          onClose={() => setShowEmojiPicker(false)}
        />

        <ThemePickerModal
          show={showThemePicker}
          currentTheme={theme}
          onThemeChange={changeTheme}
          onClose={() => setShowThemePicker(false)}
        />

        <AvatarOptionsModal
          show={showAvatarOptions}
          previewAvatar={previewAvatar}
          onGetRandom={getRandomAvatar}
          onSave={saveAvatar}
          onClose={() => setShowAvatarOptions(false)}
        />

        <TimerPromptModal
          show={showTimerPrompt}
          duration={timerDuration}
          onDurationChange={setTimerDuration}
          onStart={startTimer}
          onClose={() => setShowTimerPrompt(false)}
        />
      </div>
    </div>
  );
}

export default Room;
