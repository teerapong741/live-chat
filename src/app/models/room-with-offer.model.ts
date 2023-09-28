export interface RoomWithOffer {
  offer: {
    type: RTCSdpType;
    sdp: string | undefined;
  }
}
