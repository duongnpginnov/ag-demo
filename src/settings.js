import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "d67702adcbfc43cfbf51b85e192d2f48";
const token =
  "006d67702adcbfc43cfbf51b85e192d2f48IACgOx6hxWp/Gz8mkeieDbX/YW7r2nPhqIFZ/sBETrsbSu3Q8zEAAAAAEADJD5AXEyZ5YQEAAQAUJnlh";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "test-video";
