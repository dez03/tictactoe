import React, { useState, useEffect } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="game-square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winner }) {
  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <h1 className="game-title">TicTacToe</h1>
      <div className="game-status">{status}</div>
      <div className="board-container">
        <div className="board">
          <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
            <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
            <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
          </div>
          <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
            <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
            <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
          </div>
          <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
            <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
            <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
          </div>
        </div>
      </div>
      {winner && <Confetti />}
    </>
  );
}

function Confetti() {
  useEffect(() => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    container.style.overflow = "hidden";
    document.body.appendChild(container);

    const confettiCount = 20;
    const colors = ["🎊", "🎉", "✨"];

    for (let i = 0; i < confettiCount; i++) {
      const element = document.createElement("div");
      element.innerHTML = colors[Math.floor(Math.random() * colors.length)];
      element.style.position = "absolute";
      element.style.fontSize = `${Math.random() * 10 + 20}px`;
      element.style.left = `${Math.random() * 100}vw`;
      element.style.top = "-20px";

      // Unique animation duration for each piece
      const fallDuration = 2 + Math.random() * 2;
      const swayDuration = 1 + Math.random();

      element.style.animation = `
        confettiFall${i} ${fallDuration}s linear forwards,
        confettiSway${i} ${swayDuration}s ease-in-out infinite alternate
      `;

      container.appendChild(element);

      // Create unique keyframes for each piece
      const keyframes = document.createElement("style");
      const initialRotation = Math.random() * 360;
      const finalRotation = initialRotation + 360 + Math.random() * 360;
      const swayAmount = 30 + Math.random() * 30;

      keyframes.textContent = `
        @keyframes confettiFall${i} {
          0% {
            transform: translateY(-20px) rotate(${initialRotation}deg);
          }
          100% {
            transform: translateY(100vh) rotate(${finalRotation}deg);
          }
        }
        
        @keyframes confettiSway${i} {
          0% {
            margin-left: -${swayAmount}px;
          }
          100% {
            margin-left: ${swayAmount}px;
          }
        }
      `;
      document.head.appendChild(keyframes);

      // Clean up this piece when animation ends
      element.addEventListener("animationend", (e) => {
        if (e.animationName.startsWith("confettiFall")) {
          element.remove();
          keyframes.remove();
        }
      });
    }

    return () => {
      container.remove();
      // Clean up any remaining style tags
      document.querySelectorAll("style").forEach((style) => {
        if (
          style.textContent.includes("confettiFall") ||
          style.textContent.includes("confettiSway")
        ) {
          style.remove();
        }
      });
    };
  }, []);

  return null;
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
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

  const winner = calculateWinner(currentSquares);

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move} className="history-item">
        <button className="history-button" onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="game-layout">
          <div className="game-board-container">
            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
              winner={winner}
            />
          </div>
          <div className="game-history">
            <h2 className="history-title">Game History</h2>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    </div>
  );
}
