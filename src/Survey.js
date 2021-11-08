import { useEffect, useState } from "react";

import { Modal, Radio, Input, Space } from "antd";

export default function Survey(props) {
  const { isModalVisible, handleOk, handleCancel } = props;
  const [timwShowSurvey, setTimeShowSurvey] = useState(10);
  const [selectValue, setSelectValue] = useState(1);

  useEffect(() => {
    let timeToEnd = 60;
    let timeShowInterview = setInterval(() => {
      timeToEnd -= 1;
      setTimeShowSurvey(timeToEnd);
    }, 1000);
    let timeshowTimeout = setTimeout(() => {
      console.log("close modal");
      clearInterval(timeShowInterview);
      handleOk();
    }, 59800);
    return () => {
      clearTimeout(timeshowTimeout);
      clearInterval(timeShowInterview);
    };
  }, []);

  const onChange = (e) => {
    setSelectValue(e.target.value);
  };

  return (
    <Modal
      title="survey"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <h2>Your survey will be close after {timwShowSurvey} seconds</h2>
      <p>Answer question</p>
      <Radio.Group onChange={onChange} value={selectValue}>
        <Space direction="vertical">
          <Radio value={1}>Option A</Radio>
          <Radio value={2}>Option B</Radio>
          <Radio value={3}>Option C</Radio>
          <Radio value={4}>
            More...
            {selectValue === 4 ? (
              <Input style={{ width: 100, marginLeft: 10 }} />
            ) : null}
          </Radio>
        </Space>
      </Radio.Group>
    </Modal>
  );
}
