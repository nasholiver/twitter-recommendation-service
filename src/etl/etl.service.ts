import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from '../user/user.entity';
import { Tweet } from '../tweet/tweet.entity';

@Injectable()
export class ETLService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly entityManager: EntityManager,
  ) {}

  async runETL(filePath: string): Promise<void> {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const lines = rawData.split('\n');
    
    await this.entityManager.transaction(async transactionalEntityManager => {
      for (const line of lines) {
        try {
          const tweetData = JSON.parse(line);

          if (!this.isValidTweet(tweetData)) {
            continue;
          }

          let user = await transactionalEntityManager.findOne(User, { where: { userId: tweetData.user.id_str } });
          if (!user) {
            user = this.userRepository.create({
              userId: tweetData.user.id_str,
              screenName: tweetData.user.screen_name,
              description: tweetData.user.description || '',
            });
          } else {
            user.screenName = tweetData.user.screen_name;
            user.description = tweetData.user.description || '';
          }

          let tweet = await transactionalEntityManager.findOne(Tweet, { where: { tweetId: tweetData.id_str } });
          if (!tweet) {
            tweet = this.tweetRepository.create({
              tweetId: tweetData.id_str,
              text: tweetData.text,
              createdAt: new Date(tweetData.created_at),
              type: tweetData.in_reply_to_status_id ? 'reply' : tweetData.retweeted_status ? 'retweet' : 'original',
              inReplyToUserId: tweetData.in_reply_to_user_id_str || null,
              retweetedStatusUserId: tweetData.retweeted_status?.user?.id_str || null,
              hashtags: tweetData.entities.hashtags.map(h => h.text.toLowerCase()),
              user: user,
            });
          } else {
            tweet.text = tweetData.text;
            tweet.createdAt = new Date(tweetData.created_at);
            tweet.type = tweetData.in_reply_to_status_id ? 'reply' : tweetData.retweeted_status ? 'retweet' : 'original';
            tweet.inReplyToUserId = tweetData.in_reply_to_user_id_str || null;
            tweet.retweetedStatusUserId = tweetData.retweeted_status?.user?.id_str || null;
            tweet.hashtags = tweetData.entities.hashtags.map(h => h.text.toLowerCase());
            tweet.user = user;
          }

          await transactionalEntityManager.save(user);
          await transactionalEntityManager.save(tweet);
        } catch (error) {
          console.error(`Error processing tweet: ${error.message}`, line);
        }
      }
    });
  }

  private isValidTweet(tweet: any): boolean {
    return tweet && tweet.id_str && tweet.user && tweet.user.id_str && tweet.text;
  }
}
