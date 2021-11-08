import { useState } from "react";
// import { Button } from "@material-ui/core";
import VideoCall from "./VideoCall";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Layout,
  Avatar,
  Row,
  Col,
  Image,
} from "antd";
import StudentImage from "./image/student.png";
import UniversityImage from "./image/university.png";
import { LogoutOutlined } from "@ant-design/icons";
import Marketing from "./image/marketing.png";
import Marketing2 from "./image/marketing2.jpeg";
import DigitalMarketing from "./image/digital-marketing.jpg";

const { Header, Footer, Sider, Content } = Layout;

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

  const onFinish = (values) => {
    console.log("Success:", values);
    setUuid(values.username);
  };

  const handleLogout = () => {
    setUuid("");
  };

  const handleStart = async (channelName) => {
    console.log("handleStart ", channelName);
    setChannelName(channelName);
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
      {!uuid ? (
        <div className="login-form">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <>
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
              <Layout className="main-page">
                <Sider>
                  <Avatar
                    src={uuid == "host" ? UniversityImage : StudentImage}
                  />
                  <h3 style={{ paddingBottom: "30px" }}>{uuid}</h3>
                  <div
                    className="menu-item"
                    style={{ fontWeight: "bold", backgroundColor: "#bd4f4f" }}
                  >
                    Classes
                  </div>
                  <div className="menu-item">Profile</div>
                  <div className="menu-item">Setting</div>

                  <div className="logout-btn" onClick={handleLogout}>
                    <LogoutOutlined />
                    Log Out
                  </div>
                </Sider>
                <Layout>
                  <Content>
                    <Row className="channel-item">
                      <Col span={4}>
                        <Image src={DigitalMarketing} preview={false} />
                      </Col>
                      <Col span={12}>
                        <p style={{ fontSize: "20px", marginTop: "-8px" }}>
                          Digital Marketing
                        </p>
                        <p>Nam Seoul university</p>
                        <p style={{ fontWeight: "bolder" }}>
                          Monday 8-9 AM, Wednesday 11-12 AM
                        </p>
                        <div
                          style={{
                            textAlign: "left",
                            paddingLeft: "10px",
                            position: "absolute",
                            bottom: "5px",
                          }}
                        >
                          <Button
                            type="primary"
                            onClick={() => handleStart("Digital Marketing")}
                          >
                            {uuid == "host" ? "Start" : "Join"}
                          </Button>
                          {uuid == "host" ? (
                            <Button
                              type="primary"
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "#fd9144",
                                border: "none",
                              }}
                            >
                              Edit
                            </Button>
                          ) : null}
                          <Button
                            type="primary"
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#657798",
                              border: "none",
                            }}
                          >
                            Share
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    <Row className="channel-item">
                      <Col span={4}>
                        <Image src={Marketing} preview={false} />
                      </Col>
                      <Col span={12}>
                        <p style={{ fontSize: "20px", marginTop: "-8px" }}>
                          Introduction to Marketing
                        </p>
                        <p>Nam Seoul university</p>
                        <p style={{ fontWeight: "bolder" }}>
                          Monday 8-9 AM, Thursday 2-3 PM
                        </p>
                        <div
                          style={{
                            textAlign: "left",
                            paddingLeft: "10px",
                            position: "absolute",
                            bottom: "5px",
                          }}
                        >
                          <Button
                            type="primary"
                            onClick={() =>
                              handleStart("Introduction to Marketing")
                            }
                          >
                            {uuid == "host" ? "Start" : "Join"}
                          </Button>
                          {uuid == "host" ? (
                            <Button
                              type="primary"
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "#fd9144",
                                border: "none",
                              }}
                            >
                              Edit
                            </Button>
                          ) : null}
                          <Button
                            type="primary"
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#657798",
                              border: "none",
                            }}
                          >
                            Share
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    <Row className="channel-item">
                      <Col span={4}>
                        <Image src={Marketing2} preview={false} />
                      </Col>
                      <Col span={12}>
                        <p style={{ fontSize: "20px", marginTop: "-8px" }}>
                          Facebook Social Media Marketing
                        </p>
                        <p>Nam Seoul university</p>
                        <p style={{ fontWeight: "bolder" }}>
                          Monday 9-10 AM, Friday 3-4 PM
                        </p>
                        <div
                          style={{
                            textAlign: "left",
                            paddingLeft: "10px",
                            position: "absolute",
                            bottom: "5px",
                          }}
                        >
                          <Button
                            type="primary"
                            onClick={() =>
                              handleStart("Facebook Social Media Marketing")
                            }
                          >
                            {uuid == "host" ? "Start" : "Join"}
                          </Button>
                          {uuid == "host" ? (
                            <Button
                              type="primary"
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "#fd9144",
                                border: "none",
                              }}
                            >
                              Edit
                            </Button>
                          ) : null}
                          <Button
                            type="primary"
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#657798",
                              border: "none",
                            }}
                          >
                            Share
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    {uuid == "host" ? (
                      <div className="add-class">
                        <Button
                          type="primary"
                          style={{ backgroundColor: "#62d4a1", border: "none" }}
                        >
                          Add new class
                        </Button>
                      </div>
                    ) : null}
                  </Content>
                </Layout>
              </Layout>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
