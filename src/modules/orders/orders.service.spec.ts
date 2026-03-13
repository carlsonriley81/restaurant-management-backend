import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../gateway/events.gateway';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockPrisma = {
  order: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
  },
  menuItem: {
    findMany: jest.fn(),
  },
  discount: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  kitchenTicket: {
    create: jest.fn(),
  },
  receipt: {
    upsert: jest.fn(),
  },
  table: {
    update: jest.fn(),
  },
};

const mockEventsGateway = {
  emitOrderUpdate: jest.fn(),
  emitKitchenTicket: jest.fn(),
  emitTableUpdate: jest.fn(),
};

const mockOrder = {
  id: 'order-1',
  orderStatus: 'PLACED',
  paymentStatus: 'PENDING',
  totalPrice: 25.0,
  discountAmount: 0,
  tipAmount: 0,
  tableId: 'table-1',
  items: [
    {
      id: 'item-1',
      menuItemId: 'menu-1',
      quantity: 2,
      unitPrice: 12.5,
      menuItem: { id: 'menu-1', name: 'Burger', price: 12.5 },
    },
  ],
  table: { id: 'table-1', tableNumber: 1 },
  chef: null,
  server: null,
  discount: null,
  kitchenTicket: null,
  receipt: null,
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EventsGateway, useValue: mockEventsGateway },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      mockPrisma.order.findMany.mockResolvedValue([mockOrder]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(mockPrisma.order.findMany).toHaveBeenCalled();
    });

    it('should filter by status', async () => {
      mockPrisma.order.findMany.mockResolvedValue([]);
      await service.findAll('PLACED');
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { orderStatus: 'PLACED' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
      const result = await service.findOne('order-1');
      expect(result.id).toBe('order-1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create an order and emit events', async () => {
      mockPrisma.menuItem.findMany.mockResolvedValue([
        { id: 'menu-1', name: 'Burger', price: 12.5 },
      ]);
      mockPrisma.discount.findUnique.mockResolvedValue(null);
      mockPrisma.order.create.mockResolvedValue(mockOrder);
      mockPrisma.kitchenTicket.create.mockResolvedValue({});

      const result = await service.create(
        {
          items: [{ menuItemId: 'menu-1', quantity: 2 }],
          customerName: 'John Doe',
        },
        'emp-1',
      );

      expect(result).toBeDefined();
      expect(mockEventsGateway.emitOrderUpdate).toHaveBeenCalled();
      expect(mockEventsGateway.emitKitchenTicket).toHaveBeenCalled();
    });

    it('should throw NotFoundException for invalid menu item', async () => {
      mockPrisma.menuItem.findMany.mockResolvedValue([]);
      await expect(
        service.create(
          { items: [{ menuItemId: 'bad-id', quantity: 1 }] },
          'emp-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
      mockPrisma.order.update.mockResolvedValue({ ...mockOrder, orderStatus: 'ACCEPTED' });

      const result = await service.updateStatus('order-1', { status: 'ACCEPTED' });
      expect(result.orderStatus).toBe('ACCEPTED');
      expect(mockEventsGateway.emitOrderUpdate).toHaveBeenCalled();
    });
  });

  describe('processPayment', () => {
    it('should throw BadRequestException if already paid', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ ...mockOrder, paymentStatus: 'PAID' });
      await expect(
        service.processPayment('order-1', { paymentMethod: 'CASH' as any }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should process payment and create receipt', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
      mockPrisma.order.update.mockResolvedValue({ ...mockOrder, paymentStatus: 'PAID' });
      mockPrisma.receipt.upsert.mockResolvedValue({});
      mockPrisma.table.update.mockResolvedValue({});

      const result = await service.processPayment('order-1', {
        paymentMethod: 'CASH' as any,
        tipAmount: 3,
      });

      expect(result.paymentStatus).toBe('PAID');
      expect(mockPrisma.receipt.upsert).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete an order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
      mockPrisma.order.delete.mockResolvedValue(mockOrder);
      await service.remove('order-1');
      expect(mockPrisma.order.delete).toHaveBeenCalledWith({ where: { id: 'order-1' } });
    });
  });
});
