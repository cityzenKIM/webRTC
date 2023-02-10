import { Logger } from '@nestjs/common';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { GamesService } from 'src/games/games.service';
interface Iroom {
  roomName: string;
  users: string[];
  started: boolean;
  readyCount: number;
}

interface Irooms {
  id: Iroom;
}

@WebSocketGateway(8080, {
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // client: Record<string, Socket>;
  // constructor() {
  //   this.client = {};
  // }
  constructor(private readonly gamesService: GamesService) {}

  private logger = new Logger('Gateway');
  // private rooms = new Map<string, { nickName: string; id: string }[]>();
  private rooms: {
    [key: string]: {
      roomName: string;
      users: { id: string; nickName: string }[];
      started: boolean;
      readyCount: number;
    };
  } = {};
  // private userToRoom = new Map<string, string>();
  private userToRoom: { [key: string]: string } = {};

  @WebSocketServer()
  server: Server;

  //소켓 연결
  handleConnection(@ConnectedSocket() socket: Socket): void {
    this.logger.log(`socketId: ${socket.id} 소켓 연결`);
  }

  //소켓 연결 해제 시
  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    const roomId = this.userToRoom[socket.id];
    const users = this.rooms[roomId].users;

    // 유저 정보 업데이트
    users.filter((user) => user.id !== socket.id);

    if (users.length === 0) {
      // 방 삭제
      delete this.rooms[roomId];
      this.logger.log(`roomId: ${roomId} 삭제`);
    } else {
      socket.to(roomId).emit('user_exit', socket.id);
    }

    this.logger.log(`socketId: ${socket.id} 소켓 연결 해제 ❌`);
  }

  // 방 조회
  @SubscribeMessage('rooms')
  getRooms(@ConnectedSocket() socket: Socket): void {
    this.server.sockets.to(socket.id).emit('get_rooms', this.rooms);
  }

  // 방 생성
  @SubscribeMessage('create_room')
  createRoom(@MessageBody() data: { roomId: string; roomName: string }): void {
    const { roomId, roomName } = data;
    this.rooms[roomId] = {
      roomName,
      users: [],
      started: false,
      readyCount: 0,
    };
  }

  // 소켓에 새로운 유저 join
  @SubscribeMessage('join_room')
  joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; nickName: string },
  ): void {
    const { roomId, nickName } = data;

    // 방 정보 업데이트
    if (this.rooms[roomId]) {
      const countUsers = this.rooms[roomId].users.length;
      if (countUsers === 4) {
        //! 에러 방출?
        socket.emit('full');
        this.logger.log(`full users ${countUsers}`);
      } else {
        this.rooms[roomId].users.push({ id: socket.id, nickName });
      }
    }
    this.userToRoom[socket.id] = roomId;

    // 방에 연결
    socket.join(roomId);

    console.log(this.rooms);
    // 유저에게 이미 방에 있는 다른 유저 정보 주기
    const otherUsers = this.rooms[roomId].users.filter(
      (user) => user.id !== socket.id,
    );
    console.log(otherUsers);
    this.server.sockets.to(socket.id).emit('other_users', otherUsers);

    this.logger.log(
      `nickName: ${nickName}, userId: ${socket.id}, join_room : ${roomId}`,
    );
  }

  @SubscribeMessage('offer')
  offer(@ConnectedSocket() socket: Socket, @MessageBody() data: any): void {
    socket.to(data.offerReceiveID).emit('get_offer', {
      sdp: data.sdp,
      offerSendID: data.offerSendID,
      offerSendNickName: data.offerSendNickName,
    });
    this.logger.log(`offer from ${data.offerSendID} to ${data.offerReceiveID}`);
  }

  @SubscribeMessage('answer')
  answer(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    socket.to(data.answerReceiveID).emit('get_answer', {
      sdp: data.sdp,
      answerSendID: data.answerSendID,
    });
    this.logger.log(
      `answer from ${data.answerSendID} to ${data.answerReceiveID}`,
    );
  }

  @SubscribeMessage('ice')
  ice(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    socket.to(data.candidateReceiveID).emit('get_ice', {
      candidate: data.candidate,
      candidateSendID: data.candidateSendID,
    });
    this.logger.log(
      `ice from ${data.candidateSendID} to ${data.candidateReceiveID}`,
    );
  }
}
