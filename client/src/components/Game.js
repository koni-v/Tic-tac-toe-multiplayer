import React, { useState } from "react";

const Game = ({ channel }) => {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );

  channel.on("user.watching.start", (e) => {
    setPlayersJoined(e.watcher_count === 2);
  });

  if (!playersJoined) {
    // If there is only one player joined
    return <div>Waiting for other player to join</div>;
  }
  // If both of the players are joined
  return <div>game</div>;
};

export default Game;
