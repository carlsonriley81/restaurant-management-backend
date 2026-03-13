import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { EventsGateway } from '../../gateway/events.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async findAll(targetRole?: Role, read?: boolean) {
    return this.prisma.notification.findMany({
      where: {
        ...(targetRole && { OR: [{ targetRole }, { targetRole: null }] }),
        ...(read !== undefined && { read }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    title: string;
    message: string;
    type: string;
    targetRole?: Role;
    targetId?: string;
    notificationData?: any;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        targetRole: data.targetRole,
        targetId: data.targetId,
        data: data.notificationData,
      },
    });
    this.eventsGateway.emitNotification(data.targetRole || '', notification);
    return notification;
  }

  async markRead(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }

  async markAllRead(targetRole?: Role) {
    return this.prisma.notification.updateMany({
      where: { ...(targetRole && { targetRole }), read: false },
      data: { read: true },
    });
  }
}
