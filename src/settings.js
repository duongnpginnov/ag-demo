import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "d67702adcbfc43cfbf51b85e192d2f48";
const token =
  "006d67702adcbfc43cfbf51b85e192d2f48IAAPsDM0nsQjxfAAXpwKQKr5wOgEglBpWnmM3TdEW1YTU+3Q8zEAAAAAEADJD5AXFHl3YQEAAQAUeXdh";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "test-video";
