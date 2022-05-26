import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../../models/transactions/transactions.controller';
import { TransactionsService } from '../../models/transactions/transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const mockTransactionsRepository = {
    register: jest.fn((userId, dto) => ({
      id: uuid(),
      value: dto.value,
      senderUser: {
        id: userId,
        name: faker.name.findName(),
        email: faker.internet.email(),
        telephone: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      receiverUser: {
        id: uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        telephone: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    listTransactionsSent: () => [
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsRepository,
        },
      ],
      controllers: [TransactionsController],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Create transaction - successful', async () => {
    const newTransaction = {
      key: faker.internet.email(),
      value: faker.datatype.float(),
    };

    expect(await controller.create(uuid(), newTransaction)).toEqual({
      id: expect.any(String),
      value: newTransaction.value,
      senderUser: expect.any(Object),
      receiverUser: expect.any(Object),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('List transaction sent- successful', async () => {
    expect(await controller.list(uuid)).toEqual(
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
