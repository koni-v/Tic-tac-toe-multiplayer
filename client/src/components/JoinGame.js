import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

const JoinGame = () => {
  const [rivalUsername, setRivalUsername] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);

  const createChannel = async () => {
    const response = await client.queryUsers({ name: { $eq: rivalUsername } });
    console.log(response);

    if (response.users.length === 0) {
      alert("User not found");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.users[0].id],
    });

    await newChannel.watch();
    setChannel(newChannel);
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} />
        </Channel>
      ) : (
        <div className="joinGame">
          <input
            placeholder="Username of rival..."
            onChange={(e) => {
              setRivalUsername(e.target.value);
            }}
          />
          <button onClick={createChannel}>Join Game</button>
        </div>
      )}
    </>
  );
};

export default JoinGame;
