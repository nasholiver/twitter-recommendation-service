import { TweetService } from './tweet.service';
import { Tweet } from './tweet.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TweetService', () => {
  let service: TweetService;
  let tweetRepository: Repository<Tweet>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TweetService,
        {
          provide: getRepositoryToken(Tweet),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TweetService>(TweetService);
    tweetRepository = module.get<Repository<Tweet>>(getRepositoryToken(Tweet));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
