import { AgoraVideoPlayer } from "agora-rtc-react";
import { Grid, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
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
import { Modal, Space } from "antd";

export default function Video(props) {
  const { users, tracks, uuid, currentUserSharing } = props;
  const [gridSpacing, setGridSpacing] = useState(12);
  const [showConfirmKick, setShowConfirmKick] = useState(false);
  const [kickName, setKickName] = useState("");
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

  const hostKickPaticipant = async (uid, status) => {
    setKickName(uid);
    setShowConfirmKick(true);
  };

  const handleCancel = () => {
    setShowConfirmKick(false);
  };

  const handleOk = async () => {
    setShowConfirmKick(false);
    const updateTimestamp = await setDoc(usersRef, {
      name: "test 8",
      uid: kickName,
      status: true,
      type: "kick", // "cam", "survey",
      timestamp: new Date().getTime(),
      value: "one", // "one"
    });
  };
  console.log("test - currentUserSharing ", currentUserSharing);

  return (
    <>
      <Grid
        container
        className={
          currentUserSharing?.hasOwnProperty("uid") &&
          currentUserSharing.videoTrack
            ? "grid-video-sharing"
            : "grid-video-normal"
        }
      >
        <Grid
          item
          xs={
            currentUserSharing?.hasOwnProperty("uid") &&
            currentUserSharing.videoTrack
              ? 24
              : gridSpacing
          }
          style={{ padding: "10px" }}
        >
          <AgoraVideoPlayer
            videoTrack={tracks[1]}
            style={{
              height:
                currentUserSharing?.hasOwnProperty("uid") &&
                currentUserSharing.videoTrack
                  ? "200px"
                  : "100%",
              width:
                currentUserSharing?.hasOwnProperty("uid") &&
                currentUserSharing.videoTrack
                  ? "200px"
                  : "100%",
            }}
            audioTrack={tracks[0]}
          />
        </Grid>
        {users.length > 0 &&
          users.map((user, index) => {
            if (user.videoTrack) {
              return (
                <Grid
                  item
                  xs={
                    currentUserSharing?.hasOwnProperty("uid") &&
                    currentUserSharing.videoTrack
                      ? 24
                      : gridSpacing
                  }
                  style={{ padding: "10px", position: "relative" }}
                  key={index}
                >
                  <AgoraVideoPlayer
                    videoTrack={user.videoTrack}
                    audioTrack={user.audioTrack}
                    key={user.uid}
                    style={{
                      height:
                        currentUserSharing?.hasOwnProperty("uid") &&
                        currentUserSharing.videoTrack
                          ? "200px"
                          : "100%",
                      width:
                        currentUserSharing?.hasOwnProperty("uid") &&
                        currentUserSharing.videoTrack
                          ? "200px"
                          : "100%",
                    }}
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
                  <div style={{ position: "absolute", top: "70px" }}>
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
                  {uuid != "host" ? null : (
                    <div style={{ position: "absolute", top: "130px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => hostKickPaticipant(user.uid)}
                      >
                        <ExitToAppIcon />
                      </Button>
                    </div>
                  )}
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
                  <div
                    style={{
                      backgroundColor: "black",
                      height:
                        currentUserSharing?.hasOwnProperty("uid") &&
                        currentUserSharing.videoTrack
                          ? "200px"
                          : "100%",
                      width:
                        currentUserSharing?.hasOwnProperty("uid") &&
                        currentUserSharing.videoTrack
                          ? "200px"
                          : "100%",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "50%",
                        fontSize: "30px",
                        color: "white",
                      }}
                    >
                      {user.uid}
                    </div>
                    <div style={{ position: "absolute", top: "0" }}>
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
                        {user.videoTrack ? (
                          <VideocamIcon />
                        ) : (
                          <VideocamOffIcon />
                        )}
                      </Button>
                    </div>
                    {uuid != "host" ? null : (
                      <div style={{ position: "absolute", top: "120px" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => hostKickPaticipant(user.uid)}
                        >
                          <ExitToAppIcon />
                        </Button>
                      </div>
                    )}
                  </div>
                </Grid>
              );
          })}
      </Grid>
      {currentUserSharing?.hasOwnProperty("uid") &&
      currentUserSharing.videoTrack ? (
        <div style={{ height: "95%", width: "100%", padding: "10px" }}>
          <AgoraVideoPlayer
            videoTrack={currentUserSharing.videoTrack}
            audioTrack={currentUserSharing.audioTrack}
            style={{ height: "100%", width: "100%" }}
            className="video-sharing"
          />
        </div>
      ) : null}
      <Modal
        title="Kick User"
        visible={showConfirmKick}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confim"
        cancelText="Cancel"
      >
        <p>
          Do you want to kick{" "}
          <span style={{ fontWeight: "bolder" }}>{kickName}</span> ?
        </p>
      </Modal>
    </>
  );
}
