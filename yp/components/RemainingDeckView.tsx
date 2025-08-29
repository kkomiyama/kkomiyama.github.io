import React from 'react';
import type { Card as CardType } from '../types';
import { Suit } from '../types';

interface RemainingDeckViewProps {
  deck: CardType[];
  hand: CardType[];
}

const RANKS_ORDER: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const getSuitColorClass = (suit: Suit): string => {
  switch (suit) {
    case Suit.Hearts:
      return 'text-red-400';
    case Suit.Diamonds:
      return 'text-blue-400';
    case Suit.Clubs:
      return 'text-green-400';
    case Suit.Spades:
    default:
      return 'text-gray-300';
  }
};

const SUITS_ORDER = [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs];

const RemainingDeckView: React.FC<RemainingDeckViewProps> = ({ deck, hand }) => {
  const deckCards = new Set(deck.map(c => `${c.suit}-${c.rank}`));
  const handCards = new Set(hand.map(c => `${c.suit}-${c.rank}`));
  
  return (
    <div className="w-full max-w-lg mx-auto mt-4 p-3 bg-slate-900/60 rounded-lg backdrop-blur-sm">
      <h3 className="text-center text-base font-bold mb-2 text-gray-300">Remaining Deck</h3>
      <div className="font-mono text-xs space-y-1">
        {SUITS_ORDER.map(suit => (
          <div key={suit} className="flex items-center gap-2">
            <span className={`w-5 text-lg ${getSuitColorClass(suit)}`}>{suit}</span>
            <div className="flex-1 flex gap-1 justify-start flex-wrap">
              {RANKS_ORDER.map(rank => {
                const cardId = `${suit}-${rank}`;
                let className = '';

                if (handCards.has(cardId)) {
                  className = 'text-red-500 font-bold'; // In hand
                } else if (deckCards.has(cardId)) {
                  className = 'text-yellow-400 font-bold'; // In deck
                } else {
                  className = 'text-slate-600'; // Played
                }
                
                return (
                  <span 
                    key={rank} 
                    className={`w-6 text-center px-1 rounded-sm ${className}`}
                  >
                    {rank}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RemainingDeckView;
