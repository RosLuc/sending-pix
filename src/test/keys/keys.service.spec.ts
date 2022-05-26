import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { KeysService } from '../../models/keys/keys.service';
import { KeysRepository } from '../../models/keys/keys.repository';
import { UsersRepository } from '../../models/users/users.repository';

describe('KeysService', () => {
  let service: KeysService;

  const mockUser = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    telephone: faker.phone.phoneNumber(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersRepository = {
    findOne: jest.fn((userId) => ({
      id: userId,
      ...mockUser,
      keys: [],
    })),
  };

  const mockKeysRepository = {
    findOne: jest.fn(() => null),
    create: jest.fn((dto) => ({
      ...dto,
      id: uuid(),
    })),
    save: jest.fn((newUser) => ({
      ...newUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeysService,
        {
          provide: getRepositoryToken(KeysRepository),
          useValue: mockKeysRepository,
        },
        {
          provide: getRepositoryToken(UsersRepository),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<KeysService>(KeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Register key - successful', async () => {
    const newKey = {
      value: faker.internet.email(),
    };

    expect(await service.register(uuid(), newKey)).toEqual({
      ...newKey,
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('Register key - User not found', async () => {
    const newKey = {
      value: faker.internet.email(),
    };

    mockUsersRepository.findOne.mockImplementationOnce(() => null);

    await expect(
      async () => await service.register(uuid(), newKey),
    ).rejects.toThrowError(NotFoundException);
  });

  it('Register key - Limit of three keys reached', async () => {
    const newKey = {
      value: faker.internet.email(),
    };

    mockUsersRepository.findOne.mockImplementationOnce((userId) => ({
      id: userId,
      ...mockUser,
      keys: [
        {
          id: uuid(),
          value: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          value: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          value: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    }));

    await expect(
      async () => await service.register(uuid(), newKey),
    ).rejects.toThrowError(BadRequestException);
  });

  it('Register key - Key already exists', async () => {
    const newKey = {
      value: faker.internet.email(),
    };

    mockKeysRepository.findOne.mockImplementationOnce(() => ({
      ...newKey,
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await expect(
      async () => await service.register(uuid(), newKey),
    ).rejects.toThrowError(BadRequestException);
  });

  it('Register key - Internal server error exists', async () => {
    const newKey = {
      value: faker.internet.email(),
    };

    mockKeysRepository.save.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(
      async () => await service.register(uuid(), newKey),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('List keys by user - successful', async () => {
    mockUsersRepository.findOne.mockImplementationOnce((userId) => ({
      id: userId,
      ...mockUser,
      keys: [
        {
          id: uuid(),
          value: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          value: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          value: faker.internet.email(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    }));

    expect(await service.list(uuid())).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          value: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]),
    );
  });
});
