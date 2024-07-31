import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from '../tweet/tweet.entity';
import { User } from '../user/user.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { TweetDto } from './dto/tweet.dto';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getTweetsWithHashtag(hashtag: string): Promise<TweetDto[]> {
    return this.tweetRepository
      .createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.user', 'user')
      .where('tweet.hashtags LIKE :hashtag', { hashtag: `%${hashtag}%` })
      .getMany();
  }

  async saveTweetData(tweetJson: CreateTweetDto): Promise<TweetDto> {
    const { tweet, user } = transformTweetData(tweetJson);
    
    let existingUser = await this.userRepository.findOne({ where: { userId: user.userId } });
    if (!existingUser) {
      existingUser = await this.userRepository.save(user);
    }
    tweet.user = existingUser;

    const savedTweet = await this.tweetRepository.save(tweet);
    return savedTweet;
  }
  async getAllTweets(): Promise<Tweet[]> {
    return await this.tweetRepository.find({ relations: ['user'] });
  }

  async getAllHashtags(): Promise<string[]> {
    const tweets = await this.tweetRepository.find();
    const hashtags = new Set<string>();
    tweets.forEach(tweet => {
      tweet.hashtags.forEach(hashtag => hashtags.add(hashtag));
    });
    return Array.from(hashtags);
  }
}

function transformTweetData(tweetJson: CreateTweetDto): { tweet: Tweet, user: User } {
  const user = new User();
  user.userId = tweetJson.user.id_str;
  user.screenName = tweetJson.user.screen_name;
  user.description = tweetJson.user.description || '';

  const tweet = new Tweet();
  tweet.tweetId = tweetJson.id_str;
  tweet.text = tweetJson.text;
  tweet.createdAt = tweetJson.created_at;
  tweet.type = tweetJson.in_reply_to_status_id ? 'reply' : tweetJson.retweeted_status ? 'retweet' : 'original';
  tweet.inReplyToUserId = tweetJson.in_reply_to_user_id_str || null;
  tweet.retweetedStatusUserId = tweetJson.retweeted_status?.user?.id_str || null;
  tweet.hashtags = tweetJson.entities.hashtags.map((h) => h.text);

  tweet.user = user;

  return { tweet, user };
}
