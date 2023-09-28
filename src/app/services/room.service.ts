import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoomWithAnswer } from '../models/room-with-answer.model';
import { RoomWithOffer } from '../models/room-with-offer.model';
import { MessageType } from '../types/message.type';
import { PEER } from './../modules/create-room/create-room.component';

export type PEER_TRC_CONNECTION = RTCPeerConnection & { dc?: RTCDataChannel };

@Injectable({ providedIn: 'root' })
export class RoomService {
  private _http = inject(HttpClient);
  private _socket = inject(Socket);

  private _roomIdSelected = new BehaviorSubject<string | null>(null);
  private _roomWithOffer = new BehaviorSubject<RoomWithOffer | null>(null);
  private _roomWithAnswer = new BehaviorSubject<RoomWithAnswer | null>(null);

  constructor() {
    const client = JSON.parse(JSON.stringify(localStorage.getItem('client')));
    const roomWithOffer = JSON.parse(
      JSON.stringify(localStorage.getItem('roomWithOffer'))
    );

    if (this._roomWithOffer) this._roomWithOffer.next(roomWithOffer);
  }

  get roomWithOffer() {
    return this._roomWithOffer.value;
  }

  get roomWithAnswer() {
    return this._roomWithAnswer.value;
  }

  get roomIdSelected() {
    return this._roomIdSelected.value;
  }

  set roomWithOffer(value: RoomWithOffer | null) {
    localStorage.setItem('roomWithOffer', JSON.stringify(value));
    this._roomWithOffer.next(value);
  }

  set roomWithAnswer(value: RoomWithAnswer | null) {
    localStorage.setItem('roomWithAnswer', JSON.stringify(value));
    this._roomWithAnswer.next(value);
  }

  set roomIdSelected(value: string | null) {
    this._roomIdSelected.next(value);
  }

  async createRoom(userId: string): Promise<{
    roomWithOffer: RoomWithOffer;
    roomId: string;
  }> {
    return new Promise((resolve, reject) => {
      PEER.dc = PEER.createDataChannel(`channel@${userId}`);

      let isCreated = false;
      PEER.onicecandidate = (e) => {
        if (!e.candidate || isCreated) return;

        isCreated = true;
        const roomWithOffer: RoomWithOffer = {
          offer: {
            type: PEER.localDescription!.type,
            sdp: PEER.localDescription!.sdp,
          },
        };

        this._http
          .post(environment.serviceUrl + '/room/create-room', {
            payload: {
              userId,
              roomWithOffer,
            },
          })
          .subscribe((res: any) => {
            resolve({
              roomWithOffer,
              roomId: res.data.roomId,
            });
          });
      };

      PEER.createOffer().then((offer) => PEER.setLocalDescription(offer));
    });
  }

  async joinRoom(
    roomId: string,
    userId: string,
    offer: RoomWithOffer
  ): Promise<{
    answer: RoomWithAnswer;
  }> {
    await PEER.setRemoteDescription(offer.offer);
    const answer = await PEER.createAnswer();
    await PEER.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };

    return new Promise((resolve, reject) => {
      this._http
        .post(environment.serviceUrl + '/room/join-room', {
          payload: {
            userId,
            roomId,
            answer: roomWithAnswer,
          },
        })
        .subscribe((res: any) => {
          resolve({
            answer: roomWithAnswer,
          });
        });
    });
  }

  getRoomList() {
    return this._http.get(environment.serviceUrl + '/room/room-list');
  }

  checkIsOwnerRoom(userId: string) {
    return this._http.post(
      environment.serviceUrl + '/room/check-is-owner-room',
      { payload: { userId } }
    );
  }

  getMessages(roomId: string) {
    return this._http.post(environment.serviceUrl + '/room/get-messages', {
      payload: { roomId },
    });
  }

  sendMessages(
    roomId: string,
    type: MessageType,
    message: string,
    senderId: string
  ) {
    return this._http.post(environment.serviceUrl + '/room/send-messages', {
      payload: {
        roomId,
        type,
        message,
        senderId,
      },
    });
  }

  /* --------------------------------- Sockets -------------------------------- */
  getRoom(ownerId: string) {
    return this._socket.fromEvent(`room@${ownerId}`);
  }

  getRoomContent(roomId: string) {
    return this._socket.fromEvent(`room@${roomId}`);
  }
}
