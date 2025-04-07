# Yottaa Planner (Planning Poker)

A real-time Planning Poker application for agile teams to estimate tasks collaboratively.

## Features

- **Real-time collaboration**: Join rooms with your team for synchronized estimation
- **Secure access**: Password protection for rooms
- **Customizable avatars**: Choose avatars to represent yourself
- **Theme customization**: Multiple color themes to personalize your experience
- **Interactive timer**: Set timers for voting sessions
- **Emoji reactions**: React to team members with emojis
- **Responsive design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React, React Router, TailwindCSS
- **State Management**: React Hooks and Context API
- **Real-time Communication**: WebSocket (Socket.io)
- **Authentication**: JWT token-based authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd planning-poker
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Join a room**:

   - Enter your name
   - Enter a room ID (create a new room or join an existing one)
   - Enter the password (if required)

2. **Start estimating**:

   - Click on a card to submit your vote
   - Use the "Show Results" button to reveal all votes
   - Use the "Reset" button to start a new voting round
   - Set a timer to automatically reveal votes after a specified duration

3. **Customization**:

   - Click the theme button (🎨) to change the table color theme
   - Click the avatar button (👤) to customize your avatar

4. **Interaction**:
   - Click on another user to send them an emoji reaction

## Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
planning-poker/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── yottaa_logo.png
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Home.jsx
│   │   ├── Room.jsx
│   │   ├── modals/
│   │   │   ├── AvatarOptionsModal.jsx
│   │   │   ├── EmojiPickerModal.jsx
│   │   │   ├── ThemePickerModal.jsx
│   │   │   └── TimerPromptModal.jsx
│   │   └── poker/
│   │       ├── ControlButtons.jsx
│   │       ├── PokerTable.jsx
│   │       ├── UserCard.jsx
│   │       └── VotingCards.jsx
│   ├── hooks/
│   │   ├── useAvatar.js
│   │   ├── useSocketEvents.js
│   │   ├── useTheme.js
│   │   └── useTimer.js
│   ├── services/
│   │   └── socketService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Future Enhancements

- User authentication with email/password
- Persistent room history
- Export estimation results
- Custom voting scales (besides Fibonacci)
- Chat functionality
- Jira integration

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by agile planning poker techniques
- Built for teams who need simple, effective estimation tools
