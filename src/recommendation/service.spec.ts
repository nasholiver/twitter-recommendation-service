import { RecommendationService } from './recommendation.service';
import { Tweet } from '../tweet/tweet.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RecommendationService', () => {
  let service: RecommendationService;
  let tweetRepository: Repository<Tweet>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
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

    service = module.get<RecommendationService>(RecommendationService);
    tweetRepository = module.get<Repository<Tweet>>(getRepositoryToken(Tweet));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
