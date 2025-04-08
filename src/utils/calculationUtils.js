import { FIBONACCI_SEQUENCE } from '../constants/pokingPokerConstants';

export const calculateAverage = (users) => {
  const votes = users
    .map((user) => user.vote)
    .filter((vote) => vote !== null && vote !== "?");
  
  if (votes.length === 0) return 0;
  const sum = votes.reduce((a, b) => a + b, 0);
  return (sum / votes.length).toFixed(1);
};

export const calculateMedian = (users) => {
  const votes = users
    .map((user) => user.vote)
    .filter((vote) => vote !== null && vote !== "?");
  
  if (votes.length === 0) return 0;
  
  // Sort votes in ascending order
  const sortedVotes = [...votes].sort((a, b) => a - b);
  
  // Get the middle value (or average of the two middle values)
  const mid = Math.floor(sortedVotes.length / 2);
  
  return sortedVotes.length % 2 === 0
    ? ((sortedVotes[mid - 1] + sortedVotes[mid]) / 2).toFixed(1)
    : sortedVotes[mid].toFixed(1);
};

export const getClosestFibonacci = (avg) => {
  if (avg === 0) return 0;
  const average = parseFloat(avg);
  // Filter out "?" from the sequence when finding closest match
  const sequence = FIBONACCI_SEQUENCE.filter(item => typeof item === 'number');
  return sequence.reduce((prev, curr) => {
    return Math.abs(curr - average) < Math.abs(prev - average) ? curr : prev;
  });
}; 