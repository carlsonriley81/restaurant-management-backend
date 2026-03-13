import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/events',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(_server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (token) {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get('jwt.secret'),
        });
        client.data.user = payload;
        client.join(`role:${payload.role}`);
        this.logger.log(`Client connected: ${client.id} - ${payload.role}`);
      } else {
        this.logger.warn(`Client connected without auth: ${client.id}`);
      }
    } catch {
      this.logger.warn(`Client auth failed: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.join(room);
    return { event: 'joined', data: room };
  }

  emitOrderUpdate(orderId: string, data: any) {
    this.server.emit('order.updated', { orderId, ...data });
  }

  emitKitchenTicket(data: any) {
    this.server.to('role:CHEF').emit('kitchen.ticket.new', data);
    this.server.to('role:ADMIN').emit('kitchen.ticket.new', data);
    this.server.to('role:MANAGER').emit('kitchen.ticket.new', data);
  }

  emitTableUpdate(tableId: string, data: any) {
    this.server.emit('table.updated', { tableId, ...data });
  }

  emitInventoryAlert(data: any) {
    this.server.to('role:ADMIN').emit('inventory.low_stock', data);
    this.server.to('role:MANAGER').emit('inventory.low_stock', data);
  }

  emitNotification(targetRole: string, data: any) {
    if (targetRole) {
      this.server.to(`role:${targetRole}`).emit('notification.new', data);
    } else {
      this.server.emit('notification.new', data);
    }
  }

  emitReservationReminder(data: any) {
    this.server.to('role:ADMIN').emit('reservation.reminder', data);
    this.server.to('role:MANAGER').emit('reservation.reminder', data);
    this.server.to('role:SERVER').emit('reservation.reminder', data);
  }
}
