import type { Card, PokerHandInfo } from '../types';

export function checkPokerHand(hand: Card[]): PokerHandInfo | null {
  if (hand.length !== 5) return null;

  const ranks = hand.map(c => c.value).sort((a, b) => a - b);
  const suits = hand.map(c => c.suit);
  const rankCounts = ranks.reduce((acc, rank) => {
    acc[rank] = (acc[rank] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  const counts = Object.values(rankCounts).sort((a, b) => b - a);

  const isFlush = new Set(suits).size === 1;
  
  const uniqueRanks = [...new Set(ranks)];
  let isStraight = false;
  if (uniqueRanks.length === 5) {
      // Normal straight
      if (uniqueRanks[4] - uniqueRanks[0] === 4) {
          isStraight = true;
      }
      // A-2-3-4-5 straight
      if (JSON.stringify(uniqueRanks) === JSON.stringify([2, 3, 4, 5, 14])) {
          isStraight = true;
      }
  }

  if (isStraight && isFlush) {
      if (JSON.stringify(uniqueRanks) === JSON.stringify([10, 11, 12, 13, 14])) return { name: "Royal Flush", bonus: 100 };
      return { name: "Straight Flush", bonus: 20 };
  }
  if (counts[0] === 4) return { name: "Four of a Kind", bonus: 5 };
  if (counts[0] === 3 && counts[1] === 2) return { name: "Full House", bonus: 2 };
  if (isFlush) return { name: "Flush", bonus: 1 };
  if (isStraight) return { name: "Straight", bonus: 1 };
  if (counts[0] === 3) return { name: "Three of a Kind", bonus: 1 };
  
  return null;
}