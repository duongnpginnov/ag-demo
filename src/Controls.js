import { useEffect, useState } from "react";
import { useClient, useShareScreen } from "./settings";
import { Grid, Button } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";

import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { Modal } from "antd";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import db from "./configFireBase";

export default function Controls(props) {
  const client = useClient();
  const { tracks, setStart, setInCall, muteOther, uuid, users, userAction } =
    props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [shareScreen, setShareScreen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalStudent, setIsModalStudent] = useState(false);

  useEffect(() => {
    console.log("muteOther ", muteOther);
    const alo = async () => {
      // if (uuid == 22) {
      await tracks[0].setEnabled(muteOther ? false : true);
      setTrackState((ps) => {
        return { ...ps, audio: muteOther ? false : true };
      });
      // }
    };

    alo();
  }, [muteOther]);

  useEffect(() => {
    console.log("test - userAction control ", userAction);
    const alo = async (status) => {
      // if (uuid == 22) {
      await tracks[0].setEnabled(status);
      setTrackState((ps) => {
        return { ...ps, audio: status };
      });
      // }
    };
    if (userAction && userAction.hasOwnProperty("timestamp")) {
      if (userAction.type == "muteAll") {
        if (uuid != "host") {
          alo(true);
        }
      } else if (userAction.type == "unMuteAll") {
        if (uuid != "host") {
          alo(false);
        }
      } else {
        if (userAction.uid == uuid) {
          console.log("test - userAction control toggle");
          alo(userAction.status);
        }
      }
    }
  }, [userAction]);

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const handleShareScreen = () => {
    console.log("shareScreen ");
    AgoraRTC.createScreenVideoTrack({
      encoderConfig: "1080p_1",
      optimizationMode: "detail",
    }).then((localScreenTrack) => {
      /** ... **/
      console.log("localScreenTrack ", localScreenTrack);
      // client.publish(localScreenTrack);
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const docRef = await addDoc(collection(db, "users"), {
      name: "test 8",
      uid: 9999999999,
      status: true,
      type: "survey",
      timestamp: new Date().getTime(),
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModalResult = () => {
    setIsModalStudent(true);
  };

  const handleStudentOk = async () => {
    setIsModalStudent(false);
  };

  const handleStudentCancel = () => {
    setIsModalStudent(false);
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  const turnOnMic = async () => {
    const docRef = await addDoc(collection(db, "users"), {
      name: "test 8",
      uid: 9999999999,
      status: true,
      type: "unMuteAll",
      timestamp: new Date().getTime(),
    });
  };

  const turnOffMic = async () => {
    const docRef = await addDoc(collection(db, "users"), {
      name: "test 8",
      uid: 9999999999,
      status: true,
      type: "muteAll",
      timestamp: new Date().getTime(),
    });
  };

  console.log("list users ", users);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            color={trackState.audio ? "primary" : "secondary"}
            onClick={() => mute("audio")}
          >
            {trackState.audio ? <MicIcon /> : <MicOffIcon />}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color={trackState.video ? "primary" : "secondary"}
            onClick={() => mute("video")}
          >
            {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleShareScreen}
          >
            <ScreenShareIcon />
          </Button>
        </Grid>
        {uuid == "host" ? (
          <>
            <Grid item>
              <Button variant="contained" color="primary" onClick={turnOnMic}>
                Mute All
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={turnOffMic}>
                Unmute All
              </Button>
            </Grid>

            <Grid item>
              <Button variant="contained" color="primary" onClick={showModal}>
                survey
              </Button>
            </Grid>
          </>
        ) : (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={showModalResult}
            >
              Result
            </Button>
          </Grid>
        )}
        <Grid item>
          <Button
            variant="contained"
            color="default"
            onClick={() => leaveChannel()}
          >
            Leave
            <ExitToAppIcon />
          </Button>
        </Grid>
      </Grid>
      <Modal
        title="Add Survey"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            variant="outlined"
            onClick={handleCancel}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>,
          <Button variant="contained" color="primary" onClick={handleOk}>
            Start
          </Button>,
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Modal
        title="Your result"
        visible={isModalStudent}
        onOk={handleStudentOk}
        onCancel={handleStudentCancel}
        footer={[
          <Button variant="contained" color="primary" onClick={handleStudentOk}>
            OK
          </Button>,
        ]}
      >
        <p>Some result...</p>
      </Modal>
    </>
  );
}
