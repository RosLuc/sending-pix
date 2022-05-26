import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../../models/users/users.service';
import { UsersRepository } from '../../models/users/users.repository';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    findOne: jest.fn(() => null),
    create: jest.fn((dto) => ({
      ...dto,
      id: uuid(),
    })),
    save: jest.fn((user) =>
      Promise.resolve({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    find: jest.fn(() => [
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
        UsersService,
        {
          provide: getRepositoryToken(UsersRepository),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create user - successful', async () => {
    const newUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      telephone: faker.phone.phoneNumber(),
    };

    expect(await service.create(newUser)).toEqual({
      ...newUser,
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('Create user - email already in use', async () => {
    const newUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      telephone: faker.phone.phoneNumber(),
    };

    mockUsersRepository.findOne.mockImplementationOnce(() => newUser);

    await expect(
      async () => await service.create(newUser),
    ).rejects.toThrowError(BadRequestException);
  });

  it('Create user - Internal server error exists', async () => {
    const newUser = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      telephone: faker.phone.phoneNumber(),
    };

    mockUsersRepository.save.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(
      async () => await service.create(newUser),
    ).rejects.toThrowError(InternalServerErrorException);
  });

  it('List user - successful', async () => {
    expect(await service.list()).toEqual(
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
  });
});
