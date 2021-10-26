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

export default function VideoCall(props) {
  const { setInCall, uuid } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const [muteOther, setMuteOther] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listUid, setListUid] = useState([]);

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("user-published ", user);

        if (mediaType === "video") {
          console.log("listUid listUid publish ", listUid);
          setListUid((prevListUid) => {
            return !prevListUid.includes(user.uid)
              ? [...prevListUid, user.uid]
              : [...prevListUid];
          });
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        console.log("user-unpublished ", user);
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        console.log(" left room ", user);
        setListUid((prevListUid) => {
          return prevListUid.filter((uid) => uid !== user.uid);
        });
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });
      client.on("user-info-updated", (uid, msg) => {
        if (uid == 11) {
          if (msg == "unmute-audio") {
            setMuteOther(false);
          } else if (msg == "mute-audio") {
            console.log("mute other start");
            setMuteOther(true);
          } else if (msg == "mute-video") {
            setIsModalVisible(true);
          }
        }
      });

      try {
        let alo = await client.join(config.appId, name, config.token, uuid);
        console.log("join ", alo);
      } catch (error) {
        console.log("error");
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

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  console.log("listUid ", listUid);

  return (
    <>
      <Grid container direction="column" style={{ height: "100%" }}>
        <Grid item style={{ height: "5%" }}>
          {ready && tracks && (
            <Controls
              tracks={tracks}
              setStart={setStart}
              setInCall={setInCall}
              muteOther={muteOther}
              uuid={uuid}
              users={users}
            />
          )}
        </Grid>
        <Grid item style={{ height: "95%" }}>
          {start && tracks && (
            <Video tracks={tracks} users={users} muteOther={muteOther} />
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
