import React from 'react';
import type { Card as CardType } from '../types';
import { Suit } from '../types';

interface CardProps {
  card: CardType | null;
  facedown?: boolean;
  isPlayable?: boolean;
  onClick?: () => void;
  className?: string;
  colored?: boolean;
}

const getSuitColorClass = (suit: Suit, colored: boolean): string => {
  if (!colored) {
    return 'text-black';
  }
  switch (suit) {
    case Suit.Hearts:
      return 'text-red-500';
    case Suit.Diamonds:
      return 'text-blue-600';
    case Suit.Clubs:
      return 'text-green-600';
    case Suit.Spades:
    default:
      return 'text-black';
  }
};


const Card: React.FC<CardProps> = ({ card, facedown = false, isPlayable, onClick, className = '', colored = false }) => {
  const baseClasses = 'w-24 h-36 md:w-32 md:h-48 rounded-lg shadow-lg transition-all duration-200';
  
  if (facedown || !card) {
    return (
      <div className={`${baseClasses} bg-white border-2 border-gray-300 flex items-center justify-center ${className}`}>
        <div className="w-16 h-24 md:w-20 md:h-28 border-2 border-gray-200 rounded-md bg-gray-50"></div>
      </div>
    );
  }

  const colorClass = getSuitColorClass(card.suit, colored);
  
  let dynamicClasses = '';
  if (isPlayable === true) {
      dynamicClasses = 'cursor-pointer ring-4 ring-yellow-400 hover:scale-105 hover:-translate-y-2';
  } else if (isPlayable === false) {
      dynamicClasses = 'opacity-60 cursor-not-allowed';
  }

  const clickHandler = isPlayable ? onClick : undefined;

  return (
    <div
      onClick={clickHandler}
      className={`${baseClasses} bg-white border-2 border-gray-300 flex flex-col items-center justify-center p-2 ${colorClass} ${dynamicClasses} ${className}`}
      aria-label={`${card.rank} of ${card.suit}`}
      role={isPlayable ? 'button' : 'img'}
      tabIndex={isPlayable ? 0 : -1}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && isPlayable && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="text-5xl md:text-7xl font-bold leading-none">{card.rank}</div>
      <div className="text-4xl md:text-6xl leading-none">{card.suit}</div>
    </div>
  );
};

export default Card;