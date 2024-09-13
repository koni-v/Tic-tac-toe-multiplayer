import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";

const Board = ({ result, setResult }) => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]); // the state of each square
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    checkWin();
    checkTie();
  }, [board]);

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X");

      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });
      setBoard(
        board.map((value, index) => {
          if (index === square && value === "") {
            return player;
          }
          return value;
        })
      );
    }
  };

  const checkWin = () => {
    Patterns.forEach((currentPattern) => {
      const firstPlayer = board[currentPattern[0]];
      if (firstPlayer == "") return;
      let foundWinningPattern = true;
      currentPattern.forEach((index) => {
        if (board[index] != firstPlayer) {
          foundWinningPattern = false;
        }
      });

      if (foundWinningPattern) {
        setResult({ winner: board[currentPattern[0]], state: "won" });
        alert(`Winner: ${board[currentPattern[0]]}`);
      }
    });
  };

  const checkTie = () => {
    let field = true;
    board.forEach((square) => {
      if (square == "") {
        field = false;
      }
    });

    if (field) {
      setResult({ winner: "none", state: "tie" });
      alert("Game ties");
    }
  };

  channel.on("game-move", (event) => {
    if (event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(
        board.map((value, index) => {
          if (index === event.data.square && value === "") {
            return event.data.player;
          }
          return value;
        })
      );
    }
  });

  return (
    <div className="board">
      <div className="row">
        <Square
          chooseSquare={() => {
            chooseSquare(0);
          }}
          val={board[0]}
        />
        <Square
          chooseSquare={() => {
            chooseSquare(1);
          }}
          val={board[1]}
        />
        <Square
          chooseSquare={() => {
            chooseSquare(2);
          }}
          val={board[2]}
        />
      </div>
      <div className="row">
        <Square
          chooseSquare={() => {
            chooseSquare(3);
          }}
          val={board[3]}
        />
        <Square
          chooseSquare={() => {
            chooseSquare(4);
          }}
          val={board[4]}
        />
        <Square
          chooseSquare={() => {
            chooseSquare(5);
          }}
          val={board[5]}
        />
      </div>
      <div className="row">
        <Square
          chooseSquare={() => {
            chooseSquare(6);
          }}
          val={board[6]}
        />
        <Square
          chooseSquare={() => {
            chooseSquare(7);
          }}
          val={board[7]}
        />
        <Square
          chooseSquare={() => {
            chooseSquare(8);
          }}
          val={board[8]}
        />
      </div>
    </div>
  );
};

export default Board;
