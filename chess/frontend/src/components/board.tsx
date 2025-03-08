import { useState } from "react";
import { pieces } from './../assets/pieces.ts';
import { ChessBoardProps } from "../constants/Constants.ts";
import { Square } from "chess.js";

export default function ChessBoard({
  ChessBoard,
  player_color,
  MessageMove,
  board,
  SetBoard,
  capturedWhite,
  capturedBlack,
  handleMove,
}: ChessBoardProps) {
  const [from, SetFrom] = useState<Square | null>(null);
  
  // New state to track the current turn from the chess engine
  const [currentTurn, setCurrentTurn] = useState<string>(ChessBoard.turn());
  const Notify = new Audio('./notify.mp3');

  // Update clickable status whenever currentTurn or player_color changes
  

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLElement)) return;
    
    // If it's not your turn, don't allow moves
    if (currentTurn !== player_color) {
      alert("It's not your turn!");
      return;
    }

    const clickedSquare = e.currentTarget.id as Square;
    if (from === null) {
      SetFrom(clickedSquare);
    } else {
      try {
        const moveResult = ChessBoard.move({ from, to: clickedSquare });
        if (moveResult) {
          SetBoard(ChessBoard.board());
          MessageMove({ from: from, to: clickedSquare });
          handleMove(moveResult);
          // Update current turn after a successful move
          setCurrentTurn(ChessBoard.turn());
        }
      } catch (err) {
        console.error("Invalid move", err);
        Notify.play();
      }
      SetFrom(null);
    }

    if (ChessBoard.isGameOver()) {
      alert("Game Over");
    }
  };

  return (
    <div className="flex pl-3 z-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl rounded-l-none">
      {/* Chessboard */}
      <div
        className={`z-10 bg-opacity-0 w-[50%] min-w-[12cm] flex flex-wrap ${player_color === 'b' ? 'rotate-180' : ''}`}
      >
        {board.map((row, i) => (
          <div key={i} className={`flex w-full ${player_color === 'b' ? 'rotate-180' : ''}`}>
            {row.map((element, j) => {
              const squareId = String.fromCharCode(97 + j) + String(8 - i); // e.g., 'a1', 'b3', etc.
              const isSelected = squareId === from;
              return (
                <div
                  key={squareId}
                  onClick={handleClick}
                  id={squareId}
                  className={`w-[calc(100%/8)] aspect-square opacity-90
                    ${(i + j) % 2 === 0 ? 'bg-white' : 'bg-gray-500'}
                    ${isSelected ? "border-2 border-blue-500 bg-red-500 rounded-md shadow-[0_0_15px_rgba(59,130,246,0.75)] animate-pulse text-white" : ""}
                  `}
                >
                  {element !== null && (
                    <div className="text-6xl hover:text-7xl text-center py-1 hover:shadow-green-500 hover:shadow-2xl">
                      {pieces[element.color + element.type]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Captured Pieces Section */}
      <div className="flex flex-col justify-start items-center w-1/4 p-4 bg-gradient-to-b from-gray-800 to-black rounded-lg shadow-lg border border-gray-600">
        <div className="text-white text-xl mb-4 font-bold">Captured Pieces</div>
        <div className="w-full">
          {/* Your Captured Pieces */}
          <div className="text-white text-lg mb-2 font-semibold border-b border-gray-500 pb-2">
            Your Captures:
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {player_color === 'w'
              ? capturedWhite.map((piece, index) => (
                  <div key={index} className="text-4xl bg-gray-700 rounded-full p-2 shadow-md">
                    {pieces['w' + piece]}
                  </div>
                ))
              : capturedBlack.map((piece, index) => (
                  <div key={index} className="text-4xl bg-gray-700 rounded-full p-2 shadow-md">
                    {pieces['b' + piece]}
                  </div>
                ))}
          </div>
          {/* Opponent's Captured Pieces */}
          <div className="text-white text-lg mb-2 font-semibold border-b border-gray-500 pb-2">
            Opponent's Captures:
          </div>
          <div className="flex flex-wrap gap-2">
            {player_color === 'w'
              ? capturedBlack.map((piece, index) => (
                  <div key={index} className="text-4xl bg-gray-700 rounded-full p-2 shadow-md">
                    {pieces['b' + piece]}
                  </div>
                ))
              : capturedWhite.map((piece, index) => (
                  <div key={index} className="text-4xl bg-gray-700 rounded-full p-2 shadow-md">
                    {pieces['w' + piece]}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
