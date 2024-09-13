import React, { useState } from "react";
import Board from "./Board";

const Game = ({ channel }) => {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );
  const [result, setResult] = useState({ winner: "none", state: "none" });

  channel.on("user.watching.start", (e) => {
    setPlayersJoined(e.watcher_count === 2);
  });

  if (!playersJoined) {
    // If there is only one player joined
    return <div>Waiting for other player to join</div>;
  }
  // If both of the players are joined
  return (
    <div className="gameContainer">
      <Board result={result} setResult={setResult} />
      {/* CHAT */}
      {/* LEAVE THE GAME BUTTON */}
    </div>
  );
};

export default Game;
