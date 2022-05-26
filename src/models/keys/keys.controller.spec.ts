import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { KeysController } from './keys.controller';
import { KeysService } from './keys.service';

describe('KeysController', () => {
  let controller: KeysController;

  const mockKeysService = {
    register: jest.fn((_, newKeys) => ({
      ...newKeys,
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    list: jest.fn(() => [
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
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: KeysService,
          useValue: mockKeysService,
        },
      ],
      controllers: [KeysController],
    }).compile();

    controller = module.get<KeysController>(KeysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Register keys - successful', async () => {
    const newKey = {
      value: faker.internet.email(),
    };

    expect(await controller.create(uuid(), newKey)).toEqual({
      ...newKey,
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(mockKeysService.register).toHaveBeenCalled();
  });

  it('List keys - successful', async () => {
    expect(await controller.list(uuid())).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          value: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]),
    );

    expect(mockKeysService.list).toHaveBeenCalled();
  });
});
