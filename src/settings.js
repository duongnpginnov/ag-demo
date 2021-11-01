import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "7a40556a99f04812b3812e4415f31efb";
const token =
  "0067a40556a99f04812b3812e4415f31efbIAB0rpwyycnGxCT/Atoa2xLXXWircjw8Z3iWTuB8DuKlIVndg0QAAAAAEADJD5AXdJaAYQEAAQBxloBh";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "newclass";
