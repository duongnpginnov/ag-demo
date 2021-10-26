import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "d67702adcbfc43cfbf51b85e192d2f48";
const token =
  "006d67702adcbfc43cfbf51b85e192d2f48IABA14b37pwlIq72Hu8C5qPBCwNFRHknhl2F3AS/Kt5cxe3Q8zEAAAAAEADJD5AXObN4YQEAAQA5s3hh";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "test-video";
