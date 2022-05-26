import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsService } from '../../models/transactions/transactions.service';
import { UsersRepository } from '../../models/users/users.repository';
import { KeysRepository } from '../../models/keys/keys.repository';
import { TransactionsRepository } from '../../models/transactions/transactions.repository';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockUser = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    telephone: faker.phone.phoneNumber(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockKey = {
    value: faker.internet.email(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersRepository = {
    findOne: jest.fn((userId) => ({
      id: userId,
      ...mockUser,
      keys: [],
      sentTransactions: [
        {
          id: uuid(),
          value: faker.datatype.float(),
          createdAt: new Date(),
          updatedAt: new Date(),
          receiverUser: {
            id: uuid(),
            name: faker.name.findName(),
            email: faker.internet.email(),
            telephone: faker.phone.phoneNumber(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ],
    })),
  };

  const mockKeysRepository = {
    findOne: jest.fn(() => ({
      ...mockKey,
      user: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        telephone: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })),
  };

  const mockTransactionsRepository = {
    create: jest.fn((dto) => ({
      ...dto,
      id: uuid(),
    })),
    save: jest.fn((key) =>
      Promise.resolve({
        ...key,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
  };

  const mockMailerService = {
    sendMail: () => Promise.resolve(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(UsersRepository),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(KeysRepository),
          useValue: mockKeysRepository,
        },
        {
          provide: getRepositoryToken(TransactionsRepository),
          useValue: mockTransactionsRepository,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Register transaction - sucessfull', async () => {
    const newTransaction = {
      key: faker.internet.email(),
      value: faker.datatype.float(),
    };

    expect(await service.register(uuid(), newTransaction)).toEqual({
      id: expect.any(String),
      value: newTransaction.value,
      senderUser: expect.any(Object),
      receiverUser: expect.any(Object),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('Register transaction - User not found', async () => {
    const newTransaction = {
      key: faker.internet.email(),
      value: faker.datatype.float(),
    };

    mockUsersRepository.findOne.mockImplementationOnce(() => null);

    await expect(
      async () => await service.register(uuid(), newTransaction),
    ).rejects.toThrowError(NotFoundException);
  });

  it('Register transaction - key not found', async () => {
    const newTransaction = {
      key: faker.internet.email(),
      value: faker.datatype.float(),
    };

    mockKeysRepository.findOne.mockImplementationOnce(() => null);

    await expect(
      async () => await service.register(uuid(), newTransaction),
    ).rejects.toThrowError(NotFoundException);
  });

  it('Register transaction - It is not possible to carry out transactions for the same user', async () => {
    const newTransaction = {
      key: faker.internet.email(),
      value: faker.datatype.float(),
    };

    const uuidDefault = uuid();

    const mockTempUser = {
      ...mockUser,
      id: uuidDefault,
      keys: [],
      sentTransactions: [],
    };

    mockUsersRepository.findOne.mockImplementationOnce(() => mockTempUser);

    mockKeysRepository.findOne.mockImplementationOnce(() => ({
      ...mockKey,
      user: mockTempUser,
    }));

    await expect(
      async () => await service.register(uuid(), newTransaction),
    ).rejects.toThrowError(BadRequestException);
  });

  it('Register transaction - Internal server error exists', async () => {
    const newTransaction = {
      key: faker.internet.email(),
      value: faker.datatype.float(),
    };

    mockTransactionsRepository.save.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(
      async () => await service.register(uuid(), newTransaction),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('List transaction sent - sucessfull', async () => {
    expect(await service.listTransactionsSent(uuid())).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          value: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          receiverUser: {
            id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            telephone: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        },
      ]),
    );
  });
});
