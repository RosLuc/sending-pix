import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn((dto) => ({
      ...dto,
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    list: jest.fn(() => [
      {
        id: uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        telephone: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        telephone: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        telephone: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Create user - successful', async () => {
    const newUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      telephone: faker.phone.phoneNumber(),
    };

    expect(await controller.create(newUser)).toEqual({
      ...newUser,
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(mockUsersService.create).toHaveBeenCalled();
  });

  it('List user - successful', async () => {
    expect(await controller.list()).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          telephone: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]),
    );

    expect(mockUsersService.list).toHaveBeenCalled();
  });
});
