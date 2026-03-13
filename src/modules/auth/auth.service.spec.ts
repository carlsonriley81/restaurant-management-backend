import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockPrisma = {
  employee: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      'jwt.secret': 'test-secret',
      'jwt.expiresIn': '15m',
      'jwt.refreshSecret': 'test-refresh-secret',
      'jwt.refreshExpiresIn': '7d',
    };
    return config[key];
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.employee.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com' });
      await expect(
        service.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@test.com',
          password: 'password123',
          role: 'ADMIN' as any,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a new employee and return tokens', async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);
      mockPrisma.employee.create.mockResolvedValue({
        id: 'emp-1',
        email: 'new@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'ADMIN',
      });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'new@test.com',
        password: 'password123',
        role: 'ADMIN' as any,
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('employee');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for unknown email', async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'unknown@test.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('correctpassword', 1);
      mockPrisma.employee.findUnique.mockResolvedValue({
        id: 'emp-1',
        email: 'test@test.com',
        passwordHash: hash,
        role: 'ADMIN',
      });
      await expect(
        service.login({ email: 'test@test.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens for valid credentials', async () => {
      const hash = await bcrypt.hash('password123', 1);
      mockPrisma.employee.findUnique.mockResolvedValue({
        id: 'emp-1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: hash,
        role: 'ADMIN',
      });
      mockPrisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({ email: 'test@test.com', password: 'password123' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.employee.email).toBe('test@test.com');
    });
  });

  describe('logout', () => {
    it('should delete refresh tokens', async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });
      const result = await service.logout('some-token');
      expect(result.message).toBe('Logged out successfully');
      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: 'some-token' },
      });
    });
  });
});
