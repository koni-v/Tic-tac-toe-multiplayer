import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";

const Board = ({ result, setResult }) => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]); // the state of each square
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const [gameOver, setGameOver] = useState(false);

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    if (gameOver) return; // Skip win/tie check if the game is over
    checkWin();
    checkTie();
  }, [board]);

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "" && !gameOver) {
      // Update the board first
      const updatedBoard = [...board];
      updatedBoard[square] = player;

      // Set the board state and wait for it to update
      setBoard(updatedBoard);

      // Send move event to the channel
      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });

      // Update turn and gameOver state
      setTurn(player === "X" ? "O" : "X");
      setGameOver(false);

      // Perform win/tie check after the board is updated
      checkWin();
      checkTie();
    }
  };

  const checkWin = () => {
    Patterns.forEach((currentPattern) => {
      const firstPlayer = board[currentPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      currentPattern.forEach((index) => {
        if (board[index] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({ winner: board[currentPattern[0]], state: "won" });
        setGameOver(true);
        // Use a timeout to ensure the board update is reflected
        setTimeout(() => alert(`Winner: ${board[currentPattern[0]]}`), 0);
      }
    });
  };

  const checkTie = () => {
    if (board.every((square) => square !== "")) {
      setResult({ winner: "none", state: "tie" });
      setGameOver(true);
      // Use a timeout to ensure the board update is reflected
      setTimeout(() => alert("Game ties"), 0);
    }
  };

  useEffect(() => {
    // Ensure that the channel listener is properly cleaned up
    const handleGameMove = (event) => {
      if (event.user.id !== client.userID) {
        const currentPlayer = event.data.player === "X" ? "O" : "X";
        setPlayer(currentPlayer);
        setTurn(currentPlayer);

        const updatedBoard = [...board];
        updatedBoard[event.data.square] = event.data.player;

        setBoard(updatedBoard);
      }
    };

    channel.on("game-move", handleGameMove);

    return () => {
      channel.off("game-move", handleGameMove);
    };
  }, [board, channel, client.userID]);

  return (
    <div className="board">
      <div className="row">
        <Square chooseSquare={() => chooseSquare(0)} val={board[0]} />
        <Square chooseSquare={() => chooseSquare(1)} val={board[1]} />
        <Square chooseSquare={() => chooseSquare(2)} val={board[2]} />
      </div>
      <div className="row">
        <Square chooseSquare={() => chooseSquare(3)} val={board[3]} />
        <Square chooseSquare={() => chooseSquare(4)} val={board[4]} />
        <Square chooseSquare={() => chooseSquare(5)} val={board[5]} />
      </div>
      <div className="row">
        <Square chooseSquare={() => chooseSquare(6)} val={board[6]} />
        <Square chooseSquare={() => chooseSquare(7)} val={board[7]} />
        <Square chooseSquare={() => chooseSquare(8)} val={board[8]} />
      </div>
    </div>
  );
};

export default Board;
