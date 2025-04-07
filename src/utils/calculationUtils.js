import { FIBONACCI_SEQUENCE } from '../constants/pokingPokerConstants';

export const calculateAverage = (users) => {
  const votes = users
    .map((user) => user.vote)
    .filter((vote) => vote !== null && vote !== "?");
  
  if (votes.length === 0) return 0;
  const sum = votes.reduce((a, b) => a + b, 0);
  return (sum / votes.length).toFixed(1);
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