import { useState } from "react";
import { Button } from "@material-ui/core";
import VideoCall from "./VideoCall";

function App() {
  const [inCall, setInCall] = useState(false);
  const [uuid, setUuid] = useState("");
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState("");

  const handleJoin = async () => {
    let tmpToken = await fetch(
      "https://young-springs-51421.herokuapp.com/getToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: channelName,
        }),
      }
    );
    let token = await tmpToken.json();
    console.log("test - token ", token);
    setToken(token.token);
    setInCall(true);
  };

  return (
    <div className="App" style={{ height: "100%" }}>
      {inCall ? (
        <VideoCall
          setInCall={setInCall}
          uuid={uuid}
          setUuid={setUuid}
          channelName={channelName}
          token={token}
        />
      ) : (
        <>
          <h2>Input Channel Name</h2>
          <input
            type="text"
            placeholder="Enter Channel name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <h2>Input your name</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoin}
            disabled={!uuid || !channelName}
            className="join-btn"
          >
            Join Call
          </Button>
        </>
      )}
    </div>
  );
}

export default App;
