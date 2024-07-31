import { Test, TestingModule } from '@nestjs/testing';
import { ETLService } from './etl.service';
import { User } from '../user/user.entity';
import { Tweet } from '../tweet/tweet.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as fs from 'fs';

describe('ETLService', () => {
  let service: ETLService;
  let userRepository: Repository<User>;
  let tweetRepository: Repository<Tweet>;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ETLService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tweet),
          useClass: Repository,
        },
        {
          provide: EntityManager,
          useValue: {
            transaction: jest.fn().mockImplementation((cb) => cb({
              findOne: jest.fn(),
              save: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ETLService>(ETLService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    tweetRepository = module.get<Repository<Tweet>>(getRepositoryToken(Tweet));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
