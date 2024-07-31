import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from '../tweet/tweet.entity';
import { User } from '../user/user.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getRecommendations(userId: string, type: string, phrase: string, hashtag: string) {
    const query = this.tweetRepository.createQueryBuilder('tweet')
      .innerJoinAndSelect('tweet.user', 'user')
      .where('tweet.userId = :userId', { userId });

    if (type) {
      query.andWhere('tweet.type = :type', { type });
    }

    if (phrase) {
      query.andWhere('tweet.text LIKE :phrase', { phrase: `%${phrase}%` });
    }

    if (hashtag) {
      query.andWhere(':hashtag = ANY(tweet.hashtags)', { hashtag });
    }

    const tweets = await query.getMany();
    return this.processTweets(tweets);
  }

  private processTweets(tweets: Tweet[]) {
    const userScores = new Map<number, number>();

    tweets.forEach(tweet => {
      const userId = tweet.user.id;
      let score = userScores.get(userId) || 0;
      score += this.calculateInteractionScore(tweet);
      userScores.set(userId, score);
    });

    const sortedUsers = Array.from(userScores.entries())
      .map(([userId, score]) => ({ userId, score }))
      .sort((a, b) => b.score - a.score);

    return this.getUserDetails(sortedUsers);
  }

  private calculateInteractionScore(tweet: Tweet): number {
    let score = 0;
    if (tweet.type === 'reply') score += 10;
    if (tweet.type === 'retweet') score += 5;
    score += (tweet.likes || 0) * 0.2; // Adjust weights as needed
    score += (tweet.retweets || 0) * 0.3; // Adjust weights as needed
    return score;
  }

  private async getUserDetails(sortedUsers: { userId: number, score: number }[]): Promise<any[]> {
    const userIds = sortedUsers.map(user => user.userId);
    const users = await this.userRepository.findByIds(userIds);

    return users.map(user => ({
      userId: user.userId,
      screenName: user.screenName,
      description: user.description,
      score: sortedUsers.find(u => u.userId === user.id)?.score || 0,
    }));
  }
}
