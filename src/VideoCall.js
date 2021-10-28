import { useState, useEffect } from "react";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "./settings.js";
import { Grid } from "@material-ui/core";
import Video from "./Video";
import Controls from "./Controls";
import Survey from "./Survey";
// import TestFireBase from "./TestFireBase";
import db from "./configFireBase";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

export default function VideoCall(props) {
  const { setInCall, uuid } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const [muteOther, setMuteOther] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [count, setCount] = useState(1);
  const [userAction, setUserAction] = useState({});

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("test - user-published ", user);
        if (mediaType === "audio") {
          user.audioTrack.play();
        }

        setCount((prevCount) => {
          return prevCount + 1;
        });
      });

      client.on("user-unpublished", (user, mediaType) => {
        console.log("test - user-unpublished ", user);
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        setCount((prevCount) => {
          return prevCount + 1;
        });
      });

      client.on("user-left", (user) => {
        console.log("test -  left room ", user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });
      client.on("user-joined", (user) => {
        console.log("test - user-joined", user);
        setUsers((prevUsers) => {
          return [...prevUsers, user];
        });
      });

      // client.on("user-info-updated", (uid, msg) => {
      //   if (uid == "host") {
      //     if (msg == "unmute-audio") {
      //       setMuteOther(false);
      //     } else if (msg == "mute-audio") {
      //       console.log("test - mute other start");
      //       setMuteOther(true);
      //     }
      //   }
      // });

      try {
        let alo = await client.join(config.appId, name, config.token, uuid);
      } catch (error) {
        console.log("test - error");
      }

      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      try {
        init(channelName);
      } catch (error) {
        console.log(error);
      }
    }
  }, [channelName, client, ready, tracks]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        console.log("test - start listen ", snapshot);
        const userListListen = snapshot.docs.map((doc) => doc.data());
        console.log("test - start userListListen ", userListListen);
        let tmpList = userListListen.length ? userListListen.sort(compare) : [];
        console.log("test - start tmpList after sort ", tmpList);
        let userAc = tmpList.pop();
        console.log("test - start userAc ", userAc);
        if (userAc && userAc.type == "survey" && uuid != "host") {
          setIsModalVisible(true);
        }
        setUserAction(userAc);
      },
      (error) => {
        console.log("test - start listen error ", error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const compare = (a, b) => {
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    return 0;
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const updateFirebaseState = (data) => {
    console.log("test - updateFirebaseState ", data);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        style={{ height: "100%", width: "99%" }}
      >
        <Grid item style={{ height: "5%" }}>
          {ready && tracks && (
            <Controls
              tracks={tracks}
              setStart={setStart}
              setInCall={setInCall}
              muteOther={muteOther}
              uuid={uuid}
              users={users}
              count={count}
              userAction={userAction}
            />
          )}
        </Grid>
        <Grid item style={{ height: "95%" }}>
          {start && tracks && (
            <Video
              tracks={tracks}
              users={users}
              muteOther={muteOther}
              count={count}
              uuid={uuid}
            />
          )}
        </Grid>
      </Grid>
      {isModalVisible ? (
        <Survey
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      ) : null}
    </>
  );
}
