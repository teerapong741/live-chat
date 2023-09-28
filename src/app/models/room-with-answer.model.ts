export interface RoomWithAnswer {
  answer: {
    type: RTCSdpType;
    sdp: string | undefined;
  }
}
