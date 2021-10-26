import { useState } from "react";
import { Button } from "@material-ui/core";
import VideoCall from "./VideoCall";

function App() {
  const [inCall, setInCall] = useState(false);
  const [uuid, setUuid] = useState("");

  return (
    <div className="App" style={{ height: "100%" }}>
      {inCall ? (
        <VideoCall setInCall={setInCall} uuid={uuid} setUuid={setUuid} />
      ) : (
        <>
          <p>input your ID for testing</p>
          <input
            type="text"
            placeholder="Enter your ID"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setInCall(true)}
            disabled={!uuid}
          >
            Join Call
          </Button>
        </>
      )}
    </div>
  );
}

export default App;
