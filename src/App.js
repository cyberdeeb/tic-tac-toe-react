import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  const [showConfetti, setShowConfetti] = useState(false);
  const result = calculateWinner(squares);
  const winner = result.winner;
  const line = result.line;

  useEffect(() => {
    if (winner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, winner);

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} highlight={winningLine.includes(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} highlight={winningLine.includes(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} highlight={winningLine.includes(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} highlight={winningLine.includes(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} highlight={winningLine.includes(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} highlight={winningLine.includes(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} highlight={winningLine.includes(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} highlight={winningLine.includes(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} highlight={winningLine.includes(8)} />
      </div>
    </>
  );
}

export default function Game() {
  
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const[currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}