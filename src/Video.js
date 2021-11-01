import { AgoraVideoPlayer } from "agora-rtc-react";
import { Grid, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import db from "./configFireBase";

export default function Video(props) {
  const { users, tracks, uuid } = props;
  const [gridSpacing, setGridSpacing] = useState(12);
  const usersRef = doc(db, "users", new Date().getTime().toString());

  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
  }, [users, tracks]);
  console.log("test - users video component", users);

  const hostToggleMicOfPaticipant = async (uid, status) => {
    console.log("test - hostToggleMicOfPaticipant uid ", uid);
    console.log("test - hostToggleMicOfPaticipant status ", status);
    if (uuid == "host") {
      const updateTimestamp = await setDoc(usersRef, {
        name: "test 8",
        uid: uid,
        status: status ? false : true,
        type: "mic", // "cam", "survey",
        timestamp: new Date().getTime(),
        value: "one", // "one"
      });
    } else return void 0;
  };

  const hostToggleCamOfPaticipant = async (uid, status) => {
    if (uuid == "host") {
      const updateTimestamp = await setDoc(usersRef, {
        name: "test 8",
        uid: uid,
        status: status ? false : true,
        type: "cam", // "cam", "survey",
        timestamp: new Date().getTime(),
        value: "one", // "one"
      });
    } else return void 0;
  };

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={gridSpacing} style={{ padding: "10px" }}>
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          style={{ height: "100%", width: "100%" }}
          audioTrack={tracks[0]}
        />
      </Grid>
      {users.length > 0 &&
        users.map((user, index) => {
          if (user.videoTrack) {
            return (
              <Grid
                item
                xs={gridSpacing}
                style={{ padding: "10px", position: "relative" }}
                key={index}
              >
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  audioTrack={user.audioTrack}
                  key={user.uid}
                  style={{ height: "100%", width: "100%" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    fontSize: "30px",
                    color: "white",
                  }}
                >
                  {user.uid}
                </div>
                <div style={{ position: "absolute", top: "10px" }}>
                  <Button
                    variant="contained"
                    color={user.audioTrack ? "primary" : "secondary"}
                    disabled={uuid != "host"}
                    onClick={() =>
                      hostToggleMicOfPaticipant(
                        user.uid,
                        user.audioTrack ? true : false
                      )
                    }
                  >
                    {user.audioTrack ? <MicIcon /> : <MicOffIcon />}
                  </Button>
                </div>
                <div style={{ position: "absolute", top: "60px" }}>
                  <Button
                    variant="contained"
                    color={user.videoTrack ? "primary" : "secondary"}
                    // onClick={() => mute("video")}
                    disabled={uuid != "host"}
                    onClick={() =>
                      hostToggleCamOfPaticipant(
                        user.uid,
                        user.videoTrack ? true : false
                      )
                    }
                  >
                    {user.videoTrack ? <VideocamIcon /> : <VideocamOffIcon />}
                  </Button>
                </div>
              </Grid>
            );
          } else
            return (
              <Grid
                item
                xs={gridSpacing}
                style={{ padding: "10px", position: "relative" }}
                key={index}
              >
                <div style={{ backgroundColor: "black", height: "100%" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "50%",
                      fontSize: "30px",
                      color: "white",
                    }}
                  >
                    {user.uid}
                  </div>
                  <div style={{ position: "absolute", top: "10px" }}>
                    <Button
                      variant="contained"
                      color={user.audioTrack ? "primary" : "secondary"}
                      // onClick={() => mute("video")}
                      disabled={uuid != "host"}
                      onClick={() =>
                        hostToggleMicOfPaticipant(
                          user.uid,
                          user.audioTrack ? true : false
                        )
                      }
                    >
                      {user.audioTrack ? <MicIcon /> : <MicOffIcon />}
                    </Button>
                  </div>
                  <div style={{ position: "absolute", top: "60px" }}>
                    <Button
                      variant="contained"
                      color={user.videoTrack ? "primary" : "secondary"}
                      // onClick={() => mute("video")}
                      disabled={uuid != "host"}
                      onClick={() =>
                        hostToggleCamOfPaticipant(
                          user.uid,
                          user.videoTrack ? true : false
                        )
                      }
                    >
                      {user.videoTrack ? <VideocamIcon /> : <VideocamOffIcon />}
                    </Button>
                  </div>
                </div>
              </Grid>
            );
        })}
    </Grid>
  );
}
