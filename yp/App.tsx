import React, { useState, useCallback, useEffect } from 'react';
import type { Card as CardType, PokerHandInfo } from './types';
import { GameState } from './types';
import { createDeck, shuffleDeck } from './utils/deck';
import { checkPokerHand } from './utils/poker';
import { soundEngine } from './utils/sounds';
import Card from './components/Card';
import RemainingDeckView from './components/RemainingDeckView';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [deck, setDeck] = useState<CardType[]>([]);
  const [hand, setHand] = useState<CardType[]>([]);
  const [tableCard, setTableCard] = useState<CardType | null>(null);
  const [cardsPlayed, setCardsPlayed] = useState<number>(0);
  const [pokerHands, setPokerHands] = useState<PokerHandInfo[]>([]);
  const [message, setMessage] = useState<string>('Welcome to Yokohama Poker!');
  const [finalScore, setFinalScore] = useState<number>(0);

  const isCardPlayable = useCallback((card: CardType) => {
    if (!tableCard) return true;
    return card.suit === tableCard.suit || card.rank === tableCard.rank;
  }, [tableCard]);

  const handleStartGame = useCallback(() => {
    soundEngine.playStartSound();
    const newDeck = shuffleDeck(createDeck());
    const initialHand: CardType[] = [];
    for (let i = 0; i < 5; i++) {
        initialHand.push(newDeck.pop()!);
    }
    
    setDeck(newDeck);
    setHand(initialHand);
    setTableCard(null);
    setCardsPlayed(0);
    setPokerHands([]);
    setFinalScore(0);
    setGameState(GameState.InProgress);
    setMessage('Pick the first card from your hand.');

    const initialPokerHand = checkPokerHand(initialHand);
    if (initialPokerHand) {
        setPokerHands([initialPokerHand]);
        setMessage(`🎉 Initial hand is a ${initialPokerHand.name}!`);
        soundEngine.playPokerSound();
    }
  }, []);
  
  const calculateAndEndGame = useCallback(() => {
    const baseScore = cardsPlayed === 52 ? 100 : Math.floor(cardsPlayed / 3);
    const pokerBonus = pokerHands.reduce((sum, h) => sum + h.bonus, 0);
    setFinalScore(baseScore + pokerBonus);
    setGameState(GameState.GameOver);
    if (cardsPlayed === 52) {
        setMessage('🎉 All cards played! Congratulations!');
        soundEngine.playSuccessSound();
    }
  }, [cardsPlayed, pokerHands]);

  const handlePlayCard = useCallback((cardIndex: number) => {
    const selectedCard = hand[cardIndex];
    if (!isCardPlayable(selectedCard)) {
        soundEngine.playErrorSound();
        setMessage("You can't play that card!");
        return;
    }
    
    soundEngine.playCardSound(cardsPlayed + 1);

    // Update state
    const newHand = [...hand];
    const newDeck = [...deck];
    
    newHand.splice(cardIndex, 1);
    
    if (newDeck.length > 0) {
        newHand.splice(cardIndex, 0, newDeck.pop()!);
    }

    setTableCard(selectedCard);
    setHand(newHand);
    setDeck(newDeck);
    setCardsPlayed(prev => prev + 1);
    setMessage('Nice play!');

    // Check for poker hand
    if(newHand.length === 5) {
      const pokerHand = checkPokerHand(newHand);
      if (pokerHand) {
          setPokerHands(prev => [...prev, pokerHand]);
          setMessage(`🎉 You made a ${pokerHand.name}!`);
          soundEngine.playPokerSound();
      }
    }

  }, [hand, deck, cardsPlayed, isCardPlayable]);

  // Game Over Check
  useEffect(() => {
    if (gameState !== GameState.InProgress) return;
    
    if (deck.length === 0 && hand.length === 0) {
        calculateAndEndGame();
        return;
    }

    const canPlay = hand.some(card => isCardPlayable(card));
    if (!canPlay && hand.length > 0) {
        setMessage('No playable cards. Game Over.');
        calculateAndEndGame();
    }
  }, [hand, deck, gameState, isCardPlayable, calculateAndEndGame]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (gameState === GameState.NotStarted) {
        if (key === ' ') {
          e.preventDefault();
          handleStartGame();
        }
      } else if (gameState === GameState.GameOver) {
        const playAgainKeys = ['a', 's', 'd', 'f', 'g', ' '];
        if (playAgainKeys.includes(key)) {
          e.preventDefault();
          handleStartGame();
        }
      } else if (gameState === GameState.InProgress) {
        const keyMap: Record<string, number> = { 'a': 0, 's': 1, 'd': 2, 'f': 3, 'g': 4 };
        const index = keyMap[key];

        if (index !== undefined) {
          e.preventDefault();
          const card = hand[index];
          if (card) {
            if (isCardPlayable(card)) {
              handlePlayCard(index);
            } else {
              soundEngine.playErrorSound();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, hand, isCardPlayable, handlePlayCard, handleStartGame]);

  const renderGameArea = () => {
    const keyMap = ['A', 'S', 'D', 'F', 'G'];
    const pokerBonus = pokerHands.reduce((sum, h) => sum + h.bonus, 0);
    const currentScore = (cardsPlayed === 52 ? 100 : Math.floor(cardsPlayed / 3)) + pokerBonus;

    return (
      <div className="w-full h-full flex flex-col items-center justify-between p-4 space-y-4">
        {/* Top Stats */}
        <div className="w-full flex justify-between items-center text-lg p-2 bg-slate-900/50 rounded-lg">
          <div className="font-bold">Cards Played: <span className="text-yellow-400">{cardsPlayed} / 52</span></div>
          <div className="font-bold">Score: <span className="text-green-400">{currentScore}</span></div>
        </div>

        {/* Table Area */}
        <div className="flex-grow w-full flex items-center justify-center space-x-8">
            <div className="flex flex-col items-center">
                <div className="relative w-24 h-36 md:w-32 md:h-48">
                    <Card card={null} facedown={true} />
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-500 text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center">
                        {deck.length}
                    </div>
                </div>
                <h2 className="text-xl font-bold mt-2">Deck</h2>
            </div>
            <div className="flex flex-col items-center">
                <Card card={tableCard} />
                <h2 className="text-xl font-bold mt-2">Table</h2>
            </div>
        </div>
        
        {/* Message Area */}
        <div className="text-center min-h-[3rem]">
          <p className="text-2xl italic font-semibold text-yellow-300">{message}</p>
        </div>

        {/* Player Hand & Remaining Deck */}
        <div className="flex flex-col items-center">
            <div className="flex justify-center items-end space-x-4">
                {hand.map((card, i) => (
                  <div key={`${card.rank}-${card.suit}-${i}`} className="flex flex-col items-center">
                    <Card card={card} isPlayable={isCardPlayable(card)} onClick={() => handlePlayCard(i)} colored={true} />
                    <div className="mt-2 text-lg font-mono font-bold bg-slate-700 px-3 py-1 rounded-md">{keyMap[i]}</div>
                  </div>
                ))}
                {/* Placeholders for empty hand slots */}
                {[...Array(5 - hand.length)].map((_, i) => (
                    <div key={`placeholder-${i}`} className="w-24 h-36 md:w-32 md:h-48 border-2 border-dashed border-slate-600 rounded-lg"></div>
                ))}
            </div>
            <h2 className="text-2xl font-bold mt-4 text-red-500">Your Hand</h2>
            <RemainingDeckView deck={deck} hand={hand} />
        </div>
      </div>
    );
  }

  const renderStartScreen = () => (
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Yokohama Poker</h1>
        <p className="text-xl mb-8">A game where you try to play all 52 cards by matching suit or rank.</p>
        <button onClick={handleStartGame} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-2xl font-bold transition-transform transform hover:scale-105">Start Game</button>
      </div>
  );

  const renderGameOverScreen = () => {
    const baseScore = finalScore - pokerHands.reduce((sum, h) => sum + h.bonus, 0);

    return (
      <div className="text-center bg-slate-800 p-8 rounded-xl shadow-2xl">
        <h1 className="text-5xl font-bold mb-4">Game Over</h1>
        <p className="text-3xl mb-6">{message}</p>
        
        <div className="text-2xl mb-4">Final Score: <span className="font-bold text-green-400">{finalScore}</span></div>
        <div className="text-left w-80 mx-auto bg-slate-700 p-4 rounded-lg">
          <p>Base Score: {baseScore} pts</p>
          <p>Poker Hand Bonus:</p>
          {pokerHands.length > 0 ? (
            <ul className="list-disc list-inside ml-4">
              {pokerHands.map((h, i) => <li key={i}>{h.name}: +{h.bonus} pts</li>)}
            </ul>
          ) : ( <p className="ml-4">None</p> )}
        </div>
        
        <button onClick={handleStartGame} className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-2xl font-bold transition-transform transform hover:scale-105">Play Again</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-slate-800 to-slate-900">
      {gameState === GameState.NotStarted && renderStartScreen()}
      {gameState === GameState.GameOver && renderGameOverScreen()}
      {gameState === GameState.InProgress && renderGameArea()}
    </main>
  );
};

export default App;