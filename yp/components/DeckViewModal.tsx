import React from 'react';
import type { Card as CardType } from '../types';
import { Suit } from '../types';

interface DeckViewModalProps {
  deck: CardType[];
  onClose: () => void;
}

const RANKS_ORDER: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const getSuitColorClass = (suit: Suit, onDarkBg: boolean = false): string => {
  switch (suit) {
    case Suit.Hearts:
      return onDarkBg ? 'text-red-400' : 'text-red-500';
    case Suit.Diamonds:
      return onDarkBg ? 'text-blue-400' : 'text-blue-600';
    case Suit.Clubs:
      return onDarkBg ? 'text-green-400' : 'text-green-600';
    case Suit.Spades:
    default:
      return onDarkBg ? 'text-gray-300' : 'text-black';
  }
};


const DeckViewModal: React.FC<DeckViewModalProps> = ({ deck, onClose }) => {
    const deckBySuit: Record<Suit, CardType[]> = {
        [Suit.Spades]: [],
        [Suit.Hearts]: [],
        [Suit.Diamonds]: [],
        [Suit.Clubs]: [],
    };
    
    deck.forEach(card => deckBySuit[card.suit].push(card));
    
    const SUITS_ORDER = [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-4xl w-full text-white max-h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Remaining Deck ({deck.length} cards)</h2>
                    <button onClick={onClose} className="text-3xl font-bold leading-none hover:text-yellow-400">&times;</button>
                </div>
                <div className="space-y-4">
                    {SUITS_ORDER.map(suit => {
                        const cards = deckBySuit[suit];
                        const suitColor = getSuitColorClass(suit, true);
                        return (
                            <div key={suit}>
                                <h3 className={`text-xl font-semibold mb-2 flex items-center gap-2 ${suitColor}`}>
                                    <span>{suit}</span> 
                                    <span>({cards.length} cards)</span>
                                </h3>
                                <div className="grid grid-cols-7 md:grid-cols-13 gap-1 text-slate-900">
                                    {RANKS_ORDER.map(rank => {
                                        const card = cards.find(c => c.rank === rank);
                                        const cardTextColor = card ? getSuitColorClass(card.suit) : '';
                                        return (
                                            <div key={rank} className={`aspect-w-2 aspect-h-3 rounded flex items-center justify-center font-bold text-lg ${card ? 'bg-white' : 'bg-slate-700 text-slate-500'}`}>
                                                {card ? (
                                                    <div className={cardTextColor}>
                                                        {card.rank}
                                                    </div>
                                                ) : (
                                                    <span className="opacity-50">{rank}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default DeckViewModal;