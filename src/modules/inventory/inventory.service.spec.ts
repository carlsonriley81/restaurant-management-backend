import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../gateway/events.gateway';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  inventoryItem: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockEventsGateway = {
  emitInventoryAlert: jest.fn(),
};

const mockItem = {
  id: 'inv-1',
  productName: 'Beef Patty',
  quantityOnHand: 50,
  unit: 'lbs',
  lowStockThreshold: 10,
  supplierName: 'Local Farms',
  costToOrder: 8.99,
};

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EventsGateway, useValue: mockEventsGateway },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all inventory items', async () => {
      mockPrisma.inventoryItem.findMany.mockResolvedValue([mockItem]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });

    it('should filter low stock items', async () => {
      const lowItem = { ...mockItem, quantityOnHand: 5, lowStockThreshold: 10 };
      const normalItem = { ...mockItem, id: 'inv-2', quantityOnHand: 50 };
      mockPrisma.inventoryItem.findMany.mockResolvedValue([lowItem, normalItem]);

      const result = await service.findAll(true);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('inv-1');
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      mockPrisma.inventoryItem.findUnique.mockResolvedValue(mockItem);
      const result = await service.findOne('inv-1');
      expect(result.productName).toBe('Beef Patty');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.inventoryItem.findUnique.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new inventory item', async () => {
      mockPrisma.inventoryItem.create.mockResolvedValue(mockItem);
      const result = await service.create({
        productName: 'Beef Patty',
        quantityOnHand: 50,
      });
      expect(result).toEqual(mockItem);
    });
  });

  describe('adjustQuantity', () => {
    it('should increment quantity', async () => {
      mockPrisma.inventoryItem.findUnique.mockResolvedValue(mockItem);
      const updatedItem = { ...mockItem, quantityOnHand: 60 };
      mockPrisma.inventoryItem.update.mockResolvedValue(updatedItem);

      const result = await service.adjustQuantity('inv-1', { quantity: 10 });
      expect(result.quantityOnHand).toBe(60);
    });

    it('should emit alert when quantity falls below threshold', async () => {
      mockPrisma.inventoryItem.findUnique.mockResolvedValue(mockItem);
      const lowItem = { ...mockItem, quantityOnHand: 5 };
      mockPrisma.inventoryItem.update.mockResolvedValue(lowItem);

      await service.adjustQuantity('inv-1', { quantity: -45 });
      expect(mockEventsGateway.emitInventoryAlert).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete an inventory item', async () => {
      mockPrisma.inventoryItem.findUnique.mockResolvedValue(mockItem);
      mockPrisma.inventoryItem.delete.mockResolvedValue(mockItem);

      await service.remove('inv-1');
      expect(mockPrisma.inventoryItem.delete).toHaveBeenCalledWith({ where: { id: 'inv-1' } });
    });
  });
});
