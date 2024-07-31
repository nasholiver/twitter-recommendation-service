import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Recommendations')
@Controller('q2')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  @ApiQuery({
    name: 'user_id',
    type: String,
    description: 'The ID of the user for whom recommendations are being requested.',
    required: true,
  })
  @ApiQuery({
    name: 'type',
    type: String,
    description: 'The type of tweet to filter by. Options are "reply", "retweet", or "both".',
    required: false,
  })
  @ApiQuery({
    name: 'phrase',
    type: String,
    description: 'A phrase to search for in the tweet text.',
    required: false,
  })
  @ApiQuery({
    name: 'hashtag',
    type: String,
    description: 'A hashtag to filter tweets by.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of recommended users based on the query parameters.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userId: { type: 'string', example: '10000123' },
          screenName: { type: 'string', example: 'exampleUser' },
          description: { type: 'string', example: 'This is an example user description.' },
          score: { type: 'number', example: 85 },
        },
      },
    },
  })
  async getRecommendations(
    @Query('user_id') userId: string,
    @Query('type') type?: string,
    @Query('phrase') phrase?: string,
    @Query('hashtag') hashtag?: string,
  ) {
    return this.recommendationService.getRecommendations(userId, type, phrase, hashtag);
  }
}
