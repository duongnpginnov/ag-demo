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
import { Modal, Space, List, Radio, Input } from "antd";
// import { channelName } from "./settings";
import SurveyAdmin from "./SurveyAdmin";

export default function Video(props) {
  const {
    users,
    tracks,
    uuid,
    currentUserSharing,
    channelName,
    isModalVisible,
    updateUserMic,
    userType,
  } = props;
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
    updateUserMic("one", uid, status ? false : true);
    if (userType == "university") {
      const updateTimestamp = await setDoc(usersRef, {
        name: channelName,
        uid: uid,
        status: status ? false : true,
        type: "mic", // "cam", "survey",
        timestamp: new Date().getTime(),
        value: "one", // "one"
      });
    } else return void 0;
  };

  const hostToggleCamOfPaticipant = async (uid, status) => {
    if (userType == "university") {
      const updateTimestamp = await setDoc(usersRef, {
        name: channelName,
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
      name: channelName,
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
      {userType == "university" &&
      users.length &&
      !currentUserSharing?.hasOwnProperty("uid") ? (
        <div className="custom-video">
          <div className="custom-video-cam">
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
                    // width:
                    //   currentUserSharing?.hasOwnProperty("uid") &&
                    //   currentUserSharing.videoTrack
                    //     ? "200px"
                    //     : "100%",
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
                        style={{
                          padding: "10px",
                          position: "relative",
                          minHeight:
                            currentUserSharing?.hasOwnProperty("uid") &&
                            currentUserSharing.videoTrack
                              ? "auto"
                              : "300px",
                        }}
                        key={index}
                        className="video-item"
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
                            // width:
                            //   currentUserSharing?.hasOwnProperty("uid") &&
                            //   currentUserSharing.videoTrack
                            //     ? "200px"
                            //     : "100%",
                          }}
                        />
                        {isModalVisible ? (
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              fontSize: "30px",
                              color: "black",
                              background: "white",
                              transform: "translate(-50%, -50%)",
                              width: "80%",
                              minHeight: "200px",
                              textAlign: "left",
                              paddingLeft: "20px",
                            }}
                          >
                            <SurveyAdmin users={users} userIndex={index} />
                          </div>
                        ) : null}
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
                        <div
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color={user.mic ? "primary" : "secondary"}
                            disabled={userType !== "university"}
                            onClick={() =>
                              hostToggleMicOfPaticipant(
                                user.uid,
                                user.mic ? true : false
                              )
                            }
                          >
                            {user.mic ? <MicIcon /> : <MicOffIcon />}
                          </Button>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "55px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color={user.videoTrack ? "primary" : "secondary"}
                            // onClick={() => mute("video")}
                            disabled={userType !== "university"}
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
                        {userType !== "university" ? null : (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              right: "100px",
                            }}
                          >
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
                        style={{
                          padding: "10px",
                          position: "relative",
                          minHeight:
                            currentUserSharing?.hasOwnProperty("uid") &&
                            currentUserSharing.videoTrack
                              ? "auto"
                              : "300px",
                        }}
                        key={index}
                        className="video-item"
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
                          {isModalVisible ? (
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                fontSize: "30px",
                                color: "black",
                                background: "white",
                                transform: "translate(-50%, -50%)",
                                width: "80%",
                                minHeight: "200px",
                                textAlign: "left",
                                paddingLeft: "20px",
                              }}
                            >
                              <SurveyAdmin users={users} userIndex={index} />
                            </div>
                          ) : null}
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
                          <div
                            style={{
                              position: "absolute",
                              bottom: "0",
                              right: "0",
                            }}
                          >
                            <Button
                              variant="contained"
                              color={user.mic ? "primary" : "secondary"}
                              // onClick={() => mute("video")}
                              disabled={userType !== "university"}
                              onClick={() =>
                                hostToggleMicOfPaticipant(
                                  user.uid,
                                  user.mic ? true : false
                                )
                              }
                            >
                              {user.mic ? <MicIcon /> : <MicOffIcon />}
                            </Button>
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              bottom: "0",
                              right: "45px",
                            }}
                          >
                            <Button
                              variant="contained"
                              color={user.videoTrack ? "primary" : "secondary"}
                              // onClick={() => mute("video")}
                              disabled={userType !== "university"}
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
                          {userType !== "university" ? null : (
                            <div
                              style={{
                                position: "absolute",
                                bottom: "0",
                                right: "90px",
                              }}
                            >
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
          </div>
          <div className="custom-video-list">
            <List
              size="small"
              bordered
              dataSource={users}
              renderItem={(item) => <List.Item>{item.uid}</List.Item>}
            />
          </div>
        </div>
      ) : (
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
                  // width:
                  //   currentUserSharing?.hasOwnProperty("uid") &&
                  //   currentUserSharing.videoTrack
                  //     ? "200px"
                  //     : "100%",
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
                      style={{
                        padding: "10px",
                        position: "relative",
                        minHeight:
                          currentUserSharing?.hasOwnProperty("uid") &&
                          currentUserSharing.videoTrack
                            ? "auto"
                            : "300px",
                      }}
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
                          // width:
                          //   currentUserSharing?.hasOwnProperty("uid") &&
                          //   currentUserSharing.videoTrack
                          //     ? "200px"
                          //     : "100%",
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
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                        }}
                      >
                        <Button
                          variant="contained"
                          color={user.mic ? "primary" : "secondary"}
                          disabled={userType !== "university"}
                          onClick={() =>
                            hostToggleMicOfPaticipant(
                              user.uid,
                              user.mic ? true : false
                            )
                          }
                          style={{
                            height: "35px",
                            width: "40px",
                            minWidth: "40px",
                          }}
                        >
                          {user.mic ? <MicIcon /> : <MicOffIcon />}
                        </Button>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "60px",
                        }}
                      >
                        <Button
                          variant="contained"
                          color={user.videoTrack ? "primary" : "secondary"}
                          // onClick={() => mute("video")}
                          disabled={userType !== "university"}
                          onClick={() =>
                            hostToggleCamOfPaticipant(
                              user.uid,
                              user.videoTrack ? true : false
                            )
                          }
                          style={{
                            height: "35px",
                            width: "40px",
                            minWidth: "40px",
                          }}
                        >
                          {user.videoTrack ? (
                            <VideocamIcon />
                          ) : (
                            <VideocamOffIcon />
                          )}
                        </Button>
                      </div>
                      {userType !== "university" ? null : (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "110px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => hostKickPaticipant(user.uid)}
                            style={{
                              height: "35px",
                              width: "40px",
                              minWidth: "40px",
                            }}
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
                      style={{
                        padding: "10px",
                        position: "relative",
                        minHeight:
                          currentUserSharing?.hasOwnProperty("uid") &&
                          currentUserSharing.videoTrack
                            ? "auto"
                            : "300px",
                      }}
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
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                          }}
                        >
                          <Button
                            variant="contained"
                            color={user.mic ? "primary" : "secondary"}
                            // onClick={() => mute("video")}
                            disabled={userType !== "university"}
                            onClick={() =>
                              hostToggleMicOfPaticipant(
                                user.uid,
                                user.mic ? true : false
                              )
                            }
                            style={{
                              height: "35px",
                              width: "40px",
                              minWidth: "40px",
                            }}
                          >
                            {user.mic ? <MicIcon /> : <MicOffIcon />}
                          </Button>
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "50px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color={user.videoTrack ? "primary" : "secondary"}
                            // onClick={() => mute("video")}
                            disabled={userType !== "university"}
                            onClick={() =>
                              hostToggleCamOfPaticipant(
                                user.uid,
                                user.videoTrack ? true : false
                              )
                            }
                            style={{
                              height: "35px",
                              width: "40px",
                              minWidth: "40px",
                            }}
                          >
                            {user.videoTrack ? (
                              <VideocamIcon />
                            ) : (
                              <VideocamOffIcon />
                            )}
                          </Button>
                        </div>
                        {userType !== "university" ? null : (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "0",
                              right: "100px",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => hostKickPaticipant(user.uid)}
                              style={{
                                height: "35px",
                                width: "40px",
                                minWidth: "40px",
                              }}
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
        </>
      )}
      <Modal
        title="Kick User"
        visible={showConfirmKick}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confim"
        cancelText="Cancel"
        maskClosable={false}
      >
        <p>
          Do you want to kick{" "}
          <span style={{ fontWeight: "bolder" }}>{kickName}</span> ?
        </p>
      </Modal>
    </>
  );
}
