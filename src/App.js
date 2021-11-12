import { useState, useEffect } from "react";
// import { Button } from "@material-ui/core";
import VideoCall from "./VideoCall";
import { Spin } from "antd";

function App() {
  const [inCall, setInCall] = useState(false);
  const [uuid, setUuid] = useState("");
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("student");
  const [endMeeting, setEndMeeting] = useState(false);

  useEffect(() => {
    const startMeeting = async () => {
      const params = new URLSearchParams(window.location.search);
      const tmpChannelName = params.get("channelName");
      const tmpName = params.get("name");
      const tmpUserType = params.get("userType");
      if (tmpChannelName && tmpName && tmpUserType) {
        setChannelName(tmpChannelName);
        let tmpToken = await fetch(
          "https://young-springs-51421.herokuapp.com/getToken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channel: tmpChannelName,
            }),
          }
        );
        let token = await tmpToken.json();
        setUuid(tmpName);
        setUserType(tmpUserType);
        setToken(token.token);
        setInCall(true);
      }
    };
    startMeeting();

    return () => {};
  }, []);

  return (
    <div className="App" style={{ height: "100%" }}>
      {endMeeting ? (
        <div className="login-form">
          <h2>Thank you for your attention</h2>
        </div>
      ) : (
        <>
          {!inCall ? (
            <div className="login-form">
              <Spin tip="Preparing meeting..." />
            </div>
          ) : (
            <VideoCall
              setInCall={setInCall}
              uuid={uuid}
              setUuid={setUuid}
              channelName={channelName}
              token={token}
              userType={userType}
              setEndMeeting={setEndMeeting}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
