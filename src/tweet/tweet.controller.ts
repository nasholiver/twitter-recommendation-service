import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { TweetDto } from './dto/tweet.dto';
import { Tweet } from './tweet.entity';

@ApiTags('Tweets')
@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Post('save')
  @ApiResponse({ status: 201, description: 'Saves a tweet into the database', type: TweetDto })
  async saveTweet(@Body() tweetJson: CreateTweetDto): Promise<TweetDto> {
    return this.tweetService.saveTweetData(tweetJson);
  }

  @Get('with-hashtag')
  @ApiQuery({ name: 'hashtag', type: String, description: 'Hashtag to filter tweets by', required: true })
  @ApiResponse({ status: 200, description: 'Returns tweets containing the specified hashtag', type: [TweetDto] })
  async getTweetsWithHashtag(@Query('hashtag') hashtag: string): Promise<TweetDto[]> {
    return this.tweetService.getTweetsWithHashtag(hashtag);
  }

  @Get('hashtags')
  @ApiResponse({ status: 200, description: 'Returns all unique hashtags from tweets', type: [String] })
  async getAllHashtags(): Promise<string[]> {
    return this.tweetService.getAllHashtags();
  }
  @Get()
  @ApiResponse({ status: 200, description: 'Returns all tweets' })
  async getAllTweets(): Promise<Tweet[]> {
    return await this.tweetService.getAllTweets();
  }
}
