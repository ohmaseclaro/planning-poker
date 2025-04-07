// Server-side position utilities for player arrangement
export const MAX_USERS = 24; // Increased to support more players

/**
 * Find the optimal position for a new player on the circular table
 * @param existingPositions - Map of player IDs to positions
 * @returns The optimal position for a new player
 */
export const findOptimalPosition = (existingPositions: Record<string, number>): number => {
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

module.exports = {
  MAX_USERS,
  findOptimalPosition,
}; 