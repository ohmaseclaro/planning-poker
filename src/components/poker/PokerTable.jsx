import React, { useEffect } from 'react';
import { getUserPosition, getUserPixelCoordinates } from '../../utils/positionUtils';
import { calculateAverage, getClosestFibonacci } from '../../utils/calculationUtils';
import UserCard from './UserCard';

const PokerTable = ({
  theme,
  users,
  usersRef,
  userPositions,
  userPositionsRef,
  showResults,
  timer,
  roomId,
  travelingEmojis,
  emojis,
  onUserClick,
}) => {
  // Debug logging
  useEffect(() => {
    console.log('PokerTable rendered with users:', users);
    console.log('userPositions:', userPositions);
  }, [users, userPositions]);

  // Make the table bigger when there are more users
  const getTableSizeClass = () => {
    const userCount = users?.length || 0;

    if (userCount > 12) {
      return 'h-56 sm:h-60 md:h-64 w-[80%] sm:w-[75%] md:w-[70%] max-w-2xl'; // Bigger table for many users
    } else if (userCount > 8) {
      return 'h-52 sm:h-56 md:h-60 w-[80%] sm:w-[75%] md:w-[70%] max-w-xl'; // Medium table for moderate users
    } else {
      return 'h-48 sm:h-52 md:h-56 w-[80%] sm:w-[75%] md:w-[70%] max-w-lg'; // Default size
    }
  };

  // Determine if we need to scale down the user cards for more players
  const getUserCardSizeClass = () => {
    const userCount = users?.length || 0;

    if (userCount > 15) {
      return 'scale-75'; // Smaller user cards when many players
    } else if (userCount > 10) {
      return 'scale-90'; // Slightly smaller for moderate player count
    }

    return ''; // Default size
  };

  return (
    <div className="relative mb-8 mt-4 mx-auto px-8">
      {/* Results display outside the table */}
      {showResults && users && users.length > 0 && (
        <div className="mb-4 bg-gray-800 bg-opacity-80 p-3 rounded-lg mx-auto max-w-xs sm:max-w-sm md:max-w-md">
          <h3 className="text-lg font-bold text-white mb-2 text-center">Results</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {users
              .filter((user) => user.vote !== null)
              .map((user) => (
                <div key={user.id} className="flex flex-col items-center">
                  <div className="w-8 h-10 sm:w-10 sm:h-12 bg-blue-500 text-white rounded-md flex items-center justify-center text-sm font-bold shadow-md">
                    {user.vote}
                  </div>
                  <span className="text-xs text-white mt-1 whitespace-nowrap max-w-[60px] truncate">
                    {user.name}
                  </span>
                </div>
              ))}
          </div>
          <div className="flex justify-between text-white text-sm sm:text-base px-2">
            <p className="font-semibold">Average: {calculateAverage(users)}</p>
            <p className="font-semibold">Closest: {getClosestFibonacci(calculateAverage(users))}</p>
          </div>
        </div>
      )}

      {/* Timer display outside the table */}
      {timer > 0 && (
        <div className="mb-4 text-center">
          <p className="text-xl font-semibold text-white bg-gray-800 bg-opacity-80 inline-block px-4 py-1 rounded-full">
            Timer: {timer}s
          </p>
        </div>
      )}

      {/* Poker table wrapper - provides positioning context */}
      <div className="relative flex items-center justify-center">
        {/* Poker table */}
        <div
          className={`${
            theme.table
          } rounded-[40%_/30%] ${getTableSizeClass()} relative overflow-hidden shadow-xl mx-auto border-8 border-brown-800`}
        >
          {/* Table inner - felt with subtle design */}
          <div
            className={`absolute inset-3 ${theme.inner} rounded-[38%_/28%] flex items-center justify-center`}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md">
              Room: {roomId}
            </h2>
          </div>

          {/* Traveling emojis */}
          {travelingEmojis.map((emoji) => {
            // Get source and target positions
            const sourceCoords = getUserPixelCoordinates(
              emoji.sourceId,
              usersRef.current,
              userPositionsRef.current
            );
            const targetCoords = getUserPixelCoordinates(
              emoji.targetId,
              usersRef.current,
              userPositionsRef.current
            );

            return (
              <div
                key={emoji.id}
                className="absolute text-2xl animate-emoji-travel z-30"
                style={{
                  // Position at the source player initially
                  top: `calc(50% + ${sourceCoords.y}px)`,
                  left: `calc(50% + ${sourceCoords.x}px)`,
                  transformOrigin: 'center center',
                  // Use relative coordinates for the animation
                  '--travel-start-x': '0px',
                  '--travel-start-y': '0px',
                  '--travel-end-x': `${targetCoords.x - sourceCoords.x}px`,
                  '--travel-end-y': `${targetCoords.y - sourceCoords.y}px`,
                }}
              >
                {emoji.emoji}
              </div>
            );
          })}
        </div>

        {/* Users around the table - positioned outside */}
        {users && users.length > 0 ? (
          <div className={`absolute w-full h-full ${getUserCardSizeClass()}`}>
            {users.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                position={getUserPosition(user, index, userPositions, true)}
                onClick={() => onUserClick(user)}
                emojis={emojis.filter((e) => e.targetId === user.id)}
              />
            ))}
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            Waiting for players to join...
          </div>
        )}
      </div>
    </div>
  );
};

export default PokerTable;
