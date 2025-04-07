// Maximum expected users
export const MAX_USERS = 24; // Increased to support more players

// Configure the table shape
export const TABLE_CONFIG = {
  widthFactor: 1.4, // Makes the table moderately wider horizontally
  playerDistance: 30, // Position players just outside the table edge
};

export const getUserPosition = (user, index, positions, outside = false) => {
  // Use the stored position if available, otherwise fallback to index
  const position = positions[user.id] !== undefined ? positions[user.id] : index;
  
  // Calculate angle based on position
  const angle = (2 * Math.PI * position) / MAX_USERS;
  
  // Calculate position percentages - adjusting for oval table and whether player is outside
  const distanceFactor = outside ? TABLE_CONFIG.playerDistance : 14;
  
  // For oval table, adjust x position by the widthFactor
  return {
    top: `${50 + distanceFactor * Math.sin(angle)}%`,
    left: `${50 + (distanceFactor * TABLE_CONFIG.widthFactor * Math.cos(angle))}%`,
  };
};

export const getUserPixelCoordinates = (userId, users, positions) => {
  const user = users.find((u) => u.id === userId);
  if (!user) return { x: 0, y: 0 };

  // Use the stored position instead of current index
  const position = positions[userId] || 0;
  const tableRadius = 150; // Adjusted for better emoji animations

  const angle = (2 * Math.PI * position) / MAX_USERS;
  // Adjust for oval table shape
  const x = Math.cos(angle) * 0.7 * tableRadius * TABLE_CONFIG.widthFactor;
  const y = Math.sin(angle) * 0.7 * tableRadius;

  return { x, y };
};

// This is now just a client-side fallback in case server positions aren't available
export const findOptimalPositions = (existingPositions) => {
  // If there are no existing positions, start at position 0
  if (Object.keys(existingPositions).length === 0) {
    return 0;
  }

  // Get all current positions as numeric values
  const positionValues = Object.values(existingPositions);
  
  // If we have only one player, place the next one opposite (half way around the circle)
  if (positionValues.length === 1) {
    return (positionValues[0] + MAX_USERS / 2) % MAX_USERS;
  }
  
  // Sort positions for finding gaps
  const sortedPositions = [...positionValues].sort((a, b) => a - b);
  
  // Find the largest gap between consecutive positions
  let maxGap = 0;
  let gapStart = 0;
  
  for (let i = 0; i < sortedPositions.length; i++) {
    const current = sortedPositions[i];
    const next = sortedPositions[(i + 1) % sortedPositions.length];
    
    // Handle the wrap-around case when calculating the gap
    let gap;
    if (i === sortedPositions.length - 1) {
      // Gap between last and first position, considering the wrap around
      gap = MAX_USERS - current + next;
    } else {
      // Regular gap between consecutive positions
      gap = next - current;
    }
    
    // If this gap is larger than the current max, update maxGap and gapStart
    if (gap > maxGap) {
      maxGap = gap;
      gapStart = current;
    }
  }
  
  // Calculate the position in the middle of the largest gap
  let newPosition;
  if (gapStart === sortedPositions[sortedPositions.length - 1]) {
    // If the gap wraps around, we need special handling
    const middleOffset = Math.floor(maxGap / 2);
    newPosition = (gapStart + middleOffset) % MAX_USERS;
  } else {
    // For a regular gap, just find the middle
    const gapEnd = sortedPositions[sortedPositions.indexOf(gapStart) + 1];
    newPosition = gapStart + Math.floor((gapEnd - gapStart) / 2);
  }
  
  return newPosition;
}; 