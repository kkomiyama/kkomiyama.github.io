export enum Suit {
  Spades = '♠',
  Hearts = '♥',
  Diamonds = '♦',
  Clubs = '♣',
}

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export enum GameState {
  NotStarted = 'NOT_STARTED',
  InProgress = 'IN_PROGRESS',
  GameOver = 'GAME_OVER',
}

export interface PokerHandInfo {
  name: string;
  bonus: number;
}
