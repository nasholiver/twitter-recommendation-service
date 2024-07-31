import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweet.entity';
import { User } from '../user/user.entity';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet, User])],
  providers: [TweetService],
  controllers: [TweetController],
})
export class TweetModule {}
