import React from 'react';

const UserCard = ({ user, position, onClick, emojis }) => {
  return (
    <div
      className="absolute flex flex-col items-center z-10"
      style={{
        ...position,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-md mb-1 sm:mb-2 overflow-hidden cursor-pointer border-2 border-white"
        onClick={onClick}
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-sm sm:text-base md:text-lg font-bold text-gray-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="text-xs sm:text-sm font-bold text-white bg-black bg-opacity-70 px-2 py-0.5 rounded-full whitespace-nowrap text-center max-w-[80px] sm:max-w-[100px] truncate shadow-md">
        {user.name}
      </span>

      {/* Emoji animations at destination */}
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-xl sm:text-2xl animate-bounce-in z-20"
          style={{
            top: '-20px',
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
};

export default UserCard;
